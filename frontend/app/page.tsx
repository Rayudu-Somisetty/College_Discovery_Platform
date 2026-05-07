"use client";
import React from 'react';

const streams = ['Engineering', 'Medicine', 'Design', 'Others', 'Law'];

const newsItems = [
  {
    title: 'JEE Main counselling schedule updated for the upcoming round',
    time: 'May 5, 2026, 03:39 PM IST',
    tone: 'from-sky-500 to-cyan-400'
  },
  {
    title: 'NEET aspirants can now compare colleges with category filters',
    time: 'May 5, 2026, 02:15 PM IST',
    tone: 'from-amber-500 to-orange-400'
  },
  {
    title: 'Top engineering institutes release refreshed placement reports',
    time: 'May 5, 2026, 01:40 PM IST',
    tone: 'from-indigo-500 to-violet-400'
  },
  {
    title: 'CLAT and design admissions timelines continue this week',
    time: 'May 5, 2026, 12:55 PM IST',
    tone: 'from-emerald-500 to-teal-400'
  }
];

const exams = ['JEE Main', 'CAT', 'CLAT', 'NEET'];

const colleges = [
  'IIT Delhi',
  'IIM Ahmedabad',
  'NLSIU Bengaluru',
  'AIIMS Delhi',
  'BITS Pilani',
  'NID Ahmedabad'
];

const predictorTools = [
  {
    title: 'Rank Predictor',
    description: 'Estimate your likely admission bands using rank, category, and preferences.',
    accent: 'from-indigo-500 to-sky-500'
  },
  {
    title: 'College Predictor',
    description: 'Shortlist colleges based on your score and compare realistic options side by side.',
    accent: 'from-orange-500 to-amber-400'
  }
];

const footerLinks = [
  { title: 'Top Exams', links: [['JEE Main', '/predict'], ['NEET', '/predict'], ['CAT', '/predict'], ['CLAT', '/predict']] },
  { title: 'College Reviews', links: [['Engineering', '/colleges'], ['Medicine', '/colleges'], ['Design', '/colleges'], ['Law', '/colleges']] },
  { title: 'Predictors & Ebooks', links: [['Rank Predictor', '/predict'], ['College Predictor', '/predict'], ['Guides', '/predict'], ['Downloads', '/predict']] },
  { title: 'Resources', links: [['Counselling', '/predict'], ['Notifications', '/colleges'], ['FAQs', '/compare'], ['Contact', '/']] }
];

function IconButton({ label }: { label: string }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
      <span>{label}</span>
      <span aria-hidden="true">→</span>
    </button>
  );
}

