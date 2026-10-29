import React from 'react';
import { DimensionScore } from '../../types/evaluation';
import { StatusBadge } from './StatusBadge';
import { Target, CheckCircle2, ShieldAlert, Layers } from 'lucide-react';

interface ScoreCardProps {
  dimension: DimensionScore;
  onViewDetails?: () => void;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ dimension, onViewDetails }) => {
  const getIcon = () => {
    switch (dimension.name) {
      case 'Relevance': return Target;
      case 'Accuracy': return CheckCircle2;
      case 'Hallucination Assessment': return ShieldAlert;
      case 'Completeness': return Layers;
      default: return Target;
    }
  };

  const Icon = getIcon();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-colors flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center">
              <Icon className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">{dimension.name}</h4>
              <span className="text-[11px] text-slate-400">Weight: {Math.round(dimension.weight * 100)}%</span>
            </div>
          </div>
          <StatusBadge status={dimension.status} size="sm" />
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900">{dimension.score.toFixed(1)}</span>
          <span className="text-xs text-slate-400 font-medium">/ 5.0 raw</span>
          <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            {dimension.normalizedScore}%
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              dimension.normalizedScore >= 80 ? 'bg-green-600' :
              dimension.normalizedScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${dimension.normalizedScore}%` }}
          />
        </div>

        <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {dimension.explanation}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="font-medium text-slate-700 truncate max-w-[170px]">
          {dimension.keyObservation}
        </span>
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="text-brand-600 hover:text-brand-700 font-medium hover:underline cursor-pointer"
          >
            Findings →
          </button>
        )}
      </div>
    </div>
  );
};
