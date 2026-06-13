import React, { useState } from 'react';
import { 
  MessageSquare, Users, Truck, Warehouse, CheckCircle2, 
  Clock, AlertTriangle, Send, Mail, Phone, Bell, 
  ChevronRight, User, Building, TrendingUp
} from 'lucide-react';

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

const CommunicationCenterPage = () => {
  const [activeTab, setActiveTab] = useState('Driver');

  const timelineData = [
    { time: '2 min ago', type: 'Driver', desc: 'Route change notification sent to Driver D-1247', status: 'Delivered', color: 'bg-blue-500' },
    { time: '5 min ago', type: 'Customer', desc: 'Delay notification sent to Reliance Industries', status: 'Delivered', color: 'bg-emerald-500' },
    { time: '12 min ago', type: 'Warehouse', desc: 'Capacity warning sent to WH-Chennai-2', status: 'Delivered', color: 'bg-purple-500' },
    { time: '18 min ago', type: 'Customer', desc: 'ETA update sent to Tata Motors', status: 'Delivered', color: 'bg-emerald-500' },
    { time: '25 min ago', type: 'Driver', desc: 'Emergency reroute to Driver D-892', status: 'Pending', color: 'bg-amber-500' },
    { time: '35 min ago', type: 'Warehouse', desc: 'Shipment redirect notice to WH-Delhi-3', status: 'Delivered', color: 'bg-purple-500' },
    { time: '45 min ago', type: 'Customer', desc: 'SLA recovery notice to Amazon India', status: 'Delivered', color: 'bg-emerald-500' },
    { time: '1 hr ago', type: 'Driver', desc: 'Break schedule update to Driver D-456', status: 'Delivered', color: 'bg-blue-500' },
    { time: '1.5 hrs ago', type: 'Customer', desc: 'Delivery confirmation to Flipkart', status: 'Delivered', color: 'bg-emerald-500' },
    { time: '2 hrs ago', type: 'Warehouse', desc: 'Loading dock assignment to WH-Mumbai-1', status: 'Failed', color: 'bg-red-500' },
  ];

  const templates = {
    Driver: [
      { subject: 'Route Change — SHP-33559', body: 'Dear Driver D-1247, Your route for shipment SHP-33559 has been updated. Please follow the new route via Highway-4 to avoid traffic congestion in the Mumbai-Pune corridor. New ETA: 4:30 PM. Stay safe.', status: 'Sent 2 min ago', channel: 'SMS + Push', color: 'border-l-blue-500' },
      { subject: 'Emergency Reroute — SHP-41872', body: 'Urgent: Vehicle breakdown reported ahead. Take alternate route via NH-48. Updated navigation will be sent to your device shortly.', status: 'Pending', channel: 'Push Notification', color: 'border-l-blue-500' }
    ],
    Customer: [
      { subject: 'Shipment Delay Update — SHP-33559', body: 'Dear Customer, We regret to inform you that your shipment SHP-33559 from Mumbai to Delhi may experience a slight delay. Our AI system has already initiated a recovery action. Revised ETA: 4:30 PM today. Track: https://track.delayshield.ai/SHP-33559', status: 'Sent 5 min ago', channel: 'Email + SMS', color: 'border-l-emerald-500' },
      { subject: 'Delivery Confirmation — SHP-78234', body: 'Great news! Your shipment SHP-78234 has been delivered successfully at 2:15 PM. Thank you for choosing DelayShield logistics.', status: 'Sent 2 hrs ago', channel: 'Email', color: 'border-l-emerald-500' }
    ],
    Warehouse: [
      { subject: 'Capacity Alert — WH-Chennai-2', body: 'Warning: Warehouse WH-Chennai-2 is at 97% capacity. Incoming shipments SHP-29104 and SHP-15623 are being redirected to WH-Bangalore-1. Please prepare receiving dock B-4.', status: 'Sent 12 min ago', channel: 'System Alert', color: 'border-l-purple-500' },
      { subject: 'Shipment Redirect — WH-Delhi-3', body: '12 shipments from WH-Chennai-2 are being redirected to your facility. Expected arrival: 6:00 PM. Please allocate Docks 3-5 for receiving.', status: 'Sent 35 min ago', channel: 'Email + System', color: 'border-l-purple-500' }
    ]
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/30 text-white">
            <MessageSquare size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-blue-950 tracking-tight font-display">Communication Center</h1>
            <p className="text-xs font-bold text-blue-500/80 uppercase tracking-widest mt-1">Automated Stakeholder Communication</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard title="Driver Notifications" value="342" trend="15%" trendUp={true} icon={Truck} colorClass="text-blue-600" borderClass="border-l-blue-500" bgClass="bg-blue-50" />
        <KPICard title="Customer Notifications" value="891" trend="22%" trendUp={true} icon={Users} colorClass="text-emerald-600" borderClass="border-l-emerald-500" bgClass="bg-emerald-50" />
        <KPICard title="WH Notifications" value="156" trend="8%" trendUp={true} icon={Warehouse} colorClass="text-purple-600" borderClass="border-l-purple-500" bgClass="bg-purple-50" />
        <KPICard title="Success Rate" value="98.7%" trend="0.3%" trendUp={true} icon={CheckCircle2} colorClass="text-teal-600" borderClass="border-l-teal-500" bgClass="bg-teal-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6 flex flex-col h-full lg:h-[650px]">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" /> Recent Communications
          </h2>
          <div className="relative border-l-2 border-slate-100 ml-3 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {timelineData.map((item, i) => (
              <div key={i} className="relative pl-6">
                <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ${item.color} ring-4 ring-white`}></div>
                <div className="flex justify-between items-start mb-1">
                  <div className="text-xs font-bold text-slate-400">{item.time}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 
                    item.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded mb-1">
                  {item.type === 'Driver' && <Truck className="w-3 h-3" />}
                  {item.type === 'Customer' && <User className="w-3 h-3" />}
                  {item.type === 'Warehouse' && <Building className="w-3 h-3" />}
                  {item.type}
                </div>
                <div className="text-sm font-medium text-slate-700 mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Previews */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6 flex flex-col h-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Mail className="w-5 h-5 text-slate-400" /> Message Templates & Previews
            </h2>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {['Driver', 'Customer', 'Warehouse'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${
                    activeTab === tab 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 flex-1">
            {templates[activeTab].map((msg, i) => (
              <div key={i} className={`bg-slate-50 rounded-xl border border-slate-200 p-5 border-l-4 ${msg.color}`}>
                <h3 className="font-bold text-slate-800 mb-3">{msg.subject}</h3>
                <div className="bg-white rounded-lg p-4 text-sm text-slate-600 leading-relaxed border border-slate-100 mb-4 font-mono shadow-sm">
                  {msg.body}
                </div>
                <div className="flex flex-wrap gap-3 items-center justify-between border-t border-slate-200 pt-3">
                  <div className="flex gap-2">
                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[10px] uppercase font-bold px-2.5 py-1 rounded-md">
                      <Send className="w-3 h-3" /> {msg.channel}
                    </span>
                  </div>
                  <span className={`text-xs font-bold flex items-center gap-1 ${msg.status.includes('Sent') ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {msg.status.includes('Sent') ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {msg.status}
                  </span>
                </div>
              </div>
            ))}
            
            <div className="mt-6 border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="text-xl font-bold">+</span>
              </div>
              <p className="font-bold text-slate-700 text-sm">Create New Template</p>
              <p className="text-xs text-slate-500 mt-1">Add a new automated message rule for {activeTab.toLowerCase()}s</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CommunicationCenterPage;
