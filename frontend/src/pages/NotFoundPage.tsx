import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft, LayoutDashboard } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">404 - Page Not Found</h2>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">
        The requested URL route does not exist in the AI Response Quality Evaluation System.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Go Back
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
        >
          <LayoutDashboard className="w-3.5 h-3.5" /> Return to Dashboard
        </button>
      </div>
    </div>
  );
};
