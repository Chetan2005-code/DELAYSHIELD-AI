import React from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Calculator, 
  ShieldCheck, AlertOctagon, BarChart3, AlertTriangle, 
  Wallet, PieChart as PieChartIcon
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell, PieChart, Pie
} from 'recharts';

const KPICard = ({ title, value, trend, trendUp, icon: Icon, colorClass, borderClass, bgClass }) => (
  <div className={`bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-100/50 p-6 border-l-4 ${borderClass} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group`}>
    <div className="flex justify-between items-start mb-4">
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
  </div>
);

const lossTrendData = [
  { month: 'Jan', prevented: 1.2, actual: 0.8 },
  { month: 'Feb', prevented: 1.5, actual: 0.7 },
  { month: 'Mar', prevented: 1.8, actual: 0.9 },
  { month: 'Apr', prevented: 2.1, actual: 0.6 },
  { month: 'May', prevented: 2.4, actual: 0.5 },
  { month: 'Jun', prevented: 3.2, actual: 0.4 },
];

const penaltyBreakdownData = [
  { name: 'SLA Breaches', value: 45, color: '#ef4444' },
  { name: 'Spoilage', value: 30, color: '#f59e0b' },
  { name: 'Fuel Waste', value: 15, color: '#3b82f6' },
  { name: 'Labor OT', value: 10, color: '#8b5cf6' },
];

const recentCalculations = [
  { id: 'SHP-33559', type: 'SLA Breach Avoided', amount: '₹45,000', risk: 'High', status: 'Saved', action: 'Rerouted to NH-48' },
  { id: 'SHP-41872', type: 'Spoilage Prevented', amount: '₹1,20,000', risk: 'Critical', status: 'Saved', action: 'Switched Warehouse WH-3' },
  { id: 'SHP-29104', type: 'Fuel Optimization', amount: '₹8,500', risk: 'Medium', status: 'Saved', action: 'Speed adjusted' },
  { id: 'SHP-15623', type: 'SLA Breach', amount: '-₹15,000', risk: 'Low', status: 'Lost', action: 'No backup available' },
  { id: 'SHP-52891', type: 'Demurrage Avoided', amount: '₹22,000', risk: 'High', status: 'Saved', action: 'Dock pre-booked' }
];

const LossImpactPage = () => {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-xl shadow-red-500/30 text-white">
            <Calculator size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-blue-950 tracking-tight font-display">Loss Engine</h1>
            <p className="text-xs font-bold text-blue-500/80 uppercase tracking-widest mt-1">Financial Impact & ROI Analysis</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard title="Total Loss Prevented" value="₹12.2M" trend="18%" trendUp={true} icon={ShieldCheck} colorClass="text-emerald-600" borderClass="border-l-emerald-500" bgClass="bg-emerald-50" />
        <KPICard title="Actual Penalties" value="₹2.4M" trend="12%" trendUp={false} icon={AlertOctagon} colorClass="text-red-600" borderClass="border-l-red-500" bgClass="bg-red-50" />
        <KPICard title="Avg Saving/Action" value="₹14.5K" trend="5%" trendUp={true} icon={Wallet} colorClass="text-blue-600" borderClass="border-l-blue-500" bgClass="bg-blue-50" />
        <KPICard title="ROI Multiplier" value="4.8x" trend="0.3x" trendUp={true} icon={TrendingUp} colorClass="text-indigo-600" borderClass="border-l-indigo-500" bgClass="bg-indigo-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Financial Impact Trend (in Millions)</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Losses prevented vs actual penalties incurred</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-slate-600">Prevented</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-xs font-bold text-slate-600">Actual</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lossTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrevented" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val}M`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`₹${value}M`, '']}
                />
                <Area type="monotone" dataKey="prevented" name="Loss Prevented" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPrevented)" />
                <Area type="monotone" dataKey="actual" name="Actual Penalty" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Chart */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Penalty Breakdown</h2>
          <p className="text-xs text-slate-500 font-medium mb-6">Distribution of actual losses incurred</p>
          
          <div className="h-[200px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={penaltyBreakdownData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {penaltyBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `${val}%`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3 mt-auto">
            {penaltyBreakdownData.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-sm font-bold text-slate-700">{item.name}</span>
                </div>
                <span className="text-sm font-black text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calculator & Table */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800">Recent AI Loss Calculations</h2>
          <button className="bg-blue-50 text-blue-600 font-bold text-xs px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
            Run Manual Simulation
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                <th className="p-4">Shipment ID</th>
                <th className="p-4">Calculation Type</th>
                <th className="p-4">Financial Impact</th>
                <th className="p-4">Risk Level</th>
                <th className="p-4">Outcome</th>
                <th className="p-4">AI Action Taken</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {recentCalculations.map((row, i) => (
                <tr key={i} className="hover:bg-blue-50/30 transition-colors border-b border-slate-50 last:border-0">
                  <td className="p-4 font-bold text-slate-700">{row.id}</td>
                  <td className="p-4 text-slate-600 font-medium">{row.type}</td>
                  <td className="p-4">
                    <span className={`font-black ${row.amount.startsWith('-') ? 'text-red-600' : 'text-emerald-600'}`}>
                      {row.amount}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      row.risk === 'Critical' ? 'bg-red-100 text-red-700' : 
                      row.risk === 'High' ? 'bg-amber-100 text-amber-700' : 
                      row.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {row.risk}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold ${
                      row.status === 'Saved' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {row.status === 'Saved' ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default LossImpactPage;
