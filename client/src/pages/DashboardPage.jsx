import React, { useState } from 'react';
import ShipmentCard from '../components/ShipmentCard';
import RiskMeter from '../components/RiskMeter';
import DecisionPanel from '../components/DecisionPanel';
import CostAnalysis from '../components/CostAnalysis';
import SimulationPanel from '../components/SimulationPanel';
import MapView from '../components/MapView';
import { MOCK_SHIPMENTS, MOCK_AI_INSIGHTS } from '../services/mockData';
import { LayoutDashboard } from 'lucide-react';

const DashboardPage = () => {
  const [selectedShipment, setSelectedShipment] = useState(MOCK_SHIPMENTS[0]);

  const insights = MOCK_AI_INSIGHTS[selectedShipment.id];

  return (
    <div className="min-h-screen p-6 md:p-8 flex flex-col pt-8 relative">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-600 to-primary-500 rounded-2xl shadow-xl shadow-blue-500/20 text-white border border-white/10">
            <LayoutDashboard size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-slate-400 drop-shadow-sm">
              Dashboard Intelligence
            </h1>
            <p className="text-sm font-medium text-blue-400 mt-1 uppercase tracking-widest">Real-time Supply Chain Monitor</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left Column - Shipments Drop/List */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white mb-2 pt-2">Active Shipments</h2>
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-4">
            {MOCK_SHIPMENTS.map(shipment => (
              <ShipmentCard 
                key={shipment.id}
                shipment={shipment}
                isSelected={selectedShipment.id === shipment.id}
                onClick={setSelectedShipment}
              />
            ))}
          </div>
          <div className="mt-auto pt-6">
            <SimulationPanel />
          </div>
        </div>

        {/* Middle Column - Map & Risk */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-2xl relative z-10 border border-slate-700/50">
            <MapView shipment={selectedShipment} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-0">
            <RiskMeter 
              riskScore={selectedShipment.riskScore} 
              factors={selectedShipment.riskFactors} 
            />
            <CostAnalysis 
              currentCost={selectedShipment.currentCost} 
              potentialLoss={selectedShipment.potentialLoss} 
            />
          </div>
        </div>

        {/* Right Column - AI Decision Intelligence */}
        <div className="lg:col-span-3 flex flex-col">
          <DecisionPanel insights={insights} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
