
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  History,
  Cpu,
  Database,
  BarChart3,
  Layers,
  Settings,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  isBackendConnected: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  onOpenSettings,
  onOpenHelp,
  isBackendConnected,
}) => {
  // User name state
  const [userName, setUserName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [showNameDialog, setShowNameDialog] = useState(false);

  // Load saved user name
  useEffect(() => {
    const savedName = localStorage.getItem('ai_eval_user_name');

    if (savedName) {
      setUserName(savedName);
    } else {
      setShowNameDialog(true);
    }
  }, []);

  // Save user name
  const handleSaveName = () => {
    const trimmedName = nameInput.trim();

    if (!trimmedName) return;

    localStorage.setItem('ai_eval_user_name', trimmedName);
    setUserName(trimmedName);
    setShowNameDialog(false);
  };

  // Generate initials from user name
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/evaluate', label: 'Evaluate Response', icon: CheckSquare },
    { to: '/evaluations/latest', label: 'Evaluation Results', icon: FileText },
    { to: '/history', label: 'Evaluation History', icon: History },
    { to: '/agents', label: 'Agent Architecture', icon: Cpu },
    { to: '/knowledge-base', label: 'Knowledge Base', icon: Database },
    { to: '/analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { to: '/batch-evaluation', label: 'Batch Evaluation', icon: Layers },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out bg-white border-r border-slate-200 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>

            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="text-sm font-bold text-slate-900 tracking-tight leading-none">
                  AI Eval Sentinel
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight
              className={`w-4 h-4 transform transition-transform ${
                collapsed ? '' : 'rotate-180'
              }`}
            />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0 transition-colors group-hover:text-brand-600" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls & User Profile */}
      <div className="p-3 border-t border-slate-200 space-y-2 bg-slate-50/50">
        <div className="space-y-0.5">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
            title={collapsed ? 'Evaluation Settings' : undefined}
          >
            <Settings className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Evaluation Settings</span>}
          </button>

          <button
            onClick={onOpenHelp}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
            title={collapsed ? 'Documentation & Guide' : undefined}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            {!collapsed && <span>System Documentation</span>}
          </button>
        </div>

        {/* Environment Status Badge */}
        {!collapsed && (
          <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px]">
            <div className="flex items-center justify-between font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isBackendConnected
                      ? 'bg-green-500'
                      : 'bg-amber-500 animate-pulse'
                  }`}
                />
                {isBackendConnected
                  ? 'FastAPI Connected'
                  : 'Demo / Simulation Mode'}
              </span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <p className="text-[10px] text-slate-500 mt-1 leading-tight">
              {isBackendConnected
                ? 'Connected to live Python evaluation service.'
                : 'Local FAISS & Multi-Agent emulation active.'}
            </p>
          </div>
        )}

        {/* Dynamic User Profile */}
        <button
          onClick={() => {
            setNameInput(userName);
            setShowNameDialog(true);
          }}
          className="w-full pt-1 flex items-center gap-3 px-2 py-1.5 rounded-lg text-left hover:bg-slate-100 transition-colors"
          title="Change user name"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {initials || 'U'}
          </div>

          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-slate-900 truncate">
                {userName || 'User'}
              </span>
              <span className="text-[10px] text-slate-500 truncate">
                Technical Evaluator
              </span>
            </div>
          )}
        </button>
      </div>

      {/* User Name Setup Dialog */}
      {showNameDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Welcome to AI Eval Sentinel
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter your name to personalize your workspace.
              </p>
            </div>

            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveName();
                }
              }}
              placeholder="e.g. Alex Johnson"
              maxLength={50}
              autoFocus
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
            />

            <button
              onClick={handleSaveName}
              disabled={!nameInput.trim()}
              className="mt-4 w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
