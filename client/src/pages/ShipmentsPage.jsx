import React, { useState, useMemo } from 'react';
import { 
  Package, Search, Filter, ChevronLeft, ChevronRight, 
  Truck, Ship, Plane, Train, ArrowUpDown 
} from 'lucide-react';

const mockShipments = Array.from({ length: 45 }, (_, i) => {
  const modes = [Truck, Ship, Plane, Train];
  const modeLabels = ['Truck', 'Ship', 'Plane', 'Train'];
  const modeIdx = Math.floor(Math.random() * 4);
  const statuses = ['In Transit', 'Delivered', 'Delayed', 'At Risk'];
  const statusIdx = Math.floor(Math.random() * 4);
  const risks = ['Low', 'Medium', 'High', 'Critical'];
  const riskIdx = statusIdx === 1 ? 0 : statusIdx === 3 ? Math.floor(Math.random() * 2) + 2 : Math.floor(Math.random() * 4);
  
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur'];
  const origin = cities[Math.floor(Math.random() * cities.length)];
  let dest = cities[Math.floor(Math.random() * cities.length)];
  while(dest === origin) dest = cities[Math.floor(Math.random() * cities.length)];

  return {
    id: `SHP-${10000 + i * 17}`,
    origin,
    destination: dest,
    status: statuses[statusIdx],
    eta: statuses[statusIdx] === 'Delivered' ? 'Delivered' : `Tomorrow ${Math.floor(Math.random() * 12) + 1}:00 PM`,
    riskLevel: risks[riskIdx],
    mode: modeLabels[modeIdx],
    ModeIcon: modes[modeIdx]
  };
});

const getStatusColor = (status) => {
  switch(status) {
    case 'In Transit': return 'blue';
    case 'Delivered': return 'emerald';
    case 'Delayed': return 'red';
    case 'At Risk': return 'amber';
    default: return 'slate';
  }
};

const getRiskColor = (risk) => {
  switch(risk) {
    case 'Low': return 'emerald';
    case 'Medium': return 'amber';
    case 'High': return 'orange';
    case 'Critical': return 'red';
    default: return 'slate';
  }
};

const ShipmentsPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const filters = [
    { name: 'All', count: 247 },
    { name: 'In Transit', count: 89 },
    { name: 'Delivered', count: 103 },
    { name: 'Delayed', count: 32 },
    { name: 'At Risk', count: 23 }
  ];

  const filteredData = useMemo(() => {
    return mockShipments.filter(s => {
      const matchFilter = activeFilter === 'All' || s.status === activeFilter;
      const matchSearch = s.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.origin.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.destination.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [activeFilter, searchQuery]);

  const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 text-white">
            <Package size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-blue-950 tracking-tight font-display">Shipment Management</h1>
            <p className="text-xs font-bold text-blue-500/80 uppercase tracking-widest mt-1">Track and Manage All Shipments</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search ID, city..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm w-64"
            />
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(f => (
          <button 
            key={f.name}
            onClick={() => { setActiveFilter(f.name); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              activeFilter === f.name 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f.name} <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${activeFilter === f.name ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{f.count}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors group">
                  <div className="flex items-center gap-1">Shipment ID <ArrowUpDown className="w-3 h-3 opacity-50 group-hover:opacity-100" /></div>
                </th>
                <th className="p-4">Origin</th>
                <th className="p-4">Destination</th>
                <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors group">
                  <div className="flex items-center gap-1">Status <ArrowUpDown className="w-3 h-3 opacity-50 group-hover:opacity-100" /></div>
                </th>
                <th className="p-4">ETA</th>
                <th className="p-4">Risk Level</th>
                <th className="p-4">Mode</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {paginatedData.map((row) => {
                const sColor = getStatusColor(row.status);
                const rColor = getRiskColor(row.riskLevel);
                const Icon = row.ModeIcon;
                
                return (
                  <tr key={row.id} className="hover:bg-blue-50/50 transition-colors border-b border-slate-50 last:border-0 group">
                    <td className="p-4 font-bold text-slate-700">{row.id}</td>
                    <td className="p-4 text-slate-600">{row.origin}</td>
                    <td className="p-4 text-slate-600">{row.destination}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-${sColor}-50 text-${sColor}-700 border border-${sColor}-200`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{row.eta}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-${rColor}-50 text-${rColor}-700 border border-${rColor}-200`}>
                        {row.riskLevel}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 w-max">
                        <Icon className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">{row.mode}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-blue-600 font-bold text-xs hover:text-blue-800 hover:underline bg-white group-hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-transparent group-hover:border-blue-100 transition-all">
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500 font-medium">
                    No shipments found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 0 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="text-sm text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-700">{(page - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-700">{Math.min(page * itemsPerPage, filteredData.length)}</span> of <span className="font-bold text-slate-700">{filteredData.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-sm font-bold text-slate-700 px-2">
                Page {page} of {totalPages}
              </div>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentsPage;
