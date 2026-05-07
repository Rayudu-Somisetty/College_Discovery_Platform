import React from 'react';

export default function CollegeCard({ college }: any) {
  return (
    <div className="surface h-full p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{college.name}</h3>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{college.city}, {college.state}</div>
        </div>
        <div className="metric-pill shrink-0">{college.rating ?? '—'} ★</div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="text-slate-600 dark:text-slate-300">Avg. fees <span className="font-semibold text-slate-900 dark:text-slate-100">₹{college.averageFees}</span></div>
        <div className="chip text-emerald-600 dark:text-emerald-400">{college.placementRate ?? '—'}% placement</div>
      </div>
    </div>
  );
}
