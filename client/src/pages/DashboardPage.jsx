import React, { useEffect, useMemo, useState } from 'react';
import ShipmentCard from '../components/ShipmentCard';
import RiskMeter from '../components/RiskMeter';
import DecisionPanel from '../components/DecisionPanel';
import CostAnalysis from '../components/CostAnalysis';
import SimulationPanel from '../components/SimulationPanel';
import MapView from '../components/MapView';
import AIExplanation from '../components/AIExplanation';
import AlertBanner from '../components/AlertBanner';
import { getShipments } from '../services/api';
import { RefreshCw } from 'lucide-react';

const DashboardPage = () => {
  const [shipments, setShipments] = useState([]);
  const [insightsByShipment, setInsightsByShipment] = useState({});
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadShipments = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await getShipments();
        if (!active) return;

        setShipments(response.shipments);
        setInsightsByShipment(response.insightsByShipment);
        setSelectedShipment((current) =>
          current
            ? response.shipments.find((shipment) => shipment.id === current.id) || response.shipments[0] || null
            : response.shipments[0] || null,
        );
      } catch (err) {
        if (!active) return;
        setShipments([]);
        setInsightsByShipment({});
        setSelectedShipment(null);
        setError(err.message || 'Failed to load shipments from backend.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadShipments();
    return () => {
      active = false;
    };
  }, []);

  const insights = useMemo(
    () => (selectedShipment ? insightsByShipment[selectedShipment.id] : null),
    [insightsByShipment, selectedShipment],
  );

  const getAlertMessage = () => {
    if (!selectedShipment) {
      return error || 'Waiting for backend shipment data.';
    }

    if (selectedShipment.riskScore === 'High') {
      return `High Risk! Immediate rerouting required for ${selectedShipment.id}`;
    }

    if (selectedShipment.riskScore === 'Medium') {
      return `Moderate Risk detected for ${selectedShipment.id}. Monitoring advised.`;
    }

    return `Shipment ${selectedShipment.id} is on schedule with low risk.`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AlertBanner severity={selectedShipment?.riskScore || 'Low'} message={getAlertMessage()} />

      <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 w-full">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <img
              src="/ai_logo.png"
              alt="DelayShield AI Logo"
              className="w-14 h-14 object-contain rounded-2xl shadow-xl shadow-blue-500/20 bg-[#151c2c] ring-2 ring-blue-500/30"
            />
            <div>
              <h1 className="text-3xl font-black text-blue-950 tracking-tight">
                Intelligence <span className="text-blue-600">Dashboard</span>
              </h1>
              <p className="text-xs font-bold text-blue-500/80 uppercase tracking-widest mt-1">
                Supply Chain Monitoring & AI Decision Support
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 bg-white border border-blue-200 hover:border-blue-400 text-blue-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all hover:shadow-md active:scale-95"
              onClick={() => window.location.reload()}
              type="button"
            >
              <RefreshCw size={14} className="animate-spin-slow" /> Sync Data
            </button>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-5 py-2.5 rounded-xl shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-emerald-700 uppercase tracking-tighter">Live Monitor</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          <div className="lg:col-span-3 flex flex-col h-[350px] lg:h-[550px]">
            <h2 className="text-xs font-black text-blue-900/40 uppercase tracking-widest mb-4 flex items-center gap-2 shrink-0">
              <span className="w-4 h-px bg-blue-200"></span> Active Shipments
            </h2>
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
              {loading && <div className="glass-panel p-4 text-sm text-blue-700">Loading shipments from backend...</div>}
              {!loading && error && <div className="glass-panel p-4 text-sm text-red-600">{error}</div>}
              {!loading && !error && shipments.length === 0 && (
                <div className="glass-panel p-4 text-sm text-blue-700">No shipments available from backend.</div>
              )}
              {!loading &&
                !error &&
                shipments.map((shipment) => (
                  <ShipmentCard
                    key={shipment.id}
                    shipment={shipment}
                    isSelected={selectedShipment?.id === shipment.id}
                    onClick={setSelectedShipment}
                  />
                ))}
            </div>
          </div>

          <div className="lg:col-span-9 h-[350px] lg:h-[550px] rounded-3xl overflow-hidden border border-blue-200 shadow-2xl shadow-blue-500/5 relative">
            <MapView shipment={selectedShipment} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          <div className="lg:col-span-8 w-full">
            <SimulationPanel />
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            {selectedShipment ? (
              <>
                <RiskMeter riskScore={selectedShipment.riskScore} factors={selectedShipment.riskFactors} />
                <CostAnalysis currentCost={selectedShipment.currentCost} potentialLoss={selectedShipment.potentialLoss} />
              </>
            ) : (
              <div className="glass-panel p-6 border-2 border-blue-200 text-sm text-blue-700">
                Shipment metrics will appear here when backend data is available.
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xs font-black text-blue-900/40 uppercase tracking-widest mb-4 flex items-center gap-2 shrink-0">
            <span className="w-4 h-px bg-blue-200"></span> AI Insights (Decision Engine)
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <DecisionPanel insights={insights} />
            {insights && (
              <AIExplanation
                summary={insights.summary}
                explanation={insights.explanation}
                keyFactors={insights.keyFactors}
              />
            )}
            {!insights && !loading && (
              <div className="glass-panel p-6 border-2 border-blue-200 text-sm text-blue-700">
                AI insights will appear once a shipment is available from the backend.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
