import React from 'react';
import { Package, MapPin, Clock } from 'lucide-react';

const ShipmentCard = ({ shipment, isSelected, onClick }) => {
  return (
    <div 
      onClick={() => onClick(shipment)}
      className={`glass-panel p-5 cursor-pointer transition-all duration-300 ${isSelected ? 'ring-2 ring-primary-500 scale-[1.02]' : 'hover:scale-[1.01]'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-500/10 rounded-lg text-primary-400">
            <Package size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{shipment.id}</h3>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              shipment.riskScore === 'High' ? 'bg-risk-high/20 text-risk-high' :
              shipment.riskScore === 'Medium' ? 'bg-risk-medium/20 text-risk-medium' :
              'bg-risk-low/20 text-risk-low'
            }`}>
              {shipment.riskScore} Risk
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <MapPin size={16} className="text-slate-500" />
          <span>{shipment.origin.name} <span className="text-slate-500 mx-1">→</span> {shipment.destination.name}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <Clock size={16} className="text-slate-500" />
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">Original ETA: {shipment.etas.original}</span>
            <span className="font-medium text-risk-medium">Updated: {shipment.etas.updated}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentCard;
