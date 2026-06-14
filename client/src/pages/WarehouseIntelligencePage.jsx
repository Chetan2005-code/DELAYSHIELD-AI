import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Warehouse, AlertTriangle, CheckCircle2, TrendingUp, 
  ArrowRight, Package, MapPin, Boxes, 
  RefreshCw, Search, Trash2
} from 'lucide-react';
import { 
  getWarehouseAnalytics, 
  resetWarehouseSimulation 
} from '../services/api';

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
      <text x="18" y="20.5" textAnchor="middle" className="text-[9px] font-black fill-slate-700">{pct}%</text>
    </svg>
  );
};

const WarehouseIntelligencePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [warehouses, setWarehouses] = useState([]);
  const [dashboard, setDashboard] = useState({
    averageUtilization: 0,
    congestedHubsCount: 0,
    totalLoad: 0,
    totalCapacity: 0,
    totalHoursSaved: 0
  });
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [toast, setToast] = useState(null);

  const fetchAnalytics = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const res = await getWarehouseAnalytics();
      if (res.success) {
        setWarehouses(res.warehouses || []);
        setDashboard(res.dashboard || {
          averageUtilization: 0,
          congestedHubsCount: 0,
          totalLoad: 0,
          totalCapacity: 0,
          totalHoursSaved: 0
        });
      }
    } catch (err) {
      console.error('Failed to load warehouse data', err);
      showNotification('Error loading warehouse data. Please check MongoDB connection.', 'error');
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleResetSimulation = async () => {
    setLoading(true);
    try {
      const res = await resetWarehouseSimulation();
      if (res.success) {
        showNotification('Warehouse simulation data reset successfully.', 'success');
        await fetchAnalytics(true);
      }
    } catch (err) {
      console.error(err);
      showNotification('Reset failed.', 'error');
      setLoading(false);
    }
  };

  // Filtered warehouses
  const filteredWarehouses = warehouses.filter(wh => {
    const matchesSearch = wh.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          wh.location.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'All' || wh.risk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full animate-fade-in pb-24 relative">
      {/* Notification Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl border shadow-xl flex items-center gap-3 animate-slide-in-right ${
          toast.type === 'error' 
            ? 'bg-red-50 text-red-800 border-red-200' 
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          {toast.type === 'error' ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          <div>
            <p className="text-sm font-black">{toast.type === 'error' ? 'Operation Failed' : 'System Optimized'}</p>
            <p className="text-xs font-bold opacity-90">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30 text-white animate-pulse">
            <Warehouse size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-blue-950 tracking-tight font-display">Warehouse Intelligence</h1>
            <p className="text-xs font-bold text-blue-500/80 uppercase tracking-widest mt-1">Prevent Congestion Before It Happens</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchAnalytics(true)}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 font-bold text-xs shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          
          <button 
            onClick={handleResetSimulation}
            disabled={loading}
            className="p-2.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-all flex items-center gap-2 font-bold text-xs shadow-sm"
          >
            <Trash2 className="w-4 h-4" /> Reset Simulation
          </button>
        </div>
      </div>

      {/* Summary KPI Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-blue-100 shadow-md p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Utilization</p>
            <h3 className="text-2xl font-black text-slate-800">{dashboard.averageUtilization}%</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-blue-100 shadow-md p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Congested Hubs</p>
            <h3 className="text-2xl font-black text-slate-800">{dashboard.congestedHubsCount} / {warehouses.length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-blue-100 shadow-md p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Active Volume</p>
            <h3 className="text-2xl font-black text-slate-800">{dashboard.totalLoad} <span className="text-xs text-slate-400 font-bold">/ {dashboard.totalCapacity} units</span></h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-blue-100 shadow-md p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Hours Saved</p>
            <h3 className="text-2xl font-black text-emerald-600">{dashboard.totalHoursSaved} Hrs</h3>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="w-full py-24 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 shadow-sm">
          <RefreshCw className="w-10 h-10 text-purple-600 animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-500">Fetching live Warehouse Intelligence telemetry...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search hub or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs w-full font-medium"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
              {['All', 'Critical', 'High', 'Medium', 'Low'].map((risk) => (
                <button
                  key={risk}
                  onClick={() => setRiskFilter(risk)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${
                    riskFilter === risk 
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWarehouses.map((wh) => (
              <div 
                key={wh.id} 
                onClick={() => navigate(`/warehouse/${wh.id}`)}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer p-5 relative overflow-hidden group"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-${wh.color}-500`}></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-black text-slate-800 text-base flex items-center gap-1.5 font-display group-hover:text-purple-600 transition-colors">
                      {wh.name} <ArrowRight className="w-4.5 h-4.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-purple-600" />
                    </h3>
                    <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold mt-1.5 px-2.5 py-0.5 rounded-full bg-${wh.color}-50 text-${wh.color}-700 border border-${wh.color}-200`}>
                      {wh.status}
                    </span>
                  </div>
                  <CircularProgress pct={wh.util} colorStr={wh.color} size="w-14 h-14" />
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mb-4">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {wh.location.name}
                </div>

                <div className="flex justify-between items-center bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs">
                  <div className="text-center w-1/2">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-0.5">Capacity</p>
                    <p className="font-extrabold text-slate-700 flex items-center justify-center gap-1"><Boxes className="w-3.5 h-3.5 text-slate-400" /> {wh.capacity}</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200"></div>
                  <div className="text-center w-1/2">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-0.5">Active Load</p>
                    <p className="font-extrabold text-slate-700 flex items-center justify-center gap-1"><Package className="w-3.5 h-3.5 text-slate-400" /> {wh.activeLoad}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-purple-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Open Simulation & AI Rerouting</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}

            {filteredWarehouses.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200">
                <p className="text-sm font-bold text-slate-400">No warehouses match your current search/filter settings.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseIntelligencePage;
