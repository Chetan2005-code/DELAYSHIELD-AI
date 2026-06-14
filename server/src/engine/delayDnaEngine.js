import { Shipment } from '../models/shipment.model.js';
import { CommunicationLog } from '../models/communicationLog.model.js';

/**
 * Calculates a Confidence Score based on historical frequency and sample size.
 * Formula: Base Probability * Sample Size Penalty
 * Base Probability = (occurrences / totalSample) * 100
 * Sample Size Penalty = min(1, occurrences / 10) -> penalize if less than 10 occurrences
 */
function calculateConfidence(occurrences, totalSample) {
  if (totalSample === 0 || occurrences === 0) return 0;
  
  const baseProbability = occurrences / totalSample;
  
  // Need at least 5 occurrences to start building high confidence, maxes out at 15
  const samplePenalty = Math.min(1, occurrences / 15);
  
  const confidence = Math.round((baseProbability * samplePenalty) * 100);
  
  // Ensure it's between 10% and 99% for realistic display
  return Math.max(10, Math.min(99, confidence));
}

export const generateDelayDNAInsights = async (userId) => {
  // We filter by user id to respect tenant isolation
  const shipments = await Shipment.find({ userId }).lean();
  const communicationLogs = await CommunicationLog.find({}).lean(); // we might need to filter by shipment IDs later

  const insights = {
    chronicBottlenecks: [],
    mitigationEffectiveness: [],
    systemicRisks: []
  };

  if (!shipments || shipments.length === 0) return insights;

  // --- 1. Chronic Bottlenecks Analyzer ---
  const routeStats = {};

  shipments.forEach(shipment => {
    // Only analyze shipments that have been processed by SLA Guardian
    if (!shipment.shipmentPayload?.recovery) return;

    const route = `${shipment.origin.name.split(',')[0]} → ${shipment.destination.name.split(',')[0]}`;
    const primaryCause = shipment.shipmentPayload.recovery.primaryCause || 'Unknown';
    const riskScore = shipment.riskScore || 0;

    if (!routeStats[route]) {
      routeStats[route] = { total: 0, causes: {}, avgRiskScore: 0 };
    }

    routeStats[route].total += 1;
    routeStats[route].avgRiskScore += riskScore;

    if (!routeStats[route].causes[primaryCause]) {
      routeStats[route].causes[primaryCause] = 0;
    }
    routeStats[route].causes[primaryCause] += 1;
  });

  // Extract bottlenecks
  Object.keys(routeStats).forEach(route => {
    const stats = routeStats[route];
    stats.avgRiskScore = Math.round(stats.avgRiskScore / stats.total);

    // Find the most frequent primary cause for this route
    let topCause = null;
    let maxOccurrences = 0;

    Object.keys(stats.causes).forEach(cause => {
      if (stats.causes[cause] > maxOccurrences) {
        maxOccurrences = stats.causes[cause];
        topCause = cause;
      }
    });

    if (topCause) {
      insights.chronicBottlenecks.push({
        route,
        primaryCause: topCause,
        occurrences: maxOccurrences,
        totalSample: stats.total,
        avgRiskScore: stats.avgRiskScore,
        confidence: calculateConfidence(maxOccurrences, stats.total)
      });
    }
  });

  // Sort by highest occurrences
  insights.chronicBottlenecks.sort((a, b) => b.occurrences - a.occurrences);

  // --- 2. Mitigation Effectiveness ---
  // How well do AI recommended actions perform? We check if a shipment that had a specific recommendation ended up "Delivered" or high delay.
  // We'll correlate primary recommended action to avg risk score.
  const actionStats = {};
  
  shipments.forEach(shipment => {
    if (!shipment.shipmentPayload?.recovery?.recommendedActions) return;
    
    const actions = shipment.shipmentPayload.recovery.recommendedActions;
    if (actions.length === 0) return;

    const mainAction = actions[0]; // Take the primary recommendation
    
    if (!actionStats[mainAction]) {
      actionStats[mainAction] = { appliedCount: 0, successCount: 0 }; // We define "success" as riskScore < 50
    }

    actionStats[mainAction].appliedCount += 1;
    if (shipment.riskScore < 50 || shipment.status === 'Delivered') {
      actionStats[mainAction].successCount += 1;
    }
  });

  Object.keys(actionStats).forEach(action => {
    const stats = actionStats[action];
    const effectiveness = Math.round((stats.successCount / stats.appliedCount) * 100);
    insights.mitigationEffectiveness.push({
      action,
      appliedCount: stats.appliedCount,
      successRate: effectiveness,
      confidence: calculateConfidence(stats.appliedCount, stats.appliedCount) // High applied count = high confidence in this stat
    });
  });

  insights.mitigationEffectiveness.sort((a, b) => b.appliedCount - a.appliedCount);

  // --- 3. Systemic Risk Predictor (Communication correlation) ---
  // E.g., How often does "Warehouse Congestion" lead to "Critical" stakeholder escalations?
  const logsByShipment = {};
  communicationLogs.forEach(log => {
    if (!logsByShipment[log.shipmentId]) logsByShipment[log.shipmentId] = [];
    logsByShipment[log.shipmentId].push(log);
  });

  const escalationStats = {
    'Customer Delay Notification': { count: 0, causes: {} },
    'Warehouse Alert': { count: 0, causes: {} }
  };

  shipments.forEach(shipment => {
    const logs = logsByShipment[shipment.id];
    if (!logs || !shipment.shipmentPayload?.recovery) return;

    const primaryCause = shipment.shipmentPayload.recovery.primaryCause;

    // Check if this shipment triggered a customer or warehouse alert
    const triggeredCustomer = logs.some(l => l.stakeholderType === 'Customer');
    const triggeredWarehouse = logs.some(l => l.stakeholderType === 'Warehouse' || l.stakeholderType === 'Operations');

    if (triggeredCustomer) {
      escalationStats['Customer Delay Notification'].count++;
      escalationStats['Customer Delay Notification'].causes[primaryCause] = (escalationStats['Customer Delay Notification'].causes[primaryCause] || 0) + 1;
    }

    if (triggeredWarehouse) {
      escalationStats['Warehouse Alert'].count++;
      escalationStats['Warehouse Alert'].causes[primaryCause] = (escalationStats['Warehouse Alert'].causes[primaryCause] || 0) + 1;
    }
  });

  Object.keys(escalationStats).forEach(escalationType => {
    const stats = escalationStats[escalationType];
    if (stats.count === 0) return;

    let dominantCause = null;
    let maxC = 0;
    Object.keys(stats.causes).forEach(cause => {
      if (stats.causes[cause] > maxC) {
        maxC = stats.causes[cause];
        dominantCause = cause;
      }
    });

    if (dominantCause) {
      insights.systemicRisks.push({
        escalationType,
        dominantDriver: dominantCause,
        triggerFrequency: Math.round((maxC / stats.count) * 100),
        sampleSize: maxC,
        confidence: calculateConfidence(maxC, stats.count)
      });
    }
  });

  return insights;
};
