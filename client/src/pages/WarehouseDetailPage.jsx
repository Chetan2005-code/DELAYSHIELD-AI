import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Warehouse, AlertTriangle, CheckCircle2, ArrowLeft, 
  Clock, Zap, MapPin, Boxes, Package, Sliders, Play, ArrowRightLeft, RefreshCw
} from 'lucide-react';
import { 
  getWarehouseAnalytics, 
  redirectWarehouseShipment, 
  simulateWarehouseSurge 
} from '../services/api';

const CircularProgress = ({ pct, colorStr, size = "w-24 h-24" }) => {
  const hexMap = {
    'red': '#ef4444',
    'amber': '#f59e0b',
    'emerald': '#10b981'
  };
  const color = hexMap[colorStr] || '#3b82f6';

  return (
    <svg className={size} viewBox="0 0 36 36">
      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="2.8" />
      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={color} strokeWidth="2.8" strokeDasharray={`${pct}, 100`} />
      <text x="18" y="20.5" textAnchor="middle" className="text-[9px] font-black fill-slate-700">{pct}%</text>
    </svg>
  );
};

const WarehouseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [warehouse, setWarehouse] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [simulatedLoad, setSimulatedLoad] = useState(0);
  const [toast, setToast] = useState(null);

  const fetchDetails = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const res = await getWarehouseAnalytics();
      if (res.success) {
        const found = res.warehouses.find(w => w.id === id);
        if (found) {
          setWarehouse(found);
          setSimulatedLoad(found.currentLoad);
          
          // Filter recommendations for this warehouse
          const filteredRecs = res.recommendations.filter(r => r.originalWarehouseId === id);
          setRecommendations(filteredRecs);
        } else {
          showNotification(`Warehouse ${id} not found in database.`, 'error');
          setTimeout(() => navigate('/warehouse'), 2000);
        }
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to retrieve warehouse details.', 'error');
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  const handleApplySurge = async () => {
    if (!warehouse) return;
    setActionLoading(true);
    try {
      const res = await simulateWarehouseSurge(warehouse.id, simulatedLoad);
      if (res.success) {
        showNotification(`Base load for ${warehouse.name} simulated at ${simulatedLoad} units.`, 'success');
        await fetchDetails(false);
      }
    } catch (err) {
      console.error(err);
      showNotification('Surge simulation failed.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApplyRedirect = async (rec) => {
    setActionLoading(true);
    try {
      const res = await redirectWarehouseShipment(rec.shipmentId, rec.recommendedWarehouseId);
      if (res.success) {
        showNotification(`Redirected shipment ${rec.shipmentId} to ${rec.recommendedWarehouseName}. Saved ${rec.timeSavedFormatted}!`, 'success');
        await fetchDetails(false);
      }
    } catch (err) {
      console.error(err);
      showNotification('Shipment redirect failed.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full min-h-[70vh] flex flex-col items-center justify-center">
        <RefreshCw className="w-10 h-10 text-purple-600 animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-500">Querying live warehouse node logs...</p>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full text-center py-20">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-black text-slate-800">Warehouse Node Unavailable</h2>
        <p className="text-sm text-slate-500 mt-2">Redirecting to operations control directory...</p>
      </div>
    );
  }

  const predictedUtil = Math.min(100, Math.round(((warehouse.currentLoad + warehouse.incomingVolume) / warehouse.capacity) * 100));

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full animate-fade-in pb-24 relative">
      {/* Toast Banner */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl border shadow-xl flex items-center gap-3 animate-slide-in-right ${
          toast.type === 'error' 
            ? 'bg-red-50 text-red-800 border-red-200' 
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          {toast.type === 'error' ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          <div>
            <p className="text-sm font-black">{toast.type === 'error' ? 'Action Failed' : 'Operations Synced'}</p>
            <p className="text-xs font-bold opacity-90">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Back & Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/warehouse')}
            className="p-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-xs flex items-center justify-center shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-3xl font-black text-blue-950 tracking-tight font-display">{warehouse.name} Analysis</h1>
              <span className={`inline-flex items-center text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-${warehouse.color}-50 text-${warehouse.color}-700 border border-${warehouse.color}-200`}>
                {warehouse.status}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {warehouse.location.name}
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchDetails(true)}
          disabled={actionLoading}
          className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 font-bold text-xs shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Telemetry
        </button>
      </div>

      {/* Grid Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Max Capacity</p>
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-1.5"><Boxes className="w-4 h-4 text-slate-400" /> {warehouse.capacity} units</h3>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Base Load</p>
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-1.5"><Package className="w-4 h-4 text-slate-400" /> {warehouse.currentLoad} units</h3>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Inbound volume</p>
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-1.5"><Package className="w-4 h-4 text-purple-400 animate-pulse" /> +{warehouse.incomingVolume} units</h3>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Throughput Speed</p>
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {warehouse.processingSpeed} units/hr</h3>
        </div>
      </div>

      {/* Detail Operations & AI Routing Optimizations */}
      <div className="flex flex-col gap-6 w-full">
        {/* Telemetry, Queue times, & Surge Simulation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-center gap-8">
          <div className="flex flex-col sm:flex-row justify-around items-center w-full gap-6">
            <div className="flex flex-col items-center">
              <CircularProgress pct={warehouse.util} colorStr={warehouse.color} />
              <p className="font-extrabold text-slate-700 text-sm mt-3">Current Utilization</p>
              <p className="text-[10px] text-slate-400 font-bold">Base loading capacity</p>
            </div>

            <div className="hidden sm:block w-px h-24 bg-slate-200" />

            <div className="flex flex-col items-center">
              <CircularProgress pct={predictedUtil} colorStr={warehouse.risk === 'Low' ? 'emerald' : warehouse.risk === 'Medium' ? 'amber' : 'red'} />
              <p className="font-extrabold text-slate-700 text-sm mt-3">Projected (4h) Util</p>
              <p className="text-[10px] text-slate-400 font-bold">Includes inbound ETAs</p>
            </div>
          </div>
        </div>

        {/* Queue alert */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex gap-4">
          <div className={`w-12 h-12 rounded-xl bg-${warehouse.color}-50 text-${warehouse.color}-600 flex items-center justify-center shrink-0 border border-${warehouse.color}-100`}>
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-0.5">Projected Dock Queue Duration</h3>
            <p className={`text-3xl font-black text-${warehouse.color}-600`}>
              {warehouse.queueTimeHours >= 1 
                ? `${warehouse.queueTimeHours.toFixed(1)} Hours` 
                : `${Math.round(warehouse.queueTimeHours * 60)} Minutes`}
            </p>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed mt-2.5">
              {warehouse.risk === 'Critical' || warehouse.risk === 'High'
                ? `Overload warning: processing speed of ${warehouse.processingSpeed} units/hr is insufficient for the active load of ${warehouse.activeLoad} units. This node is experiencing major logistics backlogs.`
                : `Optimal throughput: this node is currently operating within ideal safety limits. Total inbound traffic is fully aligned with the dock's discharge speed.`}
            </p>
          </div>
        </div>

        {/* Surge Simulator Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-5 h-5 text-purple-600" />
            Surge Simulator Control Panel
          </h3>

          <div className="space-y-6">
            <p className="text-xs text-slate-500 font-bold leading-relaxed">
              Adjust the warehouse base load using the slider below to simulate surge operations, high cargo volumes, or supply chain bottlenecks. Live recommendations and utilization risks will recalculate instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="w-full flex flex-col gap-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400">
                  <span>0 UNITS</span>
                  <span>MAX CAPACITY ({warehouse.capacity})</span>
                </div>
                
                <input 
                  type="range"
                  min="0"
                  max={Math.round(warehouse.capacity * 1.3)}
                  value={simulatedLoad}
                  onChange={(e) => setSimulatedLoad(parseInt(e.target.value) || 0)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              <div className="flex items-center gap-1.5 shrink-0 bg-white border border-slate-200 p-1.5 rounded-xl">
                <button 
                  onClick={() => setSimulatedLoad(p => Math.max(0, p - 50))}
                  className="w-8 h-8 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 font-black text-xs text-slate-600 transition-all flex items-center justify-center"
                >
                  -50
                </button>
                <input 
                  type="number"
                  value={simulatedLoad}
                  onChange={(e) => setSimulatedLoad(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-20 text-center font-extrabold text-slate-800 text-sm focus:outline-none"
                />
                <button 
                  onClick={() => setSimulatedLoad(p => p + 50)}
                  className="w-8 h-8 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 font-black text-xs text-slate-600 transition-all flex items-center justify-center"
                >
                  +50
                </button>
              </div>
            </div>

            <button
              onClick={handleApplySurge}
              disabled={actionLoading}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
            >
              <Play className="w-4 h-4 fill-current" /> Save and Apply Simulated Surge
            </button>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-2.5 mb-5 border-b border-slate-100 pb-4">
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <h2 className="text-base font-black text-slate-800 tracking-tight font-display">AI Routing Optimizations</h2>
          </div>

          <div className={recommendations.length > 0 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
            {recommendations.map((rec, i) => (
              <div key={i} className="bg-purple-50/20 border-2 border-purple-50 rounded-2xl p-4 relative overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col justify-between">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-500" />
                <div>
                  <div className="flex justify-between items-start mb-2.5">
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                      {rec.shipmentId}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1 shrink-0">
                      <Clock className="w-3.5 h-3.5" /> Save {rec.timeSavedFormatted}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-800 text-xs mb-1">
                    Redirect to {rec.recommendedWarehouseName}
                  </h4>
                  
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold mb-4">
                    {rec.reason}
                  </p>
                </div>

                <button
                  onClick={() => handleApplyRedirect(rec)}
                  disabled={actionLoading}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-[11px] rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 mt-auto"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" /> Apply AI Optimization
                </button>
              </div>
            ))}

            {recommendations.length === 0 && (
              <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-100 w-full col-span-full">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-500">No optimizations required.</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1">This node is running smoothly.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseDetailPage;
