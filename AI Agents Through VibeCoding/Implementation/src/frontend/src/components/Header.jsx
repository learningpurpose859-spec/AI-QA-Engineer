import React from 'react';
import { Check, Settings, FileText } from 'lucide-react';

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="w-full border-b border-[#1E293B] bg-[#0B0F19]/90 backdrop-blur sticky top-0 z-50 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => onTabChange('generator')}
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            Intelligent Test Plan
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <button
            onClick={() => onTabChange('generator')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTab === 'generator'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Test Plan
          </button>
          <button
            onClick={() => onTabChange('settings')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Settings
          </button>
        </nav>
      </div>
    </header>
  );
}
