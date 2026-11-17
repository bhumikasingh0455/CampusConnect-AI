import React from 'react';
import Card from './Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'up', // 'up' | 'down'
  color = 'indigo', // 'blue' | 'purple' | 'indigo' | 'emerald' | 'amber' | 'rose'
  className = ''
}) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
  };

  return (
    <Card className={`hover:border-slate-300 dark:hover:border-slate-700 transition-colors ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h4>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1 text-xs font-medium pt-1">
              {trendType === 'up' ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  {trend}
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400 flex items-center">
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                  {trend}
                </span>
              )}
              <span className="text-slate-400 dark:text-slate-500">vs last month</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${colorMap[color] || colorMap.indigo}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
