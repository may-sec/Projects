import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowConsent(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowConsent(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-background/80 dark:bg-background/90 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-foreground/10 border border-border rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-foreground mb-2">
                We use cookies
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your browsing experience, serve personalized ads (via Google AdSense), and analyze our traffic. By clicking "Accept", you consent to our use of cookies.{' '}
                <Link href="/privacy" className="text-foreground hover:underline font-medium underline">
                  Read our Privacy Policy
                </Link>
              </p>
              
              {/* Footer Links */}
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4 sm:mb-0">
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto sm:ml-4">
              <button
                onClick={declineCookies}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg border-2 border-border bg-background hover:bg-muted text-foreground font-medium transition-all whitespace-nowrap"
              >
                Decline
              </button>
              <button
                onClick={acceptCookies}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-foreground text-background hover:opacity-90 font-semibold transition-all whitespace-nowrap"
              >
                Accept Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

