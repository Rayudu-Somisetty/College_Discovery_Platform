"use client";

import React from 'react';

const STORAGE_KEY = 'college-theme';

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: 'light' | 'dark') {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
}

export default function ThemeToggle() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null;
    const initial = stored || getSystemTheme();
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="group inline-flex h-9 w-16 items-center rounded-full border border-slate-300 bg-white p-1 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-400"
      aria-label="Toggle dark mode"
      aria-pressed={theme === 'dark'}
      title={mounted ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode` : 'Theme'}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-sm leading-none shadow transition-transform duration-300 ${
          theme === 'dark'
            ? 'translate-x-7 bg-indigo-500 text-white'
            : 'translate-x-0 bg-amber-100 text-amber-700'
        }`}
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
