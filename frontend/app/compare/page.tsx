"use client";
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '../../lib/apiClient';

export default function ComparePage() {
  const search = useSearchParams();
  const idsParam = search?.get('ids') || '';
  const [colleges, setColleges] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!idsParam) {
      setColleges([]);
      return;
    }

    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(api(`/colleges/compare?ids=${idsParam}`));
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load comparison data');
        if (!cancelled) setColleges(json.colleges || []);
      } catch (err) {
        if (!cancelled) setError((err as Error).message || 'Failed to load comparison data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [idsParam]);

  return (
    <main className="space-y-6">
      <section className="hero-card p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="metric-pill mb-3">Decision table</div>
          <h1 className="page-title">Compare colleges side by side.</h1>
          <p className="page-subtitle mt-3">Use this table to quickly scan location, fees, placement rate, rating, and key courses across your short list.</p>
        </div>
      </section>
      {loading ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading comparison data...</p>
      ) : error ? (
        <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
      ) : colleges.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No colleges to compare. Add at least two colleges from the explore page.</p>
      ) : (
                  <div className="surface-strong p-4 shadow-sm">
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
                <th className="border-b px-4 py-3 text-left font-semibold">Metric</th>
                {colleges.map(c => <th key={c.id} className="border-b px-4 py-3 text-left font-semibold align-top">{c.name}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr className="odd:bg-white/60 even:bg-slate-50/50 dark:odd:bg-slate-950/30 dark:even:bg-slate-900/50">
                <td className="border-b px-4 py-3 font-medium">Location</td>
                {colleges.map(c => <td key={c.id} className="border-b px-4 py-3">{c.city}, {c.state}</td>)}
              </tr>
              <tr className="odd:bg-white/60 even:bg-slate-50/50 dark:odd:bg-slate-950/30 dark:even:bg-slate-900/50">
                <td className="border-b px-4 py-3 font-medium">Avg Fees</td>
                {colleges.map(c => <td key={c.id} className="border-b px-4 py-3">₹{c.averageFees}</td>)}
              </tr>
              <tr className="odd:bg-white/60 even:bg-slate-50/50 dark:odd:bg-slate-950/30 dark:even:bg-slate-900/50">
                <td className="border-b px-4 py-3 font-medium">Placement %</td>
                {colleges.map(c => <td key={c.id} className="border-b px-4 py-3 text-emerald-600 dark:text-emerald-400">{c.placementRate}%</td>)}
              </tr>
              <tr className="odd:bg-white/60 even:bg-slate-50/50 dark:odd:bg-slate-950/30 dark:even:bg-slate-900/50">
                <td className="border-b px-4 py-3 font-medium">Rating</td>
                {colleges.map(c => <td key={c.id} className="border-b px-4 py-3">{c.rating}</td>)}
              </tr>
              <tr className="odd:bg-white/60 even:bg-slate-50/50 dark:odd:bg-slate-950/30 dark:even:bg-slate-900/50">
                <td className="border-b px-4 py-3 font-medium">Key Course</td>
                {colleges.map(c => <td key={c.id} className="border-b px-4 py-3">{c.keyCourse}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
