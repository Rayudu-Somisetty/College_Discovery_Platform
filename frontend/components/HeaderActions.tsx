"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/colleges', label: 'Explore' },
  { href: '/predict', label: 'Predictor' },
  { href: '/compare', label: 'Compare' }
];

function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function HeaderActions() {
  const pathname = usePathname() || '/';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <nav className="flex flex-wrap gap-2" aria-label="Primary navigation">
        {navItems.map((item) => {
          const isActive = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`chip nav-chip hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-300 ${isActive ? 'nav-chip-active dark:border-indigo-400/60 dark:bg-indigo-500/10 dark:text-indigo-200' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <ThemeToggle />
    </div>
  );
}
