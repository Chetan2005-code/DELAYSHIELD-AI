import React from 'react';
import { BarChart3 } from 'lucide-react';

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen p-8 pt-8">
      <header className="mb-8 flex items-center gap-4">
        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
          <BarChart3 size={28} />
        </div>
        <h1 className="text-3xl font-black text-white">Advanced Analytics</h1>
      </header>
      
      <div className="glass-panel p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <BarChart3 size={48} className="text-slate-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">System Analytics & Reporting</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          Deep strategic insights, global cost savings, and AI performance metrics will be displayed here once data aggregation is complete.
        </p>
      </div>
    </div>
  );
};

export default AnalyticsPage;
