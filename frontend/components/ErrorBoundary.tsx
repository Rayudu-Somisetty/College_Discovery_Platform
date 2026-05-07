"use client";
import React from 'react';

export default function ErrorBoundary({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const handler = (event: ErrorEvent) => {
      console.error('Error caught:', event.error);
      setHasError(true);
    };
    window.addEventListener('error', handler);
    return () => window.removeEventListener('error', handler);
  }, []);

  if (hasError) {
    return (
      fallback || (
        <div className="rounded-3xl border-2 border-rose-200 bg-rose-50 p-6 dark:border-rose-900 dark:bg-rose-950/20">
          <h2 className="text-lg font-semibold text-rose-900 dark:text-rose-200">Something went wrong</h2>
          <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">
            An error occurred while loading this page. Please try refreshing.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary mt-4 rounded-full"
          >
            Refresh Page
          </button>
        </div>
      )
    );
  }

  return <>{children}</>;
}
