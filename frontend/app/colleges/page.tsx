"use client";
import React from 'react';
import CollegeList from '../../components/CollegeList';
import CompareBar from '../../components/CompareBar';

export default function CollegesPage() {
  return (
    <main className="space-y-8">
      <section className="hero-card p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="metric-pill mb-3">Search + compare + shortlist</div>
          <h1 className="page-title">Explore colleges with better filters, cleaner cards, and a persistent compare tray.</h1>
          <p className="page-subtitle mt-3 max-w-2xl">Browse the catalog, refine by location or course, and keep 2–3 colleges ready for side-by-side decision making.</p>
        </div>
      </section>
      <CollegeList />
      <CompareBar />
    </main>
  );
}
