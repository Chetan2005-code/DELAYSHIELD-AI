import React, { useState } from 'react';
import { Sliders, CloudRain, Car } from 'lucide-react';

const SimulationPanel = () => {
  const [traffic, setTraffic] = useState(50);
  const [weather, setWeather] = useState(20);

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sliders className="text-primary-400" />
        <h2 className="text-xl font-bold text-white">What-If Simulation</h2>
      </div>
      <p className="text-sm text-slate-400 mb-6">
        Adjust real-world conditions to simulate impact on Risk & Decisions.
      </p>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300 flex items-center gap-2"><Car size={16}/> Traffic Congestion</span>
            <span className="text-primary-400 font-bold">{traffic}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            value={traffic} 
            onChange={(e) => setTraffic(e.target.value)}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300 flex items-center gap-2"><CloudRain size={16}/> Weather Severity</span>
            <span className="text-blue-400 font-bold">{weather}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            value={weather} 
            onChange={(e) => setWeather(e.target.value)}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <button className="w-full btn-secondary mt-4">
          Run Simulation
        </button>
      </div>
    </div>
  );
};

export default SimulationPanel;
