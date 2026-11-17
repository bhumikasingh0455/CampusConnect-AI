import React from 'react';

const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    primary: 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300',
    danger: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300',
    info: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300',
  };

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full uppercase tracking-wider ${variants[variant] || variants.default} ${sizes[size] || sizes.sm} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
