import React from 'react';

export const LoadingSkeleton = ({ count = 3, height = 'h-16', className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${height} w-full rounded-xl bg-slate-200/70 dark:bg-slate-800/60 animate-pulse`}
        />
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
    </div>
  );
};

export default LoadingSkeleton;
