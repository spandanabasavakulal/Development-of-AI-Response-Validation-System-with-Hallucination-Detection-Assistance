import React from 'react';

interface ScoreIndicatorProps {
  score: number; // 0 to 100
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBar?: boolean;
}

export const ScoreIndicator: React.FC<ScoreIndicatorProps> = ({
  score,
  label,
  size = 'md',
  showBar = true
}) => {
  // Determine color based on quality score
  let textColor = 'text-green-600';
  let barColor = 'bg-green-600';
  let bgColor = 'bg-green-50';

  if (score < 60) {
    textColor = 'text-red-600';
    barColor = 'bg-red-600';
    bgColor = 'bg-red-50';
  } else if (score < 80) {
    textColor = 'text-amber-600';
    barColor = 'bg-amber-600';
    bgColor = 'bg-amber-50';
  }

  const scoreSizes = {
    sm: 'text-lg font-bold',
    md: 'text-2xl font-bold',
    lg: 'text-3xl font-extrabold',
    xl: 'text-5xl font-black'
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-1.5">
        <span className={`${textColor} ${scoreSizes[size]} tracking-tight font-sans`}>
          {Math.round(score)}
        </span>
        <span className="text-xs text-slate-400 font-medium">/ 100</span>
        {label && <span className="ml-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>}
      </div>
      {showBar && (
        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          />
        </div>
      )}
    </div>
  );
};
