import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Calendar, 
  Download, Filter, Activity, Package, Map, AlertCircle, DollarSign, Factory, Fuel
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { getAnalyticsMetrics } from '../services/api';

const KPICard = ({ title, value, trend, trendUp, subtitle, icon: Icon }) => (
  <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group">
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</p>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend}
        </div>
      )}
    </div>
    <h3 className="text-3xl font-black text-slate-800 mb-1">{value}</h3>
    <p className="text-xs font-medium text-slate-400">{subtitle}</p>
  </div>
);

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-64 text-indigo-500 animate-pulse">
    <BarChart3 size={48} className="mb-4 opacity-50" />
    <h2 className="text-lg font-bold">Compiling System Analytics...</h2>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
    {message}
  </div>
);

const formatCurrency = (val) => {
  if (val >= 1000000) return `₹${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val}`;
};

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('This Month');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getAnalyticsMetrics();
        setData(res);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeRange]);

  if (loading) return <div className="p-6 md:p-8 max-w-7xl mx-auto"><LoadingState /></div>;
  if (!data) return <div className="p-6 md:p-8 max-w-7xl mx-auto"><EmptyState message="Failed to load analytics data." /></div>;

  const { kpis, lossMetrics, charts } = data;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30 text-white">
            <BarChart3 size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-blue-950 tracking-tight font-display">Performance Analytics</h1>
              {data.isDemo && (
                <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 border border-purple-200 text-[10px] font-bold uppercase tracking-wider">
                  Demo Dataset
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-blue-500/80 uppercase tracking-widest mt-1">Historical Data & Trends</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl flex overflow-hidden shadow-sm">
            {['This Week', 'This Month', 'This Year'].map(range => (
              <button 
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-xs font-bold transition-colors ${
                  timeRange === range ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-500/30">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard title="Total Shipments" value={kpis.totalShipments} trend="Live" trendUp={true} subtitle="System-wide" icon={Package} />
        <KPICard title="On-Time Delivery" value={kpis.onTimeDelivery} trend="Live" trendUp={true} subtitle="SLA Compliance" icon={Activity} />
        <KPICard title="Avg Delay Time" value={kpis.avgDelayTime} trend="Live" trendUp={false} subtitle="Per delayed shipment" icon={AlertCircle} />
        <KPICard title="SLA Alerts Resolved" value={kpis.aiRecoveryRate} trend="Live" trendUp={true} subtitle="By AI Interventions" icon={TrendingUp} />
      </div>

      {/* Loss Engine Financial KPIs */}
      <div className="mb-8 bg-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center justify-between mb-6 border-b border-slate-700 pb-6">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <DollarSign className="text-emerald-400" /> Loss Engine Metrics
            </h2>
            <p className="text-slate-400 text-sm mt-1">Aggregated financial and operational impacts calculated dynamically</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">Total Loss Avoided</p>
            <h3 className="text-4xl font-black text-white">{formatCurrency(lossMetrics.totalLossAvoided)}</h3>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Avg Loss Per Delay</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(lossMetrics.averageLossPerDelay)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Fuel Loss</p>
            <p className="text-2xl font-bold text-rose-400 flex items-center gap-2"><Fuel size={18}/> {formatCurrency(lossMetrics.fuelLoss)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Penalty Loss</p>
            <p className="text-2xl font-bold text-amber-400">{formatCurrency(lossMetrics.penaltyLoss)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Carbon Impact (CO₂)</p>
            <p className="text-2xl font-bold text-emerald-400 flex items-center gap-2"><Factory size={18}/> {Math.round(lossMetrics.carbonImpact / 1000)}k kg</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Main Chart */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Shipment Volume vs Delays</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Monthly trend of total volume and delay incidents</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="volume" name="Total Volume" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                <Area type="monotone" dataKey="delayed" name="Delayed" stroke="#ef4444" strokeWidth={2} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SLA Compliance */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">SLA Compliance Trend</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Weekly performance against 95% target</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="compliance" name="Actual %" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="step" dataKey="target" name="Target %" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Root Causes for Delay */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6 max-w-2xl">
        <h2 className="text-sm font-bold text-slate-800 mb-6">Root Causes for Delay</h2>
        <div className="h-[200px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={charts.reasonsData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                {charts.reasonsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {charts.reasonsData.map(item => (
            <div key={item.name} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="text-xs font-bold text-slate-600">{item.name} <span className="text-slate-400 font-medium">({item.value}%)</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
