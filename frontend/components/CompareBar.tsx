"use client";
import React from 'react';

export default function CompareBar() {
  const [items, setItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    function load() {
      const raw = localStorage.getItem('compareCols');
      const list = raw ? JSON.parse(raw) : [];
      setItems(list);
    }
    load();
    const onStorage = () => load();
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  if (!items.length) return null;

  const ids = items.map(i => i.id).join(',');

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 surface p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          <span className="chip bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">{items.length} selected</span>
          <span>Compare tray</span>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {items.map(i => <div key={i.id} className="chip whitespace-nowrap">{i.name}</div>)}
        </div>
        <div className="flex justify-end">
          <a className={`btn-primary min-w-[120px] text-center ${items.length < 2 ? 'pointer-events-none opacity-60' : ''}`} href={`/compare?ids=${ids}`}>
            Compare
          </a>
        </div>
      </div>
    </div>
  );
}
