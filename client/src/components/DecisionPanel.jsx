import React from 'react';
import { BrainCircuit, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

const DecisionPanel = ({ insights }) => {
  if (!insights) return null;

  return (
    <div className="glass-panel p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
          <BrainCircuit size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Gemini AI Intelligence</h2>
          <p className="text-sm text-purple-300">Strategic Decision Engine</p>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-lg p-4 mb-6 border border-slate-700/50">
        <p className="text-sm text-slate-300 italic mb-3">"{insights.summary}"</p>
        <p className="text-xs text-slate-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-risk-medium"></span>
          {insights.dominantFactor}
        </p>
      </div>

      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Recommended Actions</h3>
      
      <div className="space-y-4 flex-1">
        {insights.actions.map((action, idx) => (
          <div 
            key={idx} 
            className={`p-4 rounded-xl border transition-all duration-300 ${
              action.recommended 
                ? 'bg-primary-500/10 border-primary-500/50 ring-1 ring-primary-500/20' 
                : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {action.recommended ? (
                  <CheckCircle2 size={18} className="text-primary-400" />
                ) : (
                  <XCircle size={18} className="text-slate-500" />
                )}
                <span className={`font-bold ${action.recommended ? 'text-primary-300' : 'text-slate-300'}`}>
                  {action.type}
                </span>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded bg-black/30 ${
                action.costImpact.includes('+') ? 'text-risk-high' : 'text-risk-low'
              }`}>
                {action.costImpact}
              </span>
            </div>
            
            <p className="text-sm text-white mb-2">{action.description}</p>
            <p className="text-xs text-slate-400 pb-3 mb-3 border-b border-slate-700/50">Trade-off: {action.tradeOff}</p>
            
            {action.recommended && (
              <button className="w-full btn-primary flex items-center justify-center gap-2 text-sm py-1.5">
                Execute Action <ArrowRight size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DecisionPanel;
