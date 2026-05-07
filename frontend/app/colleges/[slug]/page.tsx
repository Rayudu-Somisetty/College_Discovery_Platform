"use client";
import React from 'react';
import { api } from '../../../lib/apiClient';

export default function CollegeDetail({ params }: { params: { slug: string } }) {
  const [college, setCollege] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [compared, setCompared] = React.useState(false);

  React.useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(api(`/colleges/slug/${params.slug}`));
        if (!res.ok) throw new Error('College not found');
        const json = await res.json();
        setCollege(json.college);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.slug]);

  const toggleCompare = () => {
    if (!college) return;
    const key = 'compareCols';
    const raw = localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    const exists = list.find((x: any) => x.id === college.id);
    let next;
    if (exists) {
      next = list.filter((x: any) => x.id !== college.id);
      setCompared(false);
    } else {
      next = [...list, { id: college.id, name: college.name, slug: college.slug }].slice(-3);
      setCompared(true);
    }
    localStorage.setItem(key, JSON.stringify(next));
    window.dispatchEvent(new Event('storage'));
  };

  if (loading) {
    return (
      <main className="space-y-6">
        <div className="h-80 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-4">
          <div className="h-10 w-3/4 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-6 w-2/3 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !college) {
    return (
      <main className="space-y-6">
        <div className="rounded-3xl border-2 border-rose-200 bg-rose-50 p-6 dark:border-rose-900 dark:bg-rose-950/20">
          <h1 className="text-lg font-semibold text-rose-900 dark:text-rose-200">Oops! College not found</h1>
          <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">{error || 'The college you are looking for does not exist.'}</p>
          <a href="/colleges" className="btn-primary mt-4 inline-block rounded-full">← Back to Explore</a>
        </div>
      </main>
    );
  }

  const reviews = college.reviews || [];
  const courses = college.courses || [];

  return (
    <main className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section */}
      <section className="hero-card p-6 sm:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <span aria-hidden="true">📍</span>
              {college.city}, {college.state}
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl dark:text-white">{college.name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-amber-500">{college.rating || 4.5}</span>
                <span className="text-2xl">★</span>
              </div>
              <div className="h-8 w-px bg-slate-300 dark:bg-slate-600" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Placement Rate</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{college.placementRate ?? '—'}%</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:min-w-max">
            <button
              onClick={toggleCompare}
              className={`btn-primary rounded-full transition-all duration-300 ${
                compared ? 'ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-slate-950' : ''
              }`}
            >
              {compared ? '✓ Added to Compare' : '+ Add to Compare'}
            </button>
            <a href="/colleges" className="btn-secondary rounded-full text-center hover:bg-indigo-50 dark:hover:bg-slate-800">
              ← Back
            </a>
          </div>
        </div>
      </section>

      {/* Key Info Grid */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Average Fees', value: `₹${(college.averageFees / 100000).toFixed(1)}L` },
          { label: 'Avg Package', value: `₹${(college.avgPackage / 100000).toFixed(1)}L` },
          { label: 'Highest Package', value: `₹${(college.highestPackage / 100000).toFixed(1)}L` },
          { label: 'Key Course', value: courses[0]?.name || 'B.Tech' }
        ].map((item, idx) => (
          <article
            key={idx}
            className="surface p-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
          </article>
        ))}
      </section>

      {/* About Section */}
      <section className="surface p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">About {college.name}</h2>
        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
          {college.overview || 'A premier institute focused on academic excellence and holistic student development with a rich legacy of producing industry leaders.'}
        </p>
      </section>

      {/* Courses */}
      {college.courses && college.courses.length > 0 && (
        <section className="surface p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Offered Courses</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {courses.map((course: any) => (
              <div
                key={course.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/20"
              >
                {course.name}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Student Reviews ({reviews.length})</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {reviews.map((review: any) => (
              <article
                key={review.id}
                className="surface p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{review.studentName}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{review.title}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-200">
                    {review.rating} ★
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{review.body}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="rounded-3xl border-2 border-indigo-200 bg-indigo-50 p-6 text-center transition-all duration-300 hover:shadow-lg dark:border-indigo-900 dark:bg-indigo-950/20 sm:p-10">
        <h2 className="text-2xl font-semibold text-indigo-900 dark:text-indigo-200">Ready to apply?</h2>
        <p className="mt-2 text-sm text-indigo-700 dark:text-indigo-300">Check your eligibility and compare this college with others.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href="/predict" className="btn-primary rounded-full transition-transform duration-300 hover:scale-105">
            Check Admission Chances
          </a>
          <a href="/compare" className="btn-secondary rounded-full transition-transform duration-300 hover:scale-105">
            Compare with Others
          </a>
        </div>
      </section>
    </main>
  );
}
