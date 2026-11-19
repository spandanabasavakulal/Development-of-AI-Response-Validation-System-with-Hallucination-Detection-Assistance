import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  isDemo?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  change,
  trend,
  isDemo = true,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow transition-shadow duration-200 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="w-9 h-9 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform">
          <Icon className="w-5 h-5 text-brand-600" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
        {change && (
          <div className={`flex items-center text-xs font-medium ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500'
          }`}>
            {trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : trend === 'down' ? <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> : null}
            {change}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
        <span>{description}</span>
        {isDemo && (
          <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
            Sample
          </span>
        )}
      </div>
    </div>
  );
};
