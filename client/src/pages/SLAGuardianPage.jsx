import React, { useState } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle2, TrendingUp, 
  Clock, ArrowRight, X, Zap, Target, BarChart3, Activity 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const KPICard = ({ title, value, trend, trendUp, icon: Icon, colorClass, borderClass, bgClass }) => (
  <div className={`bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-100/50 p-6 border-l-4 ${borderClass} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bgClass}`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <div className={`flex items-center gap-1 text-sm font-bold ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
        {trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
        {trend}
      </div>
    </div>
    <div>
      <h3 className="text-3xl font-black text-slate-800 mb-1">{value}</h3>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</p>
    </div>
  </div>
);

const riskDistributionData = [
  { name: 'Critical', value: 15, color: '#ef4444' },
  { name: 'High', value: 25, color: '#f59e0b' },
  { name: 'Medium', value: 35, color: '#eab308' },
  { name: 'Low', value: 25, color: '#10b981' },
];

const slaSuccessData = [
  { day: 'Mon', rate: 94 }, { day: 'Tue', rate: 92 }, { day: 'Wed', rate: 96 },
  { day: 'Thu', rate: 95 }, { day: 'Fri', rate: 98 }, { day: 'Sat', rate: 97 }, { day: 'Sun', rate: 95 }
];

const breachesData = [
  { day: 'Mon', count: 4 }, { day: 'Tue', count: 6 }, { day: 'Wed', count: 2 },
  { day: 'Thu', count: 3 }, { day: 'Fri', count: 1 }, { day: 'Sat', count: 2 }, { day: 'Sun', count: 5 }
];

const mockShipments = [
  { id: 'SHP-33559', currentEta: 'Today 4:30 PM', deadline: 'Today 3:00 PM', riskScore: 92, riskLevel: 'Critical' },
  { id: 'SHP-41872', currentEta: 'Today 6:15 PM', deadline: 'Today 5:00 PM', riskScore: 87, riskLevel: 'Critical' },
  { id: 'SHP-29104', currentEta: 'Tomorrow 9:00 AM', deadline: 'Tomorrow 8:00 AM', riskScore: 78, riskLevel: 'High' },
  { id: 'SHP-15623', currentEta: 'Today 8:00 PM', deadline: 'Today 9:00 PM', riskScore: 45, riskLevel: 'Medium' },
  { id: 'SHP-52891', currentEta: 'Tomorrow 1:00 PM', deadline: 'Tomorrow 4:00 PM', riskScore: 25, riskLevel: 'Low' },
  { id: 'SHP-63421', currentEta: 'Today 10:00 PM', deadline: 'Today 11:30 PM', riskScore: 30, riskLevel: 'Low' },
  { id: 'SHP-91234', currentEta: 'Tomorrow 11:00 AM', deadline: 'Tomorrow 10:00 AM', riskScore: 82, riskLevel: 'High' },
  { id: 'SHP-45678', currentEta: 'Today 2:00 PM', deadline: 'Today 1:00 PM', riskScore: 90, riskLevel: 'Critical' }
];

const SLAGuardianPage = () => {
  const [selectedShipment, setSelectedShipment] = useState(mockShipments[0]);

  const getRiskColor = (score) => {
    if (score > 70) return 'red';
    if (score > 40) return 'amber';
    return 'emerald';
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30 text-white">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-blue-950 tracking-tight font-display">SLA Guardian AI</h1>
            <p className="text-xs font-bold text-blue-500/80 uppercase tracking-widest mt-1">Predict, Prevent and Protect Deliveries</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard title="Total Monitored" value="1,247" trend="12%" trendUp={true} icon={Target} colorClass="text-blue-600" borderClass="border-l-blue-500" bgClass="bg-blue-50" />
        <KPICard title="Predicted Breaches" value="23" trend="5%" trendUp={false} icon={AlertTriangle} colorClass="text-red-600" borderClass="border-l-red-500" bgClass="bg-red-50" />
        <KPICard title="Recovery Actions" value="89" trend="15%" trendUp={true} icon={Zap} colorClass="text-amber-600" borderClass="border-l-amber-500" bgClass="bg-amber-50" />
        <KPICard title="Potential Savings" value="₹8.5M" trend="24%" trendUp={true} icon={TrendingUp} colorClass="text-emerald-600" borderClass="border-l-emerald-500" bgClass="bg-emerald-50" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">High Risk Shipments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4 border-b border-slate-100">Shipment ID</th>
                  <th className="p-4 border-b border-slate-100">Current ETA</th>
                  <th className="p-4 border-b border-slate-100">SLA Deadline</th>
                  <th className="p-4 border-b border-slate-100">Risk Score</th>
                  <th className="p-4 border-b border-slate-100">Risk Level</th>
                  <th className="p-4 border-b border-slate-100">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {mockShipments.map((row, i) => {
                  const color = getRiskColor(row.riskScore);
                  return (
                    <tr key={i} 
                        onClick={() => setSelectedShipment(row)}
                        className={`hover:bg-blue-50/50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer ${selectedShipment?.id === row.id ? 'bg-blue-50/80 border-l-4 border-l-blue-500' : ''}`}>
                      <td className="p-4 font-bold text-slate-700">{row.id}</td>
                      <td className="p-4 text-slate-600">{row.currentEta}</td>
                      <td className="p-4 text-slate-600">{row.deadline}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full bg-${color}-500`} style={{ width: `${row.riskScore}%` }}></div>
                          </div>
                          <span className={`font-bold text-${color}-600 text-xs`}>{row.riskScore}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold bg-${color}-50 text-${color}-700 border border-${color}-200`}>
                          {row.riskLevel}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="text-blue-600 font-bold text-xs hover:text-blue-800 hover:underline bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">View Details</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedShipment && (
          <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6 flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-500 to-red-500"></div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-black text-slate-800">{selectedShipment.id}</h2>
                <p className="text-xs font-bold text-slate-500 mt-1">SHIPMENT DETAILS</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${getRiskColor(selectedShipment.riskScore)}-50 text-${getRiskColor(selectedShipment.riskScore)}-700 border border-${getRiskColor(selectedShipment.riskScore)}-200`}>
                {selectedShipment.riskLevel} Risk
              </span>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Delay Factors</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 bg-slate-50 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200">
                    <Clock className="w-3.5 h-3.5 text-amber-500" /> Traffic Congestion
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-50 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> Weather Alert
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-50 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200">
                    <Activity className="w-3.5 h-3.5 text-blue-500" /> Warehouse Queue
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Risk Breakdown</h3>
                <div className="h-4 w-full rounded-full flex overflow-hidden mb-2">
                  <div className="bg-red-500 h-full w-[40%]" title="Route Risk: 40%"></div>
                  <div className="bg-amber-500 h-full w-[30%]" title="Warehouse Risk: 30%"></div>
                  <div className="bg-blue-500 h-full w-[30%]" title="External Risk: 30%"></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>Route 40%</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>WH 30%</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>External 30%</span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Recommended Actions</h3>
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-blue-900 text-sm">Switch to WH-Delhi-3</span>
                      <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="flex gap-3 text-xs font-bold text-blue-600">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Save 45m</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> SLA Rescued</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-800 text-sm">Reroute via NH-48</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="flex gap-3 text-xs font-bold text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Save 20m</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
              <div className="flex-1 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                <p className="text-[10px] font-bold uppercase text-emerald-600 mb-1">Time Saved</p>
                <p className="text-lg font-black text-emerald-700">45 Min</p>
              </div>
              <div className="flex-1 bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                <p className="text-[10px] font-bold uppercase text-indigo-600 mb-1">Loss Prevented</p>
                <p className="text-lg font-black text-indigo-700">₹2.3L</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Risk Distribution</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDistributionData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6">
          <h2 className="text-sm font-bold text-slate-800 mb-4">SLA Success Rate</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={slaSuccessData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Area type="monotone" dataKey="rate" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Predicted Breaches</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breachesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SLAGuardianPage;
