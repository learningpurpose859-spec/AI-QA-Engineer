import React, { useState } from 'react';
import { ClipboardList, Plus, Minus, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { generateDocument } from '../services/api';
import DocumentViewer from './DocumentViewer';

const TAB_CONFIGS = {
  'test-plan': {
    label: 'Test Plan',
    buttonText: 'Generate Test Plan',
    description: 'Scope, gaps, scenarios, risks and a human review gate'
  },
  'test-strategy': {
    label: 'Test Strategy',
    buttonText: 'Generate Test Strategy',
    description: 'Enterprise test pyramid, quality gates, non-functional SLAs, and governance metrics'
  },
  'test-cases': {
    label: 'Test Cases',
    buttonText: 'Generate Test Cases',
    description: 'Atomic test cases, positive/negative/boundary/security scenarios, and RTM matrix'
  }
};

export default function GeneratorView({ modelName }) {
  const [selectedTab, setSelectedTab] = useState('test-plan');
  const [ticketInput, setTicketInput] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const activeTabConfig = TAB_CONFIGS[selectedTab];

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!ticketInput.trim()) {
      setError('Please enter a Jira issue key (e.g. LPT-1) or ticket URL.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingStep('Connecting to Jira and retrieving issue details...');

    try {
      setTimeout(() => {
        setLoadingStep('Extracting acceptance criteria and formatting template prompt...');
      }, 1500);

      setTimeout(() => {
        setLoadingStep('Synthesizing structured quality document via Groq AI...');
      }, 3000);

      const data = await generateDocument({
        ticketInput: ticketInput.trim(),
        artifactType: selectedTab,
        notes: notes.trim(),
        model: modelName
      });

      setResult(data);
    } catch (err) {
      setError(err.message || 'Generation failed. Please check your Jira and Groq credentials in Settings.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handleUseSample = (key) => {
    setTicketInput(key);
    setError(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Hero Section */}
      <div className="text-center mb-8 max-w-2xl">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1E293B]/80 border border-[#334155] shadow-xl text-amber-300 mb-4">
          <span className="text-2xl">📋</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
          Generate a test plan from a JIRA ticket
        </h1>
        <p className="text-slate-400 text-sm">
          Choose Test Plan, Test Strategy or Test Cases below, then enter a ticket key such as{' '}
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700">
            PROJ-123
          </span>{' '}
          or paste the ticket URL.
        </p>
      </div>

      {/* Main Generator Card */}
      <div className="w-full bg-[#121826] border border-[#1E293B] rounded-2xl p-4 sm:p-6 shadow-2xl transition-all">
        {/* Tab Selection Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-[#1E293B]/60">
          <div className="flex items-center gap-1.5 bg-[#0B0F19] p-1 rounded-xl border border-[#1E293B]">
            {Object.entries(TAB_CONFIGS).map(([key, config]) => {
              const isActive = selectedTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedTab(key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {config.label}
                </button>
              );
            })}
          </div>

          <span className="text-xs text-slate-400 italic pl-1 hidden sm:inline">
            {activeTabConfig.description}
          </span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder="JIRA ticket, e.g. PROJ-123 or https://your-org.atlassian.net/browse/PROJ-123"
              disabled={loading}
              className="flex-1 bg-[#080D1A] border border-[#1E293B] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-all font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <span>{activeTabConfig.buttonText}</span>
              )}
            </button>
          </div>

          {/* Quick sample ticket button */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Try sample ticket:</span>
            <button
              type="button"
              onClick={() => handleUseSample('LPT-1')}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-blue-400 font-mono transition-colors border border-slate-700"
            >
              LPT-1
            </button>
          </div>

          {/* Expandable Notes Area */}
          {showNotes && (
            <div className="animate-fadeIn pt-2">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Additional Tester Notes & Constraints:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Focus on edge-case email formats, 15-minute token expiry, and security regression checks."
                rows={3}
                disabled={loading}
                className="w-full bg-[#080D1A] border border-[#1E293B] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 outline-none transition-all resize-y font-sans"
              />
            </div>
          )}

          {/* Card Footer */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setShowNotes(!showNotes)}
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {showNotes ? (
                <>
                  <Minus className="w-3.5 h-3.5" />
                  <span>Hide notes</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add notes</span>
                </>
              )}
            </button>

            <div className="text-xs text-slate-400 font-mono">
              Model: Groq / {modelName || 'openai/gpt-oss-120b'}
            </div>
          </div>
        </form>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-xs uppercase tracking-wider text-rose-300">Operation Error</p>
              <p className="text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="w-full max-w-5xl mt-8 p-8 rounded-2xl bg-[#121826] border border-[#1E293B] flex flex-col items-center justify-center text-center animate-fadeIn shadow-xl">
          <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin mb-4"></div>
          <h3 className="text-white font-semibold text-base mb-1">Generating Quality Document</h3>
          <p className="text-slate-400 text-xs font-mono animate-pulse">{loadingStep || 'Processing request...'}</p>
        </div>
      )}

      {/* Document Result Viewer */}
      {result && <DocumentViewer result={result} onReset={() => setResult(null)} />}
    </div>
  );
}
