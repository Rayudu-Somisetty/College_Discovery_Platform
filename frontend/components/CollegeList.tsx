"use client";
import React from 'react';
import { api } from '../lib/apiClient';
import CollegeCard from './CollegeCard';
import FilterBar from './FilterBar';
import { CollegeSkeleton } from './Skeleton';

function mapFeeFilter(fee: string) {
  if (!fee) return {};
  if (fee === 'lt1') return { maxFee: 100000 };
  if (fee === '1to3') return { minFee: 100000, maxFee: 300000 };
  if (fee === 'gt3') return { minFee: 300000 };
  return {};
}

export default function CollegeList() {
  const [colleges, setColleges] = React.useState<any[]>([]);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(page === 1);
  const [hasMore, setHasMore] = React.useState(true);
  const [states, setStates] = React.useState<string[]>([]);
  const [filters, setFilters] = React.useState<{ q?: string; state?: string; course?: string; fee?: string }>({});
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    // derive states from initial fetch
    fetch(api('/colleges?page=1&limit=50'))
      .then(r => r.json())
      .then(j => {
        const s = Array.from(new Set((j.data || []).map((c:any) => c.state))).filter(Boolean) as string[];
        setStates(s);
      });
  }, []);

  React.useEffect(() => {
    setColleges([]);
    setPage(1);
    setHasMore(true);
  }, [filters.q, filters.state, filters.course, filters.fee]);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const q = new URLSearchParams();
      if (filters.q) q.set('q', filters.q);
      if (filters.state) q.set('location', filters.state);
      if (filters.course) q.set('course', filters.course);
      const feeMap = mapFeeFilter(filters.fee || '');
      if ((feeMap as any).minFee) q.set('minFee', String((feeMap as any).minFee));
      if ((feeMap as any).maxFee) q.set('maxFee', String((feeMap as any).maxFee));
      q.set('page', String(page));
      q.set('limit', '8');
      const res = await fetch(api(`/colleges?${q.toString()}`));
      const json = await res.json();
      if (cancelled) return;
      const items = json.data || [];
      setColleges(prev => page === 1 ? items : [...prev, ...items]);
      setHasMore((json.pagination?.page || 1) < (json.pagination?.totalPages || 1));
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [page, filters]);

  function onFilterChange(f: any) {
    setFilters(f);
  }

  function toggleCompare(college: any) {
    const key = 'compareCols';
    const raw = localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    const exists = list.find((x:any) => x.id === college.id);
    let next;
    if (exists) next = list.filter((x:any) => x.id !== college.id);
    else next = [...list, { id: college.id, name: college.name, slug: college.slug }].slice(-3);
    localStorage.setItem(key, JSON.stringify(next));
    // force re-render of CompareBar via storage event or simple state change
    window.dispatchEvent(new Event('storage'));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Explore colleges</h2>
          <p className="page-subtitle mt-1 text-sm">Search by name, filter by location, course, or fees, and compare up to three colleges.</p>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">{colleges.length} shown</div>
      </div>
      <FilterBar states={states} onChange={onFilterChange} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {colleges.map(c => (
          <div key={c.id} className="relative">
            <CollegeCard college={c} />
            <button onClick={() => toggleCompare(c)} className="chip absolute right-3 top-3 shadow-sm hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-200">
              Add to compare
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4">
        {loading ? <div className="text-sm text-slate-500 dark:text-slate-400">Loading...</div> : hasMore ? <button onClick={() => setPage(p => p + 1)} className="btn-secondary">Load more</button> : <div className="text-sm text-slate-500 dark:text-slate-400">No more results</div>}
      </div>
    </div>
  );
}

