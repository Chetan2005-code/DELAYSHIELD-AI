import React from 'react';
import { PackageSearch } from 'lucide-react';

const ShipmentsPage = () => {
  return (
    <div className="min-h-screen p-8 pt-8">
      <header className="mb-8 flex items-center gap-4">
        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
          <PackageSearch size={28} />
        </div>
        <h1 className="text-3xl font-black text-white">All Shipments</h1>
      </header>
      
      <div className="glass-panel p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <PackageSearch size={48} className="text-slate-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Shipment Directory</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          This page will contain the full searchable list of all active and historical shipments.
          The backend data is currently being integrated.
        </p>
      </div>
    </div>
  );
};

export default ShipmentsPage;
