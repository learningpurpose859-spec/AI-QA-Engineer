import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, AlertCircle, ShieldCheck, RefreshCw } from 'lucide-react';
import { loadEnvConfig } from '../services/api';

export default function SettingsView({ configStatus, onConfigRefresh }) {
  const [envInput, setEnvInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleLoadConfig = async (e) => {
    e.preventDefault();
    if (!envInput.trim()) {
      setError('Please paste your .env contents first.');
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const updated = await loadEnvConfig(envInput);
      setMessage('Configuration loaded and applied successfully!');
      if (onConfigRefresh) onConfigRefresh(updated);
      setEnvInput('');
    } catch (err) {
      setError(err.message || 'Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const status = configStatus || {
    jiraBaseUrl: 'https://learningpurpose859.atlassian.net/',
    jiraCredentialsDisplay: 'Configured securely on server',
    jiraStatusText: 'Ready',
    optionalProvider: 'Groq configured on server',
    localOllama: 'Insufficient information to determine.',
    llmStatusText: 'Server-only configuration'
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Category Tag & Main Heading */}
      <div className="mb-8">
        <span className="text-[#22C55E] text-xs font-semibold tracking-wider uppercase font-mono">
          CONFIGURATION
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-1 mb-2 tracking-tight">
          Settings.
        </h1>
        <p className="text-slate-400 text-sm">
          Connections are read from the server environment.
        </p>
      </div>

      {/* Notifications */}
      {message && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2 Configuration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Card 01: Jira Connection */}
        <div className="bg-[#121826] border border-[#1E293B] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-[#1E293B]">
              <span className="text-[#22C55E] font-mono font-bold text-sm">01</span>
              <h2 className="text-white font-semibold text-base">Jira connection</h2>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">
                  Base URL
                </label>
                <div className="bg-[#080D1A] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 truncate select-all">
                  {status.jiraBaseUrl || 'https://arvindalagesan.atlassian.net/'}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">
                  Credentials
                </label>
                <div className="bg-[#080D1A] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>{status.jiraCredentialsDisplay || 'Configured securely on server'}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1E293B] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
            <span className="text-[#22C55E] text-xs font-medium">
              {status.jiraStatusText || 'Ready'}
            </span>
          </div>
        </div>

        {/* Card 02: LLM Configuration */}
        <div className="bg-[#121826] border border-[#1E293B] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-[#1E293B]">
              <span className="text-[#22C55E] font-mono font-bold text-sm">02</span>
              <h2 className="text-white font-semibold text-base">LLM configuration</h2>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">
                  Optional provider
                </label>
                <div className="bg-[#080D1A] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200">
                  {status.optionalProvider || 'Groq configured on server'}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">
                  Local Ollama
                </label>
                <div className="bg-[#080D1A] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs font-mono text-slate-400">
                  {status.localOllama || 'Insufficient information to determine.'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1E293B] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-amber-300 text-xs font-medium">
              {status.llmStatusText || 'Server-only configuration'}
            </span>
          </div>
        </div>
      </div>

      {/* Paste .env Section */}
      <div className="mt-6">
        <label className="block text-white text-sm font-medium mb-2">
          Paste .env file contents
        </label>
        <textarea
          value={envInput}
          onChange={(e) => setEnvInput(e.target.value)}
          placeholder={`JIRA_URL=https://your-domain.atlassian.net\nJIRA_EMAIL=you@example.com\nJIRA_TOKEN=...\nGROQ_TOKEN=...\nGROQ_MODEL=openai/gpt-oss-120b`}
          rows={5}
          className="w-full bg-[#080D1A] border border-[#1E293B] focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 rounded-xl p-4 text-xs font-mono text-slate-300 placeholder:text-slate-600 outline-none transition-all resize-y"
        />

        <div className="mt-3">
          <button
            onClick={handleLoadConfig}
            disabled={loading}
            className="inline-flex items-center gap-1.5 bg-[#86EFAC] hover:bg-[#4ADE80] text-black font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-900/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Loading configuration...</span>
              </>
            ) : (
              <>
                <span>Load configuration</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>

        <p className="text-slate-500 text-xs mt-2">
          Values are sent to the backend and are not stored in browser storage.
        </p>
      </div>
    </div>
  );
}
