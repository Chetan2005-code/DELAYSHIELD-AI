import React from 'react';

const RiskMeter = ({ riskScore, factors }) => {
  const getRiskColor = (score) => {
    switch(score) {
      case 'High': return 'text-risk-high drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]';
      case 'Medium': return 'text-risk-medium drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]';
      default: return 'text-risk-low drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]';
    }
  };

  const colors = {
    traffic: 'bg-orange-500',
    weather: 'bg-blue-500',
    delay: 'bg-purple-500'
  };

  return (
    <div className="glass-panel p-6">
      <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
        <span className="w-2 h-6 bg-primary-500 rounded-full"></span>
        Risk Analysis
      </h2>
      
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-[8px] border-slate-700/50 mb-2">
          <div className="absolute inset-0 rounded-full animate-pulse-slow border-4 border-transparent"></div>
          <span className={`text-3xl font-black ${getRiskColor(riskScore)}`}>
            {riskScore}
          </span>
        </div>
        <p className="text-sm text-slate-400">Current Risk Level</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Risk Factors</h3>
        {Object.entries(factors).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400 capitalize">{key}</span>
              <span className="text-slate-200 font-medium">{value}%</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-2 rounded-full ${colors[key]} transition-all duration-1000`} 
                style={{ width: `${value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskMeter;
