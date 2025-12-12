import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // This page is no longer used - redirect to home
    // The OAuth callback is now handled by /api/login
    router.replace('/');
  }, [router]);

  return (
    <div style={{
      fontFamily: 'sans-serif',
      background: '#0f172a',
      color: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '16px' }}>Redirecting...</div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '4px solid rgba(255,255,255,0.2)',
          borderTopColor: '#38bdf8',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px',
        }}></div>
      </div>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
