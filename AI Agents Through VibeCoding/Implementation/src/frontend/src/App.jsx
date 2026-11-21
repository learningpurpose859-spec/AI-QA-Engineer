import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GeneratorView from './components/GeneratorView';
import SettingsView from './components/SettingsView';
import { fetchConfigStatus } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'settings'
  const [configStatus, setConfigStatus] = useState(null);

  const loadStatus = async () => {
    try {
      const data = await fetchConfigStatus();
      setConfigStatus(data);
    } catch (err) {
      console.warn('Could not fetch server configuration status:', err.message);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'generator' ? (
          <GeneratorView
            modelName={configStatus?.groqModel || 'openai/gpt-oss-120b'}
          />
        ) : (
          <SettingsView
            configStatus={configStatus}
            onConfigRefresh={(newStatus) => setConfigStatus(newStatus)}
          />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-[#1E293B] py-6 px-4 text-center text-xs text-slate-500">
        <p>Intelligent Test Plan &bull; AI-Powered Jira Quality Engineering Suite &bull; Groq LLM Acceleration</p>
      </footer>
    </div>
  );
}
