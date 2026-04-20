import React from 'react';
import { DollarSign, TrendingDown, AlertTriangle } from 'lucide-react';

const CostAnalysis = ({ currentCost, potentialLoss }) => {
  return (
    <div className="glass-panel p-6">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="text-risk-medium" />
        <h2 className="text-xl font-bold text-white">Cost Impact</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <p className="text-sm text-slate-400 mb-1">Base Cost</p>
          <p className="text-2xl font-black text-white">${currentCost}</p>
        </div>
        
        <div className="p-4 bg-risk-high/10 rounded-xl border border-risk-high/20">
          <p className="text-sm text-risk-high flex items-center gap-1 mb-1">
            <AlertTriangle size={14} /> Potential Loss
          </p>
          <p className="text-2xl font-black text-risk-high">+${potentialLoss}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center">
        <span className="text-sm text-slate-400">Projected Total</span>
        <span className="text-xl font-bold text-white">${currentCost + potentialLoss}</span>
      </div>
    </div>
  );
};

export default CostAnalysis;
