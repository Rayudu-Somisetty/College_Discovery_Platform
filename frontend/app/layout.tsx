import '../styles/globals.css';
import React from 'react';
import Link from 'next/link';
import HeaderActions from '../components/HeaderActions';
import PageTransition from '../components/PageTransition';

export const metadata = {
  title: 'College Discovery Platform',
  description: 'Discover and compare colleges (MVP)'
};

const themeInitScript = `
(() => {
  try {
    const key = 'college-theme';
    const stored = localStorage.getItem(key);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
  } catch (_) {
    // no-op: keep default light theme if storage access fails
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="text-slate-900 transition-colors duration-300 dark:text-slate-100">
        <header className="sticky top-0 z-50 border-b border-white/60 bg-white/75 backdrop-blur transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/70">
          <div className="container flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <Link className="flex items-center gap-3 text-lg font-semibold tracking-tight" href="/">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">C</span>
              <span>College Discovery</span>
            </Link>
            <HeaderActions />
          </div>
        </header>
        <main className="container py-8 transition-colors duration-300 sm:py-10">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  );
}
