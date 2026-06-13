import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Calendar, 
  Download, Filter, Activity, Package, Map, AlertCircle 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

const KPICard = ({ title, value, trend, trendUp, subtitle }) => (
  <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className="flex justify-between items-start mb-2">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</p>
      <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {trend}
      </div>
    </div>
    <h3 className="text-3xl font-black text-slate-800 mb-1">{value}</h3>
    <p className="text-xs font-medium text-slate-400">{subtitle}</p>
  </div>
);

const volumeData = [
  { name: 'Jan', volume: 4000, delayed: 240 }, { name: 'Feb', volume: 3000, delayed: 139 },
  { name: 'Mar', volume: 2000, delayed: 980 }, { name: 'Apr', volume: 2780, delayed: 390 },
  { name: 'May', volume: 1890, delayed: 480 }, { name: 'Jun', volume: 2390, delayed: 380 },
  { name: 'Jul', volume: 3490, delayed: 430 },
];

const performanceData = [
  { name: 'Week 1', compliance: 92, target: 95 }, { name: 'Week 2', compliance: 94, target: 95 },
  { name: 'Week 3', compliance: 96, target: 95 }, { name: 'Week 4', compliance: 95, target: 95 },
  { name: 'Week 5', compliance: 98, target: 95 },
];

const reasonsData = [
  { name: 'Traffic', value: 45, color: '#ef4444' },
  { name: 'Weather', value: 25, color: '#3b82f6' },
  { name: 'Warehouse', value: 20, color: '#f59e0b' },
  { name: 'Vehicle', value: 10, color: '#8b5cf6' },
];

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('This Month');

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30 text-white">
            <BarChart3 size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-blue-950 tracking-tight font-display">Performance Analytics</h1>
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

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard title="Total Shipments" value="24,592" trend="12.5%" trendUp={true} subtitle="Compared to last period" />
        <KPICard title="On-Time Delivery" value="94.8%" trend="2.1%" trendUp={true} subtitle="Target: 95.0%" />
        <KPICard title="Avg Delay Time" value="42m" trend="15m" trendUp={false} subtitle="Per delayed shipment" />
        <KPICard title="AI Recovery Rate" value="78.5%" trend="5.4%" trendUp={true} subtitle="Alerts resolved successfully" />
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
              <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              <LineChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Delay Reasons */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6">
          <h2 className="text-sm font-bold text-slate-800 mb-6">Root Causes for Delay</h2>
          <div className="h-[200px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={reasonsData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                  {reasonsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {reasonsData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-xs font-bold text-slate-600">{item.name} <span className="text-slate-400 font-medium">({item.value}%)</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Hubs */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6">
          <h2 className="text-sm font-bold text-slate-800 mb-6">Route Performance (Worst 5)</h2>
          <div className="space-y-4">
            {[
              { route: 'Mumbai → Pune', delays: 145, pct: 18, avgTime: '45m', color: 'red' },
              { route: 'Delhi → Jaipur', delays: 98, pct: 12, avgTime: '32m', color: 'orange' },
              { route: 'Chennai → Bangalore', delays: 87, pct: 9, avgTime: '28m', color: 'amber' },
              { route: 'Kolkata → Patna', delays: 65, pct: 6, avgTime: '41m', color: 'amber' },
              { route: 'Hyderabad → Vijayawada', delays: 42, pct: 4, avgTime: '15m', color: 'yellow' },
            ].map((route, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 font-black text-slate-300 text-lg">0{i+1}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-sm font-bold text-slate-700">{route.route}</span>
                    <span className="text-xs font-bold text-slate-500">{route.delays} Delays</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-${route.color}-500 rounded-full`} style={{ width: `${Math.min(100, route.pct * 4)}%` }}></div>
                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Avg Loss</span>
                  <span className="text-sm font-bold text-slate-700">{route.avgTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPage;
