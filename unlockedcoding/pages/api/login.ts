// Authentication API - Google OAuth with MongoDB
import type { NextApiRequest, NextApiResponse } from 'next';
import { OAuth2Client } from 'google-auth-library';
import { createOrUpdateUser } from '../../lib/models/User';

const sanitizeRedirect = (redirect: unknown) => {
  if (!redirect || typeof redirect !== 'string') {
    return '/';
  }

  if (redirect.startsWith('http://') || redirect.startsWith('https://')) {
    return '/';
  }

  if (!redirect.startsWith('/')) {
    return `/${redirect}`;
  }

  return redirect;
};

const buildErrorHtml = (message: string, redirectTo: string) => {
  const safeRedirect = redirectTo || '/';
  const script = `
    (function(){
      setTimeout(function() {
        window.location.replace(${JSON.stringify(safeRedirect)});
      }, 3000);
    })();
  `;

  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Authentication Unavailable</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body style="font-family: sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
      <div style="text-align: center; max-width: 500px; padding: 2rem;">
        <div style="margin-bottom: 16px; font-size: 1.5rem; font-weight: bold;">Authentication Unavailable</div>
        <div style="margin-bottom: 24px; color: #94a3b8;">${message}</div>
        <div style="color: #64748b; font-size: 0.875rem;">Redirecting you back in 3 seconds...</div>
        <div style="margin-top: 24px;">
          <a href="${safeRedirect}" style="color: #38bdf8; text-decoration: underline;">Click here if you are not redirected</a>
        </div>
      </div>
      <script>${script}</script>
    </body>
  </html>`;
};

const buildCallbackHtml = (
  userPayload: { name: string; email: string; picture?: string | null; sub: string },
  redirectTo: string
) => {
  const safeRedirect = redirectTo || '/';
  const script = `
    (function(){
      var data = ${JSON.stringify(userPayload)};
      try {
        localStorage.setItem('lite-lms-user', JSON.stringify(data));
      } catch (error) {
        console.warn('Unable to persist user in localStorage', error);
      }
      var redirectUrl = ${JSON.stringify(safeRedirect)};
      if (!redirectUrl || typeof redirectUrl !== 'string') {
        redirectUrl = '/';
      }
      window.location.replace(redirectUrl);
    })();
  `;

  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Signing you in...</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body style="font-family: sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh;">
      <div style="text-align: center;">
        <div style="margin-bottom: 16px;">Authenticating with Google…</div>
        <div style="width: 48px; height: 48px; border-radius: 50%; border: 4px solid rgba(255,255,255,0.2); border-top-color: #38bdf8; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
        <noscript>
          JavaScript is required to complete the sign in. Please enable it and try again.
        </noscript>
      </div>
      <style>
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>
      <script>${script}</script>
    </body>
  </html>`;
};

