import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Bell,
  Plus,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface TopNavbarProps {
  collapsed: boolean;
  isBackendConnected: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ collapsed, isBackendConnected }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/dashboard') return { title: 'Dashboard', sub: 'Overview & System Health' };
    if (path === '/evaluate') return { title: 'Evaluate Response', sub: 'Evidence-Based Multi-Judge Audit' };
    if (path.startsWith('/evaluations')) return { title: 'Evaluation Results', sub: 'Claim-Level Findings & Explainability' };
    if (path === '/history') return { title: 'Evaluation History', sub: 'Audit Log & Historical Archive' };
    if (path === '/agents') return { title: 'Agent Architecture', sub: 'End-to-End Multi-Agent Topology' };
    if (path === '/knowledge-base') return { title: 'Knowledge Base', sub: 'Grounding Corpora & Vector Index' };
    if (path === '/analytics') return { title: 'Analytics & Reports', sub: 'Quality Distributions & Hallucination Trends' };
    if (path === '/batch-evaluation') return { title: 'Batch Evaluation', sub: 'Dataset Scaled Audits' };
    return { title: 'AI Response Quality Evaluation System', sub: 'Infosys Springboard Project' };
  };

  const breadcrumb = getBreadcrumb();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/history?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const notifications = [
    {
      id: 1,
      title: 'Hallucination Detected',
      message: 'EVAL-2026-0839 contained contradicted release date and GPU cost assertions.',
      type: 'warning',
      time: '12m ago',
      link: '/evaluations/EVAL-2026-0839'
    },
    {
      id: 2,
      title: 'Knowledge Base Synchronized',
      message: '142 chunks indexed into FAISS for Enterprise_AI_Architecture_Guidelines_v3.pdf.',
      type: 'success',
      time: '1h ago',
      link: '/knowledge-base'
    },
    {
      id: 3,
      title: 'Evaluation Pass Threshold Met',
      message: 'EVAL-2026-0841 scored 92/100 with zero hallucinated assertions.',
      type: 'success',
      time: '3h ago',
      link: '/evaluations/EVAL-2026-0841'
    }
  ];

  return (
    <header
      className={`sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xs border-b border-slate-200 transition-all duration-300 flex items-center justify-between px-6 ${
        collapsed ? 'ml-20' : 'ml-64'
      }`}
    >
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">
            {breadcrumb.title}
          </h1>
          <p className="text-[11px] text-slate-500 mt-1 hidden sm:block">
            {breadcrumb.sub}
          </p>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <form onSubmit={handleSearchSubmit} className="w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search evaluation ID, question keywords, or claims..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Status indicator pills */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            FAISS: Ready
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-brand-700 border border-blue-200">
            <Sparkles className="w-3 h-3 text-brand-600" />
            Judges: 5 Active
          </span>
        </div>

        {/* New Evaluation Action */}
        <button
          onClick={() => navigate('/evaluate')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Evaluate Response</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">System Notifications</span>
                <span className="text-[10px] text-slate-400">Audit Stream</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      navigate(n.link);
                      setShowNotifications(false);
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {n.type === 'warning' ? (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      )}
                      <span className="text-xs font-semibold text-slate-800 truncate">{n.title}</span>
                      <span className="text-[10px] text-slate-400 ml-auto">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    navigate('/history');
                    setShowNotifications(false);
                  }}
                  className="text-[11px] text-brand-600 font-semibold hover:underline"
                >
                  View complete audit history →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
