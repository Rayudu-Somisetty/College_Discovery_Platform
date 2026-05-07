export function CollegeSkeleton() {
  return (
    <div className="surface space-y-4 p-5">
      <div className="h-6 w-3/4 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="flex gap-2">
        <div className="h-6 w-12 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

export function FilterSkeleton() {
  return (
    <div className="surface flex flex-col gap-3 p-4 md:flex-row md:items-end">
      <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700 md:w-60" />
      <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700 md:w-40" />
      <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700 md:w-40" />
      <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700 md:w-40" />
    </div>
  );
}
