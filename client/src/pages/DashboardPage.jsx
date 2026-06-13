import React from 'react';
import { 
  LayoutDashboard, Package, ShieldCheck, AlertTriangle, 
  DollarSign, Warehouse, Bell, TrendingUp, TrendingDown, 
  Clock, ArrowRight 
} from 'lucide-react';
import { 
  AreaChart, Area, ResponsiveContainer 
} from 'recharts';

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

const DashboardPage = () => {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 text-white">
            <LayoutDashboard size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-blue-950 tracking-tight font-display">Executive Dashboard</h1>
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

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <KPICard title="Active Shipments" value="247" trend="12%" trendUp={true} icon={Package} colorClass="text-blue-600" borderClass="border-l-blue-500" bgClass="bg-blue-50" />
        <KPICard title="SLA Compliance" value="94.2%" trend="2.1%" trendUp={true} icon={ShieldCheck} colorClass="text-emerald-600" borderClass="border-l-emerald-500" bgClass="bg-emerald-50" />
        <KPICard title="High Risk" value="12" trend="3" trendUp={true} icon={AlertTriangle} colorClass="text-amber-600" borderClass="border-l-amber-500" bgClass="bg-amber-50" />
        <KPICard title="Loss Prevented" value="₹4.2M" trend="18%" trendUp={true} icon={DollarSign} colorClass="text-indigo-600" borderClass="border-l-indigo-500" bgClass="bg-indigo-50" />
        <KPICard title="WH Utilization" value="78%" trend="5%" trendUp={false} icon={Warehouse} colorClass="text-purple-600" borderClass="border-l-purple-500" bgClass="bg-purple-50" />
        <KPICard title="Notifications" value="156" trend="23" trendUp={true} icon={Bell} colorClass="text-cyan-600" borderClass="border-l-cyan-500" bgClass="bg-cyan-50" />
      </div>

      {/* Critical Alerts */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <h2 className="text-lg font-bold text-slate-800">Critical Alerts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'SHP-33559', risk: '92%', issue: 'Traffic + Warehouse Congestion', action: 'Switch Warehouse', saved: '45 Minutes' },
            { id: 'SHP-41872', risk: '87%', issue: 'Vehicle Breakdown Risk', action: 'Deploy Backup Fleet', saved: '30 Minutes' },
            { id: 'SHP-29104', risk: '78%', issue: 'Weather Disruption', action: 'Reroute via Highway-7', saved: '25 Minutes' }
          ].map((alert, i) => (
            <div key={i} className="bg-white rounded-2xl border border-red-100 shadow-lg p-5 border-l-4 border-l-red-500 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-3">
                <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-md">{alert.id}</span>
                <span className="text-xl font-black text-red-600">{alert.risk} Risk</span>
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
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Shipment Health Overview</h2>
          </div>
          <div className="overflow-x-auto">
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
                {[
                  { id: 'SHP-33559', route: 'Mumbai → Delhi', risk: 92, status: 'Critical', color: 'red', action: 'Switch Warehouse' },
                  { id: 'SHP-41872', route: 'Chennai → Bangalore', risk: 87, status: 'High Risk', color: 'amber', action: 'Deploy Backup' },
                  { id: 'SHP-29104', route: 'Kolkata → Hyderabad', risk: 78, status: 'At Risk', color: 'yellow', action: 'Reroute' },
                  { id: 'SHP-15623', route: 'Pune → Ahmedabad', risk: 45, status: 'Moderate', color: 'blue', action: 'Monitor' },
                  { id: 'SHP-52891', route: 'Delhi → Jaipur', risk: 23, status: 'On Track', color: 'emerald', action: 'None Required' },
                  { id: 'SHP-63421', route: 'Surat → Mumbai', risk: 15, status: 'On Track', color: 'emerald', action: 'None Required' },
                  { id: 'SHP-91234', route: 'Lucknow → Patna', risk: 65, status: 'Moderate', color: 'blue', action: 'Review Route' },
                  { id: 'SHP-45678', route: 'Bhopal → Indore', risk: 82, status: 'High Risk', color: 'amber', action: 'Speed up' }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-blue-50/50 transition-colors border-b border-slate-50 last:border-0">
                    <td className="p-4 font-bold text-slate-700">{row.id}</td>
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
                      <button className="text-blue-600 font-bold text-xs hover:text-blue-800 hover:underline">{row.action}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Recent AI Decisions</h2>
          <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
            {[
              { time: '2 min ago', title: 'Route Changed', desc: 'SHP-33559 rerouted via Highway-4', color: 'bg-emerald-500' },
              { time: '15 min ago', title: 'Warehouse Reassigned', desc: 'SHP-41872 moved to WH-Delhi-3', color: 'bg-blue-500' },
              { time: '32 min ago', title: 'Stakeholder Notified', desc: 'Customer alert sent for SHP-29104', color: 'bg-purple-500' },
              { time: '1 hr ago', title: 'SLA Recovery', desc: 'Backup fleet deployed for SHP-15623', color: 'bg-amber-500' },
              { time: '2 hrs ago', title: 'Route Optimized', desc: 'SHP-52891 fuel-efficient route selected', color: 'bg-emerald-500' },
              { time: '3 hrs ago', title: 'Alert Cleared', desc: 'SHP-78234 risk resolved', color: 'bg-slate-400' }
            ].map((item, i) => (
              <div key={i} className="relative pl-6">
                <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ${item.color} ring-4 ring-white`}></div>
                <div className="text-xs font-bold text-slate-400 mb-1">{item.time}</div>
                <div className="text-sm font-bold text-slate-800">{item.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