// Pages Router API route handler (Node.js runtime)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const redirect = typeof req.query.redirect === 'string' ? req.query.redirect : req.query.redirect?.[0];
    const redirectTo = sanitizeRedirect(redirect || '/');

    // Check if Google OAuth is configured
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const mongodbUri = process.env.MONGODB_URI;

    if (!googleClientId || !googleClientSecret) {
      const errorHtml = buildErrorHtml(
        'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment variables.',
        redirectTo
      );
      res.status(503).setHeader('Content-Type', 'text/html; charset=utf-8').send(errorHtml);
      return;
    }

    if (!mongodbUri) {
      const errorHtml = buildErrorHtml(
        'MongoDB is not configured. Please set MONGODB_URI in your environment variables.',
        redirectTo
      );
      res.status(503).setHeader('Content-Type', 'text/html; charset=utf-8').send(errorHtml);
      return;
    }

    // Get origin from request
    const protocol = req.headers['x-forwarded-proto'] || (req.headers.referer?.startsWith('https') ? 'https' : 'http');
    const host = req.headers.host || 'localhost:3000';
    const origin = `${protocol}://${host}`;
    const callbackUrl = `${origin}/api/login`;

    // Initialize Google OAuth client
    const oauth2Client = new OAuth2Client(
      googleClientId,
      googleClientSecret,
      callbackUrl
    );

    // Handle OAuth callback - exchange code for tokens
    const code = typeof req.query.code === 'string' ? req.query.code : req.query.code?.[0];
    const state = typeof req.query.state === 'string' ? req.query.state : req.query.state?.[0];
    const error = typeof req.query.error === 'string' ? req.query.error : req.query.error?.[0];
    const errorDescription = typeof req.query.error_description === 'string' 
      ? req.query.error_description 
      : req.query.error_description?.[0];

    // Get redirect from state if available
    let finalRedirectTo = redirectTo;
    if (state) {
      try {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
        if (stateData.redirect) {
          finalRedirectTo = sanitizeRedirect(stateData.redirect);
        }
      } catch (stateError) {
        console.warn('Failed to parse state:', stateError);
      }
    }

    if (code) {
      try {
        // Exchange authorization code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Get user info from Google using the access token
        // This avoids clock skew issues with ID token verification
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        });

        if (!userInfoResponse.ok) {
          // Fallback: Decode ID token without strict verification (clock skew issue)
          // Since we got the token from Google's OAuth flow, we can trust it
          try {
            if (!tokens.id_token) {
              throw new Error('No ID token received from Google');
            }

            // Decode the JWT token without verification (we trust Google)
            // Format: header.payload.signature
            const parts = tokens.id_token.split('.');
            if (parts.length !== 3) {
              throw new Error('Invalid ID token format');
            }

            // Decode the payload (base64url)
            const payload = JSON.parse(
              Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
            );

            // Extract user data from decoded token
            const userData = {
              email: payload.email!,
              name: payload.name || payload.email?.split('@')[0] || 'User',
              picture: payload.picture || null,
              googleId: payload.sub,
            };

            // Store user in MongoDB
            try {
              await createOrUpdateUser(userData);
            } catch (dbError) {
              console.error('Failed to save user to MongoDB:', dbError);
              // Continue even if DB save fails - user can still be logged in
            }

            // Create user payload for frontend
            const userPayload = {
              name: userData.name,
              email: userData.email,
              picture: userData.picture,
              sub: userData.googleId,
            };

            const responseHtml = buildCallbackHtml(userPayload, finalRedirectTo);
            res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8').send(responseHtml);
            return;
          } catch (decodeError: any) {
            console.error('Failed to decode ID token:', decodeError);
            throw new Error(`Failed to get user information: ${decodeError.message}`);
          }
        }

        const userInfo = await userInfoResponse.json();

        // Extract user data from userinfo endpoint
        const userData = {
          email: userInfo.email!,
          name: userInfo.name || userInfo.email?.split('@')[0] || 'User',
          picture: userInfo.picture || null,
          googleId: userInfo.id,
        };

        // Store user in MongoDB
        try {
          await createOrUpdateUser(userData);
        } catch (dbError) {
          console.error('Failed to save user to MongoDB:', dbError);
          // Continue even if DB save fails - user can still be logged in
        }

        // Create user payload for frontend
        const userPayload = {
          name: userData.name,
          email: userData.email,
          picture: userData.picture,
          sub: userData.googleId,
        };

        const responseHtml = buildCallbackHtml(userPayload, finalRedirectTo);
        res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8').send(responseHtml);
        return;
      } catch (authError: any) {
        console.error('OAuth token exchange failed:', authError);
        const errorHtml = buildErrorHtml(
          `Authentication failed: ${authError.message || 'Invalid authorization code'}. Please try again.`,
          finalRedirectTo
        );
        res.status(400).setHeader('Content-Type', 'text/html; charset=utf-8').send(errorHtml);
        return;
      }
    }

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error, errorDescription);
      const errorHtml = buildErrorHtml(
        `Authentication failed: ${errorDescription || error}. Please try again.`,
        finalRedirectTo
      );
      res.status(400).setHeader('Content-Type', 'text/html; charset=utf-8').send(errorHtml);
      return;
    }

    // Initiate OAuth flow - redirect to Google OAuth
    const referer = req.headers.referer || '/';
    const redirectTarget = sanitizeRedirect(redirect || referer);
    
    // Generate authorization URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
      prompt: 'consent',
      state: Buffer.from(JSON.stringify({ redirect: redirectTarget })).toString('base64'),
    });

    res.redirect(authUrl);
  } catch (err: any) {
    console.error('Unexpected error during login', err);
    // Safely get redirect URL from request
    let redirectTo = '/';
    try {
      if (req && req.query && req.query.redirect) {
        const redirect = typeof req.query.redirect === 'string' 
          ? req.query.redirect 
          : req.query.redirect[0];
        redirectTo = sanitizeRedirect(redirect || '/');
      }
    } catch (urlError) {
      // If URL parsing fails, use default redirect
      console.warn('Failed to parse redirect in error handler:', urlError);
      redirectTo = '/';
    }
    
    const errorHtml = buildErrorHtml(
      `An unexpected error occurred during authentication: ${err.message || 'Unknown error'}. Please try again later.`,
      redirectTo
    );
    res.status(500).setHeader('Content-Type', 'text/html; charset=utf-8').send(errorHtml);
  }
}
