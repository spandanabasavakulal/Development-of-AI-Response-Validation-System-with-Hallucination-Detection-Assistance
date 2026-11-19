import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-slate-200 rounded-lg w-1/3"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-200 rounded-xl"></div>
        ))}
      </div>
      <div className="space-y-2 pt-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-12 bg-slate-200 rounded-lg w-full"></div>
        ))}
      </div>
    </div>
  );
};