function NewsCard({ title, time, tone }: { title: string; time: string; tone: string }) {
  return (
    <article className="min-w-[280px] snap-start rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 hover:cursor-pointer">
      <div className="flex gap-4">
        <div className={`h-20 w-20 shrink-0 rounded-2xl bg-gradient-to-br ${tone}`} />
        <div className="min-w-0">
          <span className="inline-flex rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">Inline / Live</span>
          <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{title}</h3>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{time}</p>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <main className="space-y-8 sm:space-y-10">
      <section className="hero-card overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[1.5fr_1fr]">
          <div className="bg-[linear-gradient(135deg,rgba(238,242,255,0.98),rgba(219,234,254,0.92))] px-6 py-8 sm:px-10 sm:py-12 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.88))]">
            <div className="mb-4 flex flex-wrap gap-2">
              {streams.map(stream => (
                <span key={stream} className="chip bg-white/80 text-slate-700 shadow-sm dark:bg-slate-900/80 dark:text-slate-200">{stream}</span>
              ))}
            </div>
            <div className="max-w-2xl">
              <div className="metric-pill mb-4">Student-first discovery</div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
                Explore colleges with better filters, cleaner cards, and a persistent compare tray.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
                Browse the catalog, refine by location or course, and keep 2–3 colleges ready for side-by-side decision making.
              </p>

              <form onSubmit={(e) => {
                e.preventDefault();
                const q = new FormData(e.currentTarget).get('q');
                if (q) window.location.href = `/colleges?q=${encodeURIComponent(String(q))}`;
              }} className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white/90 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-950/70">
                <label className="flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  <span aria-hidden="true" className="text-xl">⌕</span>
                  <input
                    type="text"
                    name="q"
                    placeholder="Search colleges or city"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 focus:outline-none"
                  />
                  <button type="submit" className="hidden">Search</button>
                </label>
              </form>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-orange-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
                  Popular
                </span>
                <a className="btn-secondary rounded-full bg-white/90 dark:bg-slate-950/60" href="/predict">JEE Main College Predictor</a>
                <a className="btn-secondary rounded-full bg-white/90 dark:bg-slate-950/60" href="/predict">NEET College Predictor</a>
              </div>
            </div>
          </div>

          <aside className="bg-[linear-gradient(160deg,#1e1b4b_0%,#312e81_55%,#0f172a_100%)] px-6 py-8 text-white sm:px-8 sm:py-10 lg:min-h-full">
            <div className="flex h-full flex-col justify-between gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
              <div>
                <div className="metric-pill mb-4 bg-white/10 text-sky-100">College opportunities</div>
                <h2 className="text-3xl font-semibold tracking-tight text-white">Turn Your Score into College Opportunities</h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-slate-300 sm:text-base">
                  Predict your admission chances across colleges based on exam performance, category, and preferences.
                </p>
              </div>
              <div className="space-y-4">
                <IconButton label="Explore College Predictors" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Compare-ready</p>
                    <p className="mt-2 text-sm text-slate-200">Move from shortlisting to decision-making faster.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Built for students</p>
                    <p className="mt-2 text-sm text-slate-200">Clean UI, quick filters, and accessible contrast.</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">Latest News and Notifications</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Important updates for admissions, counselling, and exam timelines.</p>
          </div>
          <a className="btn-secondary rounded-full" href="/colleges">View All</a>
        </div>

        <style>{`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          .news-carousel:hover .carousel-item {
            animation-play-state: paused;
          }
          .carousel-item {
            animation: scroll-left 30s linear infinite;
          }
        `}</style>
        <div className="news-carousel flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:overflow-hidden">
          {[...newsItems, ...newsItems].map((item, idx) => (
            <div key={idx} className="carousel-item">
              <NewsCard {...item} />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="surface p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="metric-pill mb-3">Counselling support</p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">Video and expert counselling for your next step</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                Get structured counselling support, video explainers, and clearer decision paths for engineering and medicine aspirants.
              </p>
            </div>
            <div className="rounded-3xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200">
              Expert guided
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a className="btn-primary rounded-full" href="/predict">ENGINEERING UG</a>
            <a className="btn-secondary rounded-full" href="/predict">MEDICINE UG</a>
          </div>
        </article>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="surface p-6">
            <div className="metric-pill">Top Exams</div>
            <div className="mt-4 space-y-3">
              {exams.map(exam => (
                <div key={exam} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                  <span className="font-medium text-slate-900 dark:text-slate-100">{exam}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Explore</span>
                </div>
              ))}
            </div>
          </article>

          <article className="surface p-6">
            <div className="metric-pill">Top Colleges</div>
            <div className="mt-4 grid gap-3">
              {colleges.map(college => (
                <div key={college} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  {college}
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="surface p-6 xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="metric-pill mb-3">Predictors</p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">College and rank predictors designed to work together</h2>
            </div>
            <a className="btn-secondary rounded-full" href="/predict">Open predictor hub</a>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {predictorTools.map(tool => (
              <article key={tool.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className={`h-2 w-20 rounded-full bg-gradient-to-r ${tool.accent}`} />
                <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">{tool.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{tool.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="chip">Responsive</span>
                  <span className="chip">Accessible</span>
                  <span className="chip">Compare-aware</span>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="surface p-6">
          <div className="metric-pill">Quick actions</div>
          <div className="mt-4 space-y-3">
            <a className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-medium text-slate-900 transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800" href="/colleges">
              Explore colleges
            </a>
            <a className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-medium text-slate-900 transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800" href="/compare">
              Compare colleges
            </a>
            <a className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-medium text-slate-900 transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800" href="/predict">
              Predict admission chances
            </a>
          </div>
        </article>
      </section>

      <footer className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 px-6 py-8 text-slate-300 sm:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {footerLinks.map(section => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">{section.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                  {section.links.map(([label, href]) => (
                    <li key={label}><a className="transition hover:text-white" href={href}>{label}</a></li>
                ))}
              </ul>
            </div>
            ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>Copyright © 2026 College Discovery. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/10 px-3 py-1">Download our app</span>
            <span className="rounded-full border border-white/10 px-3 py-1">Android</span>
            <span className="rounded-full border border-white/10 px-3 py-1">iOS</span>
          </div>
        </div>
      </footer>
    </main>
  );
}


