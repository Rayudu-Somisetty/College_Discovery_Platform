import '../styles/globals.css';
import React from 'react';
import ThemeToggle from '../components/ThemeToggle';

export const metadata = {
  title: 'College Discovery Platform',
  description: 'Discover and compare colleges (MVP)'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="text-slate-900 dark:text-slate-100">
        <header className="sticky top-0 z-50 border-b border-white/60 bg-white/75 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
          <div className="container flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <a className="flex items-center gap-3 text-lg font-semibold tracking-tight" href="/">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">C</span>
              <span>College Discovery</span>
            </a>
            <div className="flex flex-wrap items-center gap-3">
              <nav className="flex flex-wrap gap-2">
                <a className="chip hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-300" href="/colleges">Explore</a>
                <a className="chip hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-300" href="/predict">Predictor</a>
                <a className="chip hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-300" href="/compare">Compare</a>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="container py-8 sm:py-10">{children}</main>
      </body>
    </html>
  );
}
