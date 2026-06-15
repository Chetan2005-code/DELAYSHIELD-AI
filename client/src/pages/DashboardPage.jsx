import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShieldCheck, AlertTriangle, 
  DollarSign, Warehouse, Bell, TrendingUp, TrendingDown, 
  Clock, ArrowRight, BrainCircuit, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import { 
  AreaChart, Area, ResponsiveContainer 
} from 'recharts';
import { getDashboardMetrics, getDelayDNAInsights } from '../services/api';

const sparklineData = [
  { value: 40 }, { value: 30 }, { value: 45 }, { value: 50 }, 
  { value: 35 }, { value: 60 }, { value: 55 }
];

const KPICard = ({ title, value, trend, trendUp, icon: Icon, colorClass, borderClass, bgClass }) => (
  <div className={`bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-100/50 p-6 border-l-4 ${borderClass} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group`}>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bgClass}`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <div className={`flex items-center gap-1 text-sm font-bold ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
        {trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {trend}
      </div>
    </div>
    <div className="relative z-10">
      <h3 className="text-3xl font-black text-slate-800 mb-1">{value}</h3>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</p>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20 group-hover:opacity-40 transition-opacity">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sparklineData}>
          <Area type="monotone" dataKey="value" stroke="none" fill="currentColor" className={colorClass} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-64 text-blue-500 animate-pulse">
    <LayoutDashboard size={48} className="mb-4 opacity-50" />
    <h2 className="text-lg font-bold">Aggregating Live Platform Data...</h2>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
    {message}
  </div>
);

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [dna, setDna] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashRes, dnaRes] = await Promise.all([
          getDashboardMetrics(),
          getDelayDNAInsights()
        ]);
        setData(dashRes);
        setDna(dnaRes);
      } catch (error) {
        console.error("Failed to load dashboard metrics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-6 md:p-8 max-w-7xl mx-auto"><LoadingState /></div>;
  if (!data) return <div className="p-6 md:p-8 max-w-7xl mx-auto"><EmptyState message="Failed to load dashboard data." /></div>;

  const { kpis, criticalAlerts, healthOverview, recentDecisions } = data;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 text-white">
            <LayoutDashboard size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-blue-950 tracking-tight font-display">Executive Dashboard</h1>
              {data.isHybridDemo && (
                <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 border border-purple-200 text-[10px] font-bold uppercase tracking-wider">
                  Demo Dataset
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-blue-500/80 uppercase tracking-widest mt-1">DelayShield AI — Supply Chain Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm font-bold text-slate-700">System Online</span>
          <span className="text-slate-300">|</span>
          <span className="text-sm text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Delay DNA Top Insights */}
      {dna && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-5 text-white shadow-lg shadow-indigo-500/30 relative overflow-hidden group">
            <BrainCircuit className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10 group-hover:scale-110 transition-transform" />
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-white/20 rounded text-xs font-bold uppercase tracking-wider backdrop-blur-sm">Top Bottleneck</span>
              {dna.isDemo && <span className="px-1.5 py-0.5 rounded bg-white/20 text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm">Demo</span>}
            </div>
            <h3 className="text-xl font-bold mb-1">{dna.chronicBottlenecks?.[0]?.route || 'N/A'}</h3>
            <p className="text-sm text-indigo-200 font-medium">{dna.chronicBottlenecks?.[0]?.primaryCause || 'Insufficient Data'}</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/30 relative overflow-hidden group">
            <CheckCircle2 className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10 group-hover:scale-110 transition-transform" />
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-white/20 rounded text-xs font-bold uppercase tracking-wider backdrop-blur-sm">Best Mitigation</span>
              {dna.isDemo && <span className="px-1.5 py-0.5 rounded bg-white/20 text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm">Demo</span>}
            </div>
            <h3 className="text-xl font-bold mb-1">{dna.mitigationEffectiveness?.[0]?.action || 'N/A'}</h3>
            <p className="text-sm text-emerald-100 font-medium">{dna.mitigationEffectiveness?.[0]?.successRate || 0}% Success Rate</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-5 text-white shadow-lg shadow-red-500/30 relative overflow-hidden group">
            <ShieldAlert className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10 group-hover:scale-110 transition-transform" />
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-white/20 rounded text-xs font-bold uppercase tracking-wider backdrop-blur-sm">Systemic Risk</span>
              {dna.isDemo && <span className="px-1.5 py-0.5 rounded bg-white/20 text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm">Demo</span>}
            </div>
            <h3 className="text-xl font-bold mb-1">{dna.systemicRisks?.[0]?.dominantDriver || 'N/A'}</h3>
            <p className="text-sm text-red-200 font-medium">{dna.systemicRisks?.[0]?.triggerFrequency || 0}% Frequency</p>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <KPICard title="Active Shipments" value={kpis.activeShipments} trend="Live" trendUp={true} icon={Package} colorClass="text-blue-600" borderClass="border-l-blue-500" bgClass="bg-blue-50" />
        <KPICard title="SLA Compliance" value={kpis.slaCompliance} trend="Live" trendUp={true} icon={ShieldCheck} colorClass="text-emerald-600" borderClass="border-l-emerald-500" bgClass="bg-emerald-50" />
        <KPICard title="High Risk" value={kpis.highRisk} trend="Live" trendUp={false} icon={AlertTriangle} colorClass="text-amber-600" borderClass="border-l-amber-500" bgClass="bg-amber-50" />
        <KPICard title="Loss Prevented" value={kpis.lossPrevented} trend="Live" trendUp={true} icon={DollarSign} colorClass="text-indigo-600" borderClass="border-l-indigo-500" bgClass="bg-indigo-50" />
        <KPICard title="WH Utilization" value={kpis.whUtilization} trend="Live" trendUp={false} icon={Warehouse} colorClass="text-purple-600" borderClass="border-l-purple-500" bgClass="bg-purple-50" />
        <KPICard title="Notifications" value={kpis.notifications} trend="Live" trendUp={true} icon={Bell} colorClass="text-cyan-600" borderClass="border-l-cyan-500" bgClass="bg-cyan-50" />
      </div>

      {/* Critical Alerts */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <h2 className="text-lg font-bold text-slate-800">Critical Alerts</h2>
        </div>
        
        {criticalAlerts.length === 0 ? (
          <EmptyState message="Operations are running smoothly." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {criticalAlerts.map((alert, i) => (
              <div key={i} className="bg-white rounded-2xl border border-red-100 shadow-lg p-5 border-l-4 border-l-red-500 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-md">{alert.id}</span>
                  <span className="text-xl font-black text-red-600">{alert.risk}% Risk</span>
                </div>
                <p className="text-sm text-slate-600 font-medium mb-4 h-10">{alert.issue}</p>
                <div className="bg-blue-50 text-blue-800 text-sm font-bold px-3 py-2 rounded-lg mb-3 flex items-center justify-between">
                  {alert.action} <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <Clock className="w-3.5 h-3.5" /> Time Saved: {alert.saved}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Shipment Health Overview</h2>
          </div>
          <div className="overflow-x-auto flex-1">
            {healthOverview.length === 0 ? (
              <EmptyState message="No shipments found." />
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold">
                    <th className="p-4 border-b border-slate-100">Shipment ID</th>
                    <th className="p-4 border-b border-slate-100">Route</th>
                    <th className="p-4 border-b border-slate-100">SLA Risk</th>
                    <th className="p-4 border-b border-slate-100">Status</th>
                    <th className="p-4 border-b border-slate-100">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {healthOverview.map((row, i) => (
                    <tr key={i} className="hover:bg-blue-50/50 transition-colors border-b border-slate-50 last:border-0">
                      <td className="p-4 font-bold text-slate-700">
                        <div className="flex items-center gap-2">
                          <Link to={`/shipment/${row.id}`} className="text-blue-600 hover:underline">
                            {row.id}
                          </Link>
                          {row.isDemo && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200">
                              Demo
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">{row.route}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full bg-${row.color}-500`} style={{ width: `${row.risk}%` }}></div>
                          </div>
                          <span className={`font-bold text-${row.color}-600 text-xs`}>{row.risk}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold bg-${row.color}-50 text-${row.color}-700 border border-${row.color}-200`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-blue-600 font-bold text-xs">{row.action}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Recent Events & Decisions</h2>
          {recentDecisions.length === 0 ? (
            <EmptyState message="No recent events." />
          ) : (
            <div className="relative border-l-2 border-slate-100 ml-3 space-y-6 flex-1">
              {recentDecisions.map((item, i) => (
                <div key={i} className="relative pl-6">
                  <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ${item.color} ring-4 ring-white`}></div>
                  <div className="text-xs font-bold text-slate-400 mb-1">{item.time}</div>
                  <div className="text-sm font-bold text-slate-800">{item.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
