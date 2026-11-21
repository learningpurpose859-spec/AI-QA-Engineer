import React, { useState } from 'react';
import { Copy, Check, Download, ExternalLink, Code2, Eye, FileText, Sparkles } from 'lucide-react';
import { marked } from 'marked';

export default function DocumentViewer({ result, onReset }) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('rendered'); // 'rendered' | 'raw'

  if (!result || !result.markdown) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([result.markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.issueKey || 'QA'}-${result.artifactType || 'doc'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderedHtml = marked.parse(result.markdown);

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 mb-16 animate-fadeIn">
      {/* Top Issue Metadata Card */}
      <div className="bg-[#121826] border border-[#1E293B] rounded-2xl p-5 mb-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-md bg-blue-500/20 text-blue-400 font-mono text-sm font-semibold border border-blue-500/30">
              {result.issueKey}
            </span>
            <h2 className="text-white font-semibold text-base sm:text-lg">
              {result.issueSummary || 'Jira Issue Documentation'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {result.issueType && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {result.issueType}
              </span>
            )}
            {result.issuePriority && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {result.issuePriority}
              </span>
            )}
            {result.jiraBrowseUrl && (
              <a
                href={result.jiraBrowseUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors ml-2"
              >
                <span>Jira</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-[#1E293B]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('rendered')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'rendered'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'raw'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Raw Markdown</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .md</span>
            </button>
          </div>
        </div>
      </div>

      {/* Document Content View */}
      <div className="bg-[#121826] border border-[#1E293B] rounded-2xl p-6 sm:p-10 shadow-2xl">
        {viewMode === 'rendered' ? (
          <div
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        ) : (
          <pre className="font-mono text-xs text-slate-300 bg-[#080D1A] p-4 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed border border-[#1E293B]">
            {result.markdown}
          </pre>
        )}
      </div>
    </div>
  );
}
