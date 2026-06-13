import React from 'react';
import { 
  Navigation, Eye, Package, Clock, Truck, MapPin, 
  CheckCircle2, QrCode, Copy, ExternalLink 
} from 'lucide-react';

const KPICard = ({ title, value, icon: Icon, colorClass, borderClass, bgClass }) => (
  <div className={`bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-100/50 p-6 border-l-4 ${borderClass} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bgClass}`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
    </div>
    <div>
      <h3 className="text-3xl font-black text-slate-800 mb-1">{value}</h3>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</p>
    </div>
  </div>
);

const TrackingCenterPage = () => {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-cyan-600 rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-500/30 text-white">
            <Navigation size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-blue-950 tracking-tight font-display">Tracking Center</h1>
            <p className="text-xs font-bold text-blue-500/80 uppercase tracking-widest mt-1">Real-Time Shipment Visibility</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard title="Active Sessions" value="89" icon={Eye} colorClass="text-cyan-600" borderClass="border-l-cyan-500" bgClass="bg-cyan-50" />
        <KPICard title="Tracked Shipments" value="1,247" icon={Package} colorClass="text-blue-600" borderClass="border-l-blue-500" bgClass="bg-blue-50" />
        <KPICard title="Avg ETA Accuracy" value="96.3%" icon={Clock} colorClass="text-emerald-600" borderClass="border-l-emerald-500" bgClass="bg-emerald-50" />
        <KPICard title="Live Vehicles" value="67" icon={Truck} colorClass="text-amber-600" borderClass="border-l-amber-500" bgClass="bg-amber-50" />
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 overflow-hidden mb-8">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Live Shipment Map
          </h2>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            67 Vehicles Active
          </div>
        </div>
        
        {/* Mock Map Div */}
        <div className="h-[400px] w-full bg-gradient-to-br from-blue-50 to-cyan-50 relative flex items-center justify-center overflow-hidden">
          {/* Abstract map pattern background could go here */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white shadow-xl text-center relative z-10">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
              <MapPin size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">Interactive Map Disabled</h3>
            <p className="text-sm text-slate-500 max-w-sm">Leaflet map component placeholder. Real implementation requires valid access tokens and map tiles.</p>
          </div>
          
          {/* Mock Zoom Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 font-bold hover:bg-slate-50">+</button>
            <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 font-bold hover:bg-slate-50">-</button>
          </div>
        </div>

        {/* Shipment Tracker Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-slate-100 bg-slate-50/50">
          {[
            { id: 'SHP-33559', route: 'Mumbai → Delhi', status: 'In Transit', pct: 65, driver: 'D-1247', color: 'blue' },
            { id: 'SHP-41872', route: 'Chennai → Bangalore', status: 'At Risk', pct: 40, driver: 'D-892', color: 'amber' },
            { id: 'SHP-29104', route: 'Kolkata → Hyderabad', status: 'In Transit', pct: 82, driver: 'D-456', color: 'blue' }
          ].map((s, i) => (
            <div key={i} className={`p-5 ${i > 0 ? 'border-t md:border-t-0 md:border-l' : ''} border-slate-200 hover:bg-white transition-colors cursor-pointer`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-800 text-sm">{s.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md bg-${s.color}-50 text-${s.color}-600 border border-${s.color}-100`}>{s.status}</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 mb-3">{s.route}</p>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                <div className={`h-full bg-${s.color}-500`} style={{ width: `${s.pct}%` }}></div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                <span>{s.pct}% Complete</span>
                <span>Driver: {s.driver}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Tracking */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-slate-400" /> Quick Track
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
            <div className="w-40 h-40 border-2 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center bg-blue-50/50 text-blue-500 shrink-0">
              <QrCode size={48} className="mb-2 opacity-50" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600/70">Scan to Track</span>
            </div>
            
            <div className="flex-1 w-full space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Public Tracking Link</label>
                <div className="flex">
                  <input 
                    type="text" 
                    readOnly 
                    value="https://track.delayshield.ai/SHP-33559" 
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-l-xl px-3 py-2 text-sm text-slate-600 focus:outline-none"
                  />
                  <button className="bg-white border border-l-0 border-slate-200 rounded-r-xl px-3 py-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Session ID</p>
                  <p className="text-xs font-bold text-slate-700">TRK-987X4</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Started</p>
                  <p className="text-xs font-bold text-slate-700">Jun 10, 9:00 AM</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Duration</p>
                  <p className="text-xs font-bold text-slate-700">14h 32m</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Last Update</p>
                  <p className="text-xs font-bold text-slate-700">2 min ago</p>
                </div>
              </div>
            </div>
          </div>
          
          <button className="mt-auto w-full py-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
            Generate New QR Session <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Shipment Journey — SHP-33559</h2>
          
          <div className="relative border-l-2 border-emerald-500 ml-3 space-y-6 pb-6">
            <div className="relative pl-6">
              <div className="absolute -left-[11px] top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white">
                <CheckCircle2 className="w-3 h-3" />
              </div>
              <div className="flex justify-between items-start mb-0.5">
                <span className="font-bold text-slate-800 text-sm">Order Created</span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">Jun 10, 9:00 AM</span>
              </div>
              <p className="text-xs font-medium text-emerald-600">Completed</p>
            </div>

            <div className="relative pl-6">
              <div className="absolute -left-[11px] top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white">
                <CheckCircle2 className="w-3 h-3" />
              </div>
              <div className="flex justify-between items-start mb-0.5">
                <span className="font-bold text-slate-800 text-sm">Dispatched from Origin</span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">Jun 10, 11:30 AM</span>
              </div>
              <p className="text-xs font-medium text-emerald-600">Completed (Mumbai Hub)</p>
            </div>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
            <div className="relative pl-6 -mt-6">
              <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white shadow-[0_0_0_4px_rgba(59,130,246,0.2)] animate-pulse-slow"></div>
              <div className="flex justify-between items-start mb-0.5">
                <span className="font-bold text-blue-700 text-sm">In Transit</span>
                <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">Jun 10, 2:00 PM</span>
              </div>
              <p className="text-xs font-bold text-blue-600 mb-2">Active</p>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-xs text-slate-600">
                <p className="font-bold text-slate-700 mb-1 flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> En route on NH-48</p>
                <p>Currently passing through Surat bypass. Traffic conditions: Normal.</p>
              </div>
            </div>

            <div className="relative pl-6 opacity-60">
              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-300 ring-4 ring-white"></div>
              <div className="flex justify-between items-start mb-0.5">
                <span className="font-bold text-slate-600 text-sm">Warehouse Arrival</span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">Exp: Jun 11, 8:00 AM</span>
              </div>
              <p className="text-xs font-medium text-slate-500">Pending (Delhi Hub)</p>
            </div>

            <div className="relative pl-6 opacity-60">
              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-300 ring-4 ring-white"></div>
              <div className="flex justify-between items-start mb-0.5">
                <span className="font-bold text-slate-600 text-sm">Delivered</span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">Exp: Jun 11, 2:00 PM</span>
              </div>
              <p className="text-xs font-medium text-slate-500">Pending (Final Destination)</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrackingCenterPage;
