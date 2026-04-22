const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000/api";

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return payload;
}

function toRiskLevel(score) {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

function buildRiskFactors(shipment) {
  const traffic = Number(shipment.traffic) || 0;
  const delay = Number(shipment.delay) || 0;
  const weather = Math.max(0, Math.min(100, 100 - Math.round((traffic + delay) / 2)));

  return { traffic, weather, delay };
}

function formatInsightAction(action, shipment) {
  const type = action?.action || "Monitor";
  const descriptionMap = {
    Reroute: `Reroute ${shipment.id} to reduce disruption exposure.`,
    Delay: `Delay ${shipment.id} until route conditions improve.`,
    Monitor: `Continue tracking ${shipment.id} with close monitoring.`,
    Continue: `Keep ${shipment.id} on the current route.`,
  };

  return {
    type,
    description: descriptionMap[type] || `Apply ${type} for ${shipment.id}.`,
    tradeOff: action?.reason || "Awaiting backend recommendation details.",
    costImpact: action?.recommended ? "+$0" : "$0",
    recommended: Boolean(action?.recommended),
  };
}

function buildShipmentInsights(shipment) {
  const riskScore = Number(shipment.traffic) * 0.4 + Number(shipment.delay) * 0.6;
  const riskLevel = toRiskLevel(riskScore);
  const dominantFactor = Number(shipment.traffic) >= Number(shipment.delay) ? "Traffic" : "Delay";

  return {
    summary: `${shipment.name} is currently in a ${riskLevel.toLowerCase()} risk state based on backend shipment metrics.`,
    dominantFactor: `${dominantFactor} is the strongest contributor for ${shipment.id}.`,
    explanation: `${shipment.name} is moving from ${shipment.source.city} to ${shipment.destination.city}. The dashboard is now using backend shipment data directly, so this recommendation reflects live API values from the service.`,
    keyFactors: [dominantFactor, "Delay", shipment.priority, shipment.status].filter(Boolean),
    actions: [
      formatInsightAction(
        {
          action: riskLevel === "High" ? "Reroute" : riskLevel === "Medium" ? "Monitor" : "Continue",
          reason: `Priority is ${shipment.priority} and current status is ${shipment.status}.`,
          recommended: true,
        },
        shipment,
      ),
    ],
  };
}

function adaptShipment(shipment) {
  const riskFactors = buildRiskFactors(shipment);
  const riskScore = toRiskLevel(riskFactors.traffic * 0.4 + riskFactors.delay * 0.6);
  const currentCost = 500 + riskFactors.traffic * 8 + riskFactors.delay * 6;
  const potentialLoss = Math.round(currentCost * (riskScore === "High" ? 0.35 : riskScore === "Medium" ? 0.18 : 0.08));

  return {
    id: shipment.id,
    name: shipment.name,
    origin: {
      name: shipment.source.city,
      lat: shipment.source.lat,
      lng: shipment.source.lon,
    },
    destination: {
      name: shipment.destination.city,
      lat: shipment.destination.lat,
      lng: shipment.destination.lon,
    },
    status: shipment.status,
    currentLocation: {
      lat: (shipment.source.lat + shipment.destination.lat) / 2,
      lng: (shipment.source.lon + shipment.destination.lon) / 2,
    },
    etas: {
      original: shipment.status === "Delayed" ? "Delayed" : "On Schedule",
      updated: shipment.status,
    },
    riskFactors,
    riskScore,
    currentCost: Math.round(currentCost),
    potentialLoss,
    priority: shipment.priority,
  };
}

function adaptHistoryEntry(entry) {
  const shipmentId = entry.shipmentId || entry.id || "UNKNOWN";
  const riskLevel = entry.riskLevel || toRiskLevel(Number(entry.riskScore) || 0);
  const costImpact = entry.costImpact || "$0";

  return {
    id: shipmentId,
    route: entry.route || "Route details unavailable",
    decision: entry.decision || "Continue",
    riskLevel,
    timestamp: entry.timestamp,
    costImpact,
  };
}

function adaptSimulationResult(result) {
  const original = {
    risk: result.original?.risk?.score ?? 0,
    cost: result.original?.cost?.noActionCost ?? 0,
    decision: result.original?.decision?.action ?? "Monitor",
  };

  const simulated = {
    risk: result.simulated?.risk?.score ?? 0,
    cost: result.simulated?.cost?.noActionCost ?? 0,
    decision: result.simulated?.decision?.action ?? "Monitor",
  };

  return {
    original,
    simulated,
    comparison: {
      difference: {
        risk: result.difference?.riskScoreChange ?? 0,
        cost: result.difference?.costChange ?? 0,
        decisionChange: result.difference?.decisionChanged ? result.difference?.decisionChange : null,
      },
      impactScore: result.difference?.impactScore ?? 0,
    },
  };
}

export async function getShipments() {
  const payload = await apiFetch("/shipment");
  const shipments = (payload?.data || []).map(adaptShipment);
  const insightsByShipment = Object.fromEntries(shipments.map((shipment) => [shipment.id, buildShipmentInsights(shipment)]));

  return { shipments, insightsByShipment };
}

export async function getRouteHistory() {
  const payload = await apiFetch("/history");
  return (payload?.history || []).map(adaptHistoryEntry);
}

export async function runSimulationBatch({ baseInput, scenarios }) {
  const payload = await apiFetch("/simulation/run-multiple", {
    method: "POST",
    body: JSON.stringify({ baseInput, scenarios }),
  });

  const adapted = (payload?.data || []).map(adaptSimulationResult);
  const original = adapted[0]?.original || { risk: 0, cost: 0, decision: "Monitor" };

  return {
    original,
    simulated: adapted.map((entry) => entry.simulated),
    comparison: adapted.map((entry) => entry.comparison),
  };
}
