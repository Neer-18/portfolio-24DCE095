import React, { useState, useEffect } from 'react';

/**
 * LoadingFallback Component
 *
 * Practical 8: Fallback UI rendered by React Suspense while route chunks
 * are asynchronously fetched across the network.
 * Includes a minimum display duration / delay prevention to avoid UI flickers on fast connections.
 */
export default function LoadingFallback({ message = 'Loading page chunk...', minWait = 0 }) {
  const [ready, setReady] = useState(minWait === 0);

  useEffect(() => {
    if (minWait > 0) {
      const timer = setTimeout(() => setReady(true), minWait);
      return () => clearTimeout(timer);
    }
  }, [minWait]);

  if (!ready) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '360px',
        padding: '2.5rem 1rem',
        margin: '2rem auto',
        maxWidth: '520px',
        background: 'var(--accent-bg)',
        border: '1px solid var(--accent-border)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow)',
        backdropFilter: 'blur(8px)',
        textAlign: 'center',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '4px solid var(--border)',
          borderTopColor: 'var(--accent)',
          animation: 'spin 0.85s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite',
          marginBottom: '1.25rem'
        }}
      />
      <h3
        style={{
          margin: '0 0 0.5rem 0',
          fontSize: '1.15rem',
          fontWeight: 600,
          color: 'var(--text-h)'
        }}
      >
        {message}
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: '0.875rem',
          color: 'var(--text)',
          opacity: 0.85
        }}
      >
        Fetching lazy-loaded module via code-splitting...
      </p>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
