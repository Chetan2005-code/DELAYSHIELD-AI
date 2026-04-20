import React from 'react';
import { Settings } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="min-h-screen p-8 pt-8">
      <header className="mb-8 flex items-center gap-4">
        <div className="p-3 bg-slate-700/50 rounded-xl text-slate-300">
          <Settings size={28} />
        </div>
        <h1 className="text-3xl font-black text-white">System Settings</h1>
      </header>
      
      <div className="glass-panel p-12 max-w-4xl min-h-[400px]">
        <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700/50 pb-4">Configuration Profile</h2>
        <div className="space-y-6">
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-1">API Integrations</h3>
            <p className="text-sm text-slate-400 mb-4">Manage connection keys for OpenRouteService and Google Gemini.</p>
            <button className="btn-secondary text-sm">Manage API Keys</button>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-1">Risk Weighting Engine</h3>
            <p className="text-sm text-slate-400 mb-4">Adjust the multiplier parameters for Delay, Traffic, and Weather severity.</p>
            <button className="btn-secondary text-sm">Tune Strategy Engine</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
