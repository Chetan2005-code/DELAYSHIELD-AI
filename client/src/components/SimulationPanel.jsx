import React, { useState, useMemo } from 'react';
import { Sliders, Car, Clock, Plus, Trash2, Zap, AlertCircle, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { runSimulation } from '../services/api';

const SimulationPanel = () => {
  // --- BASE INPUT STATE ---
  const [baseInput, setBaseInput] = useState({
    traffic: 50,
    weather: 30,
    delay: 20,
    priority: "Medium"
  });

  // --- SCENARIO STATE ---
  const [scenarios, setScenarios] = useState([
    { id: 1, label: "Scenario 1", traffic: 80, delay: 40 }
  ]);
  
  const [results, setResults] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState(null);

  const addScenario = () => {
    if (scenarios.length >= 4) return;
    const nextId = scenarios.length > 0 ? Math.max(...scenarios.map(s => s.id)) + 1 : 1;
    setScenarios([...scenarios, { id: nextId, label: `Scenario ${nextId}`, traffic: 50, delay: 20 }]);
    setResults([]);
  };

  const removeScenario = (id) => {
    setScenarios(scenarios.filter(s => s.id !== id));
    setResults([]);
  };

  const updateScenario = (id, field, value) => {
    setScenarios(scenarios.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
    setResults([]);
  };

  const updateBaseInput = (field, value) => {
    setBaseInput(prev => ({ ...prev, [field]: value }));
    setResults([]);
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setError(null);
    try {
      // Build scenario payload with labels
      const scenarioPayload = scenarios.map((scen) => ({
        label: scen.label,
        traffic: parseInt(scen.traffic, 10) || 0,
        delay: parseInt(scen.delay, 10) || 0,
      }));

      const res = await runSimulation(baseInput, scenarioPayload);
      setResults(res);
    } catch (err) {
      console.error('Simulation failed:', err);
      setError('Neural network synchronization failed. Please check backend connectivity.');
    } finally {
      setIsSimulating(false);
    }
  };

  // Identify Best Scenario: Lowest Risk + Lowest Cost
  const bestScenario = useMemo(() => {
    if (!results || results.length === 0) return null;
    return results.reduce((prev, current) => {
      if (current.riskScore < prev.riskScore) return current;
      if (current.riskScore === prev.riskScore && current.cost < prev.cost) return current;
      return prev;
    });
  }, [results]);

  // Color Mapping for Risk Levels
  const getRiskColor = (level) => {
    const l = level?.toLowerCase();
    if (l === 'high') return 'text-red-500 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
    if (l === 'medium') return 'text-orange-500 border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800';
    return 'text-emerald-500 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800';
  };

  return (
    <div className="glass-panel p-6 border-2 border-slate-200/60 dark:border-slate-700 col-span-full xl:col-span-12 w-full mt-4 rounded-3xl overflow-hidden relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-xl shadow-indigo-500/30 ring-4 ring-indigo-50 dark:ring-indigo-900/20">
            <Zap size={24} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
              Neural Simulation Engine
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-widest font-black border border-indigo-200 dark:border-indigo-800">Beta v2.0</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">Execute what-if logistical models with real-time impact vectors.</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {scenarios.length < 4 && (
            <button 
              onClick={addScenario}
              className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 px-5 py-2.5 rounded-2xl transition-all shadow-sm"
            >
              <Plus size={18} strokeWidth={3} /> Add Scenario
            </button>
          )}
          <button 
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-sm px-6 py-2.5 rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-70 transform active:scale-95"
          >
            {isSimulating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sliders size={18} />}
            {isSimulating ? 'Processing Models...' : 'Execute Run'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: INPUTS */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* BASE INPUT SECTION */}
          <div className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Base Telemetry
            </h3>
            <div className="space-y-6">
              {/* Priority */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-tight">Priority Level</span>
                <div className="flex gap-1">
                  {['Low', 'Medium', 'High'].map(p => (
                    <button
                      key={p}
                      onClick={() => updateBaseInput('priority', p)}
                      className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all border-2 ${baseInput.priority === p ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Base Traffic */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">Base Traffic Index</span>
                  <span className="text-xs font-black text-indigo-600">{baseInput.traffic}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" 
                  value={baseInput.traffic} 
                  onChange={(e) => updateBaseInput('traffic', e.target.value)}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Base Delay */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">Base Delay Risk</span>
                  <span className="text-xs font-black text-orange-500">{baseInput.delay}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" 
                  value={baseInput.delay} 
                  onChange={(e) => updateBaseInput('delay', e.target.value)}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-orange-500"
                />
              </div>
            </div>
          </div>

          {/* SCENARIO BUILDER SECTION */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {scenarios.map((scen) => (
              <div key={scen.id} className="p-5 bg-white dark:bg-slate-800/80 rounded-3xl border-2 border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:border-indigo-300 dark:hover:border-indigo-500/40 relative group">
                <div className="flex justify-between items-center mb-4">
                   <input 
                    className="bg-transparent font-black text-slate-800 dark:text-slate-100 text-sm focus:outline-none border-b border-transparent focus:border-indigo-500" 
                    value={scen.label} 
                    onChange={(e) => updateScenario(scen.id, 'label', e.target.value)}
                  />
                  {scenarios.length > 1 && (
                    <button onClick={() => removeScenario(scen.id)} className="text-slate-400 hover:text-red-500 p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Simulated Traffic</span>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-300">{scen.traffic}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={scen.traffic} onChange={(e) => updateScenario(scen.id, 'traffic', e.target.value)} className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Simulated Delay</span>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-300">{scen.delay}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={scen.delay} onChange={(e) => updateScenario(scen.id, 'delay', e.target.value)} className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-orange-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: RESULTS & CHARTS */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-900/50 p-4 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          {results.length > 0 ? (
            <div className="flex flex-col gap-6">
              {/* RESULT CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((res) => (
                  <div key={res.id} className={`p-5 rounded-3xl border-2 transition-all relative overflow-hidden ${res.id === bestScenario?.id ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10' : 'border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-800/30'}`}>
                    {res.id === bestScenario?.id && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-emerald-500 text-white px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-lg shadow-emerald-500/20 animate-bounce">
                        <CheckCircle2 size={10} /> Best Option
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-black text-slate-800 dark:text-slate-100 tracking-tight">{res.label}</h4>
                        <div className={`mt-1.5 px-2 py-0.5 rounded-lg border text-[10px] font-black inline-block uppercase tracking-wider ${getRiskColor(res.riskLevel)}`}>
                          {res.riskLevel} RISK
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Impact Score</span>
                        <span className="text-xl font-black text-indigo-600 tabular-nums">{res.difference.impactScore}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Est. Cost</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-slate-700 dark:text-slate-200 text-lg tracking-tight">INR {res.cost}</span>
                          <span className={`text-[10px] font-bold flex items-center ${res.difference.isCostIncreased ? 'text-red-500' : 'text-emerald-500'}`}>
                            {res.difference.isCostIncreased ? <TrendingUp size={12} className="mr-0.5" /> : <TrendingDown size={12} className="mr-0.5" />}
                            {res.difference.costChange.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">AI Decision</span>
                        <div className="flex flex-col">
                          <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm uppercase tracking-wider">{res.decision}</span>
                          <span className="text-[9px] font-medium text-slate-500 truncate mt-0.5">{res.difference.decisionChange}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CHARTS */}
              <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-[32px] border-2 border-slate-100 dark:border-slate-700 min-h-[400px] flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">Global Impact Metrics</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/40" />
                      <span className="text-[10px] font-black text-slate-500 uppercase">Risk Index</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm shadow-purple-500/40" />
                      <span className="text-[10px] font-black text-slate-500 uppercase">Cost (K)</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 w-full h-full min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.4} />
                      <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 800 }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                        cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                      />
                      <Bar dataKey="riskScore" name="Risk %" fill="#6366f1" radius={[8, 8, 0, 0]} maxBarSize={40}>
                         {results.map((entry, index) => (
                          <Cell key={`risk-${index}`} fill={entry.id === bestScenario?.id ? '#10b981' : '#6366f1'} />
                        ))}
                      </Bar>
                      <Bar dataKey="cost" name="Cost" fill="#a855f7" radius={[8, 8, 0, 0]} maxBarSize={40}>
                         {results.map((entry, index) => (
                          <Cell key={`cost-${index}`} fill={entry.id === bestScenario?.id ? '#059669' : '#a855f7'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/50 dark:bg-slate-900/20 rounded-[40px] border-4 border-dashed border-slate-100 dark:border-slate-800 flex-1 flex flex-col items-center justify-center p-12 text-center min-h-[500px]">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-full mb-8 shadow-2xl shadow-indigo-500/10 ring-12 ring-slate-50 dark:ring-slate-900/50 group-hover:scale-110 transition-transform">
                <Sliders size={48} className="text-indigo-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-4 tracking-tight">Neural Simulation Awaiting</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed font-medium">Configure multiple logistical scenarios on the left, then execute the simulation to compare risk vectors, cost deltas, and AI-driven decision outcomes.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SimulationPanel;
