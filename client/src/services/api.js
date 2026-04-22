import axios from 'axios';

// ─── Axios Instance ─────────────────────────────────────────
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 35000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Data Transformers ──────────────────────────────────────

/**
 * Transform a backend shipment into the shape the frontend components expect.
 */
export const transformShipment = (s) => {
  if (!s) return null;

  const traffic = s.traffic ?? 50;
  const delay = s.delay ?? 0;
  const weather = s.weather ?? 20;

  const rawRisk = (traffic * 0.4) + (delay * 0.6);
  let riskScore = 'Low';
  if (rawRisk > 60) riskScore = 'High';
  else if (rawRisk > 35) riskScore = 'Medium';

  const origin = s.origin || s.source || { name: 'Unknown', lat: 0, lon: 0 };
  const destination = s.destination || { name: 'Unknown', lat: 0, lon: 0 };

  const progress = 0.4;
  const currentLat = (origin.lat || 0) + ((destination.lat || 0) - (origin.lat || 0)) * progress;
  const currentLng = (origin.lon || 0) + ((destination.lon || 0) - (origin.lon || 0)) * progress;

  return {
    id: s.id,
    name: s.name || `Shipment ${s.id}`,
    origin: { name: origin.name || origin.city, lat: origin.lat, lng: origin.lon },
    destination: { name: destination.name || destination.city, lat: destination.lat, lng: destination.lon },
    currentLocation: { lat: currentLat, lng: currentLng },
    status: s.status || 'In Transit',
    etas: {
      original: 'Scheduled',
      updated: delay > 30 ? `+${delay} min delay` : 'On Time',
    },
    riskFactors: { traffic, weather, delay },
    riskScore,
    currentCost: Math.round(800 + traffic * 2.5 + delay * 5),
    potentialLoss: Math.round(delay * 12 + traffic * 3),
    priority: s.priority || 'Medium',
    cargoType: s.cargoType || 'General Cargo',
    vehicleType: s.vehicleType || 'Semi-Trailer',
    _raw: s,
  };
};

/**
 * Transform the /api/analyze response.
 */
export const transformAnalysis = (data) => {
  if (!data) return null;

  const risk = data.risk || {};
  const decision = data.decision || {};
  const cost = data.cost || {};
  const ai = data.ai || data.explanation || {};
  const weather = data.weather || {};
  const input = data.input || data.raw?.input || {};

  const riskFactors = {
    traffic: input.traffic ?? risk.breakdown?.traffic ?? 50,
    weather: weather.weatherScore ?? risk.breakdown?.weather ?? 20,
    delay: input.delay ?? risk.breakdown?.delay ?? 10,
  };

  const sid = input.shipmentId || data.shipmentId || "SHP-0";

  const getDynamicInstructions = (type, shipmentId) => {
    const variations = {
      REROUTE: ["Tactical reroute via optimal corridor.", "Trajectory shift to bypass congestion."],
      MONITOR: ["Active telemetry surveillance active.", "Enhanced monitoring for next sector."],
      CONTINUE: ["Maintain baseline route; score optimal.", "Standard velocity; no reroute."]
    };
    const pool = variations[type] || variations.CONTINUE;
    return pool[0];
  };

  const insights = {
    summary: ai.summary || decision.reason || `Tactical Assessment: ${decision.action || 'Monitoring'}`,
    dominantFactor: ai.dominantFactor || "Strategic Intelligence",
    explanation: ai.explanation || decision.reason || 'AI engine analyzed telemetry to optimize route safety.',
    keyFactors: ai.keyFactors || ['Traffic', 'Weather', 'Delay'],
    actions: ai.actions ? ai.actions.map(a => ({
      ...a,
      costImpact: a.costImpact || (cost.totalImpact ? `INR ${cost.totalImpact}` : 'INR 0')
    })) : [
      {
        type: decision.action || 'MONITOR',
        description: ai.explanation || getDynamicInstructions(decision.action || 'MONITOR', sid),
        tradeOff: 'Safety-first protocol.',
        costImpact: cost.totalImpact ? `INR ${cost.totalImpact}` : 'INR 0',
        recommended: true,
      },
      {
        type: 'CONTINUE',
        description: 'Maintain baseline route with heightened vigilance.',
        tradeOff: 'Operational baseline.',
        costImpact: 'INR 0',
        recommended: false,
      }
    ],
  };

  return {
    riskScore: risk.level || 'Low',
    riskFactors,
    currentCost: cost.baseCost ?? 800,
    potentialLoss: cost.potentialLoss ?? 0,
    insights,
    alert: {
      severity: risk.level || 'Low',
      message: data.alert?.message || `Tactical ${decision.action || 'Monitoring'} protocol active.`,
    },
    route: data.route || null,
    raw: data,
  };
};

/**
 * Transform Simulation Results for Comparison View.
 */
export const transformSimulationResult = (result, index) => {
  const simulated = result.simulated || {};
  const diff = result.difference || {};
  
  return {
    label: result.label || `Scenario ${index + 1}`,
    id: index + 1,
    // Core Simulated Data
    riskScore: simulated.risk?.score || 0,
    riskLevel: simulated.risk?.level || 'Low',
    decision: simulated.decision?.action || 'Continue',
    cost: simulated.cost?.noActionCost || 0,
    // Comparison/Difference Data
    difference: {
      riskChange: diff.riskScoreFormatted || 'No change',
      costChange: diff.costChangeFormatted || 'No change',
      decisionChange: diff.decisionChange || 'No change',
      impactScore: diff.impactScore || 0,
      isRiskIncreased: diff.riskScoreChange > 0,
      isCostIncreased: diff.costChange > 0,
    },
    raw: result
  };
};

// ─── API Functions ──────────────────────────────────────────

export const getShipments = async () => {
  try {
    const response = await api.get('/shipment');
    const shipments = response.data?.data || response.data || [];
    return shipments.map(transformShipment);
  } catch (error) {
    console.error('Failed to fetch shipments:', error);
    throw error;
  }
};

export const analyzeShipment = async (payload) => {
  try {
    const response = await api.post('/analyze', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to analyze shipment:', error);
    throw error;
  }
};

export const getCityTraffic = async () => {
  try {
    const response = await api.get('/city/traffic');
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Failed to fetch city traffic:', error);
    throw error;
  }
};

/**
 * Run What-If Simulation via POST /api/simulation.
 */
export const runSimulation = async (baseInput, scenarios) => {
  try {
    const response = await api.post('/simulation', {
      baseInput,
      scenarios,
    });
    const results = response.data?.data || response.data || [];
    return results.map((r, i) => transformSimulationResult(r, i));
  } catch (error) {
    console.error('Failed to run simulation:', error);
    throw error;
  }
};

export const getHistory = async () => {
  try {
    const response = await api.get('/history');
    const history = response.data?.history || response.data?.data || [];
    return history.map(h => ({
      ...h,
      riskLevel: h.riskScore > 70 ? 'High' : h.riskScore > 40 ? 'Medium' : 'Low'
    }));
  } catch (error) {
    console.error('Failed to fetch history:', error);
    throw error;
  }
};

export const saveDecision = async (decision) => {
  try {
    const response = await api.post('/history', decision);
    return response.data;
  } catch (error) {
    console.error('Failed to save decision:', error);
    throw error;
  }
};

export default api;
