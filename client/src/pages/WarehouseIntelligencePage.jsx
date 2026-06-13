import React, { useState } from 'react';
import { 
  Warehouse, AlertTriangle, CheckCircle2, TrendingUp, 
  ArrowRight, Package, Clock, Zap, MapPin, Boxes, ArrowRightLeft 
} from 'lucide-react';

const mockWarehouses = [
  { id: 'WH-Chennai-2', name: 'WH-Chennai-2', capacity: 350, load: 340, util: 97, risk: 'Critical', status: 'Congested', color: 'red' },
  { id: 'WH-Mumbai-1', name: 'WH-Mumbai-1', capacity: 500, load: 425, util: 85, risk: 'High', status: 'Near Capacity', color: 'amber' },
  { id: 'WH-Kolkata-4', name: 'WH-Kolkata-4', capacity: 450, load: 360, util: 80, risk: 'Medium', status: 'Busy', color: 'amber' },
  { id: 'WH-Delhi-3', name: 'WH-Delhi-3', capacity: 800, load: 520, util: 65, risk: 'Low', status: 'Operational', color: 'emerald' },
  { id: 'WH-Bangalore-1', name: 'WH-Bangalore-1', capacity: 600, load: 390, util: 65, risk: 'Low', status: 'Operational', color: 'emerald' },
  { id: 'WH-Hyderabad-2', name: 'WH-Hyderabad-2', capacity: 700, load: 280, util: 40, risk: 'Low', status: 'Available', color: 'emerald' }
];

const CircularProgress = ({ pct, colorStr, size = "w-20 h-20" }) => {
  const hexMap = {
    'red': '#ef4444',
    'amber': '#f59e0b',
    'emerald': '#10b981'
  };
  const color = hexMap[colorStr] || '#3b82f6';

  return (
    <svg className={size} viewBox="0 0 36 36">
      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${pct}, 100`} />
      <text x="18" y="20.5" textAnchor="middle" className="text-[10px] font-black fill-slate-700">{pct}%</text>
    </svg>
  );
};

const WarehouseIntelligencePage = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState(mockWarehouses[0]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30 text-white">
            <Warehouse size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-blue-950 tracking-tight font-display">Warehouse Intelligence</h1>
            <p className="text-xs font-bold text-blue-500/80 uppercase tracking-widest mt-1">Prevent Congestion Before It Happens</p>
          </div>
        </div>
      </div>

      {/* Warehouse Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {mockWarehouses.map((wh) => (
          <div 
            key={wh.id} 
            onClick={() => setSelectedWarehouse(wh)}
            className={`bg-white rounded-2xl border ${selectedWarehouse.id === wh.id ? 'border-blue-400 ring-2 ring-blue-100 shadow-md' : 'border-slate-200'} shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer p-5 relative overflow-hidden group`}
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-${wh.color}-500`}></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-800">{wh.name}</h3>
                <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold mt-1 px-2 py-0.5 rounded-full bg-${wh.color}-50 text-${wh.color}-700 border border-${wh.color}-200`}>
                  {wh.status}
                </span>
              </div>
              <CircularProgress pct={wh.util} colorStr={wh.color} size="w-14 h-14" />
            </div>
            
            <div className="flex justify-between items-center bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Capacity</p>
                <p className="font-bold text-slate-700 text-sm flex items-center gap-1"><Boxes className="w-3 h-3" /> {wh.capacity}</p>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Current Load</p>
                <p className="font-bold text-slate-700 text-sm flex items-center gap-1"><Package className="w-3 h-3" /> {wh.load}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail & AI Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Forecast Panel */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-800">Congestion Forecast</h2>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600">{selectedWarehouse.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row justify-around items-center mb-8 gap-8 sm:gap-4">
            <div className="flex flex-col items-center">
              <CircularProgress pct={selectedWarehouse.util} colorStr={selectedWarehouse.color} size="w-28 h-28" />
              <p className="font-bold text-slate-700 mt-3">Current Utilization</p>
              <p className="text-xs text-slate-500 font-medium">Real-time status</p>
            </div>
            <div className="hidden sm:block">
              <ArrowRight className="w-6 h-6 text-slate-300" />
            </div>
            <div className="flex flex-col items-center">
              <CircularProgress pct={Math.min(100, selectedWarehouse.util + 15)} colorStr={selectedWarehouse.risk === 'Low' ? 'amber' : 'red'} size="w-28 h-28" />
              <p className="font-bold text-slate-700 mt-3">Predicted (in 4 hrs)</p>
              <p className="text-xs text-slate-500 font-medium">Based on incoming ETAs</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mt-auto">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-${selectedWarehouse.color}-100 text-${selectedWarehouse.color}-600`}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Expected Queue Time</h3>
                <p className={`text-xl font-black mb-2 text-${selectedWarehouse.color}-600`}>
                  {selectedWarehouse.risk === 'Critical' ? '2.5 Hours' : selectedWarehouse.risk === 'High' ? '1.5 Hours' : '15 Minutes'}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedWarehouse.risk === 'Critical' 
                    ? "Incoming shipment volume exceeds processing capacity. Severe congestion imminent. Immediate rerouting recommended." 
                    : "Processing capacity is adequate for currently scheduled arrivals."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations Panel */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">AI Recommendations</h2>
          </div>

          <div className="space-y-4">
            {[
              { title: `Redirect to WH-Bangalore-1`, reason: `${selectedWarehouse.name} is approaching max capacity. Bangalore facility has 35% available space.`, saved: '45 min', count: 12 },
              { title: `Pre-allocate Surge Space`, reason: 'Historical data shows 2x spike on Friday evenings. Prepare auxiliary docks.', saved: '2 hours', count: 34 },
              { title: `Optimize Loading Sequence`, reason: 'Queue time is exceeding SLA for prioritized shipments. Reorder unloading.', saved: '30 min', count: 8 }
            ].map((rec, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                <div className="pl-2">
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{rec.title}</h3>
                  <p className="text-xs text-slate-500 mb-3 leading-relaxed">{rec.reason}</p>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex gap-3">
                      <div className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-[10px] font-bold border border-emerald-100 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Save {rec.saved}
                      </div>
                      <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-[10px] font-bold border border-blue-100 flex items-center gap-1">
                        <Package className="w-3 h-3" /> {rec.count} Shipments
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">Dismiss</button>
                      <button className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30 flex items-center gap-1">
                        Apply <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default WarehouseIntelligencePage;
