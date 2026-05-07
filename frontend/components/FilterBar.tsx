"use client";
import React from 'react';

type Props = {
  states: string[];
  onChange: (filters: { q?: string; state?: string; course?: string; fee?: string }) => void;
};

export default function FilterBar({ states, onChange }: Props) {
  const [q, setQ] = React.useState('');
  const [state, setState] = React.useState('');
  const [course, setCourse] = React.useState('');
  const [fee, setFee] = React.useState('');

  React.useEffect(() => {
    const t = setTimeout(() => onChange({ q, state, course, fee }), 250);
    return () => clearTimeout(t);
  }, [q, state, course, fee]);

  return (
    <div className="surface mb-6 p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <label className="flex-1">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Search</span>
          <input className="input-field" placeholder="Search colleges or city" value={q} onChange={e => setQ(e.target.value)} />
        </label>
        <label className="min-w-[180px]">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Location</span>
          <select className="select-field w-full" value={state} onChange={e => setState(e.target.value)}>
        <option value="">All States</option>
        {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="min-w-[180px]">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Course</span>
          <select className="select-field w-full" value={course} onChange={e => setCourse(e.target.value)}>
            <option value="">All Courses</option>
            <option value="BTECH">B.Tech</option>
            <option value="MBA">MBA</option>
            <option value="BSC">B.Sc</option>
          </select>
        </label>
        <label className="min-w-[180px]">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Fees</span>
          <select className="select-field w-full" value={fee} onChange={e => setFee(e.target.value)}>
            <option value="">Any Fee</option>
            <option value="lt1">&lt; ₹1L/year</option>
            <option value="1to3">₹1L–3L/year</option>
            <option value="gt3">&gt; ₹3L/year</option>
          </select>
        </label>
      </div>
    </div>
  );
}
