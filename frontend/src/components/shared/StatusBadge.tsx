import React from 'react';
import { ClaimStatus, OverallVerdict } from '../../types/evaluation';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ClaimStatus | OverallVerdict | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showIcon = true }) => {
  const normalized = status.toLowerCase();

  let bg = 'bg-slate-100';
  let text = 'text-slate-700';
  let border = 'border-slate-200';
  let label = status;
  let Icon = HelpCircle;

  if (normalized === 'supported' || normalized === 'pass' || normalized === 'optimal') {
    bg = 'bg-green-50';
    text = 'text-green-700';
    border = 'border-green-200';
    Icon = CheckCircle2;
  } else if (normalized === 'unsupported' || normalized === 'needs improvement' || normalized === 'acceptable' || normalized === 'concerning') {
    bg = 'bg-amber-50';
    text = 'text-amber-700';
    border = 'border-amber-200';
    Icon = AlertTriangle;
  } else if (normalized === 'contradicted' || normalized === 'fail' || normalized === 'critical') {
    bg = 'bg-red-50';
    text = 'text-red-700';
    border = 'border-red-200';
    Icon = XCircle;
  } else if (normalized === 'inconclusive' || normalized === 'pending') {
    bg = 'bg-slate-100';
    text = 'text-slate-600';
    border = 'border-slate-300';
    Icon = HelpCircle;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium'
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${bg} ${text} ${border} ${sizeClasses[size]}`}>
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span className="capitalize">{label}</span>
    </span>
  );
};
