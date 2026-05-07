"use client";
import React from 'react';
import { api } from '../../lib/apiClient';

export default function PredictPage() {
  const [exam, setExam] = React.useState('JEE_MAIN');
  const [rank, setRank] = React.useState('');
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const rankError = submitted && !rank ? 'Enter your rank' : submitted && (isNaN(Number(rank)) || Number(rank) < 1) ? 'Valid number required' : '';

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitted(true);
    if (!rank || isNaN(Number(rank)) || Number(rank) < 1) return;
    try {
      setLoading(true);
      const url = api(`/predict?exam=${encodeURIComponent(exam)}&rank=${encodeURIComponent(rank)}`);
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch predictions');
      const j = await res.json();
      setResults(j.results || []);
    } catch (err) {
      setError((err as Error).message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="space-y-6">
      <section className="hero-card p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="metric-pill mb-3">Rank-based predictor</div>
          <h1 className="page-title">Estimate your college options from a single rank.</h1>
          <p className="page-subtitle mt-3">Enter your exam rank and get colleges grouped into SAFE, TARGET, and STRETCH bands using cutoff-driven logic.</p>
        </div>
      </section>

      <section className="surface p-5 sm:p-6">
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-[220px_1fr_auto] md:items-end">
          <label>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Exam</span>
            <select className="select-field w-full" value={exam} onChange={e => setExam(e.target.value)}>
              <option value="JEE_MAIN">JEE Main</option>
            </select>
          </label>
          <label>
            <span className={`mb-2 block text-xs font-semibold uppercase tracking-[0.16em] ${rankError ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>Rank {rankError && `• ${rankError}`}</span>
            <input className={`input-field ${rankError ? 'border-rose-300 bg-rose-50 dark:border-rose-600 dark:bg-rose-950/20' : ''}`} placeholder="e.g., 15000" value={rank} onChange={e => setRank(e.target.value)} />
          </label>
          <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Predicting...' : 'Predict'}</button>
        </form>
      </section>

      {error && (
        <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/20">
          <p className="text-sm font-medium text-rose-900 dark:text-rose-200">Error: {error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
          <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200">✓ Found {results.length} colleges for rank {rank}</p>
        </div>
      )}

      {loading && (
        <div className="grid gap-4 lg:grid-cols-3">
          {['SAFE', 'TARGET', 'STRETCH'].map(band => (
            <div key={band} className="surface space-y-3 p-5">
              <div className="h-6 w-20 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid gap-4 lg:grid-cols-3">
          {['SAFE', 'TARGET', 'STRETCH'].map(band => {
            const bandResults = results.filter(r => r.band === band);
            const bandStyles: Record<string, string> = {
              SAFE: 'border-emerald-300/70 bg-emerald-500/5 text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300',
              TARGET: 'border-amber-300/70 bg-amber-500/5 text-amber-700 dark:border-amber-500/30 dark:text-amber-300',
              STRETCH: 'border-sky-300/70 bg-sky-500/5 text-sky-700 dark:border-sky-500/30 dark:text-sky-300'
            };
            return (
              <section key={band} className={`surface p-5 ${bandStyles[band]}`}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">{band}</h3>
                  <span className="chip">{bandResults.length}</span>
                </div>
                {bandResults.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">No colleges in this band yet.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {bandResults.map(r => (
                      <li key={`${r.collegeId}-${r.courseName}`} className="surface-strong p-4 shadow-sm">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{r.collegeName}</div>
                        <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{r.city}, {r.state}</div>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                          <span className="chip">{r.courseName}</span>
                          <span className="chip">Closing rank {r.closingRank}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
