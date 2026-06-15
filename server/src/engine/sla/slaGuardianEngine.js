import { calculateRisk } from '../risk/riskengine.js';
import { generateAIPlan } from '../decision/aiplanner.js';
import { explainDecision } from '../decision/aiExplainer.js';
import { calculateCostImpact, calculateLossImpact, calculateCarbonImpact } from '../cost/costengine.js';

export const analyzeShipmentSLA = async (shipmentData) => {
  // 1. Risk Engine
  const riskResult = calculateRisk({
    traffic: shipmentData.traffic,
    weather: shipmentData.weather,
    warehouse: shipmentData.warehouse,
    historicalDelay: shipmentData.historicalDelay,
    currentETA: shipmentData.currentETA,
    slaDeadline: shipmentData.slaDeadline
  });

  // Calculate actual delay in minutes for cost engine
  let delayMins = 0;
  if (shipmentData.currentETA && shipmentData.slaDeadline) {
    const currentETA = new Date(shipmentData.currentETA);
    const slaDeadline = new Date(shipmentData.slaDeadline);
    delayMins = (currentETA.getTime() - slaDeadline.getTime()) / (1000 * 60);
    if (delayMins < 0) delayMins = 0;
  }

  // 2. Recovery Planner (AI)
  const aiPlanResponse = await generateAIPlan({
    slaRisk: riskResult.score,
    traffic: shipmentData.traffic,
    warehouse: shipmentData.warehouse,
    historicalDelay: shipmentData.historicalDelay,
    shipmentId: shipmentData.shipmentId,
    origin: shipmentData.origin,
    destination: shipmentData.destination
  });
  
  const recoveryPlan = aiPlanResponse.success ? aiPlanResponse.data : {
    primaryCause: "System Delay",
    recommendedActions: ["Monitor Conditions"],
    suggestedRoute: "Baseline Route",
    suggestedEcoRoute: "Green Corridor Bypass",
    ecoSavingsExplanation: "Reduces idling emissions in urban traffic zones.",
    recoveryReasoning: "Fallback triggered."
  };

  // 3. Cost & Loss Engine (Financials & Time Saved)
  // Deterministic time saved based on delay
  let estimatedTimeSaved = 0;
  if (riskResult.level !== "Low" && delayMins > 0) {
    // Arbitrary deterministic rule: AI recovery actions save 60% of the delay, minimum 30 mins (or the delay itself)
    estimatedTimeSaved = Math.min(delayMins, Math.max(30, Math.floor(delayMins * 0.6))); 
  }

  const noActionLoss = calculateLossImpact(delayMins);
  const postActionLoss = calculateLossImpact(Math.max(0, delayMins - estimatedTimeSaved));
  const lossPrevented = noActionLoss.totalLoss - postActionLoss.totalLoss;

  // Actual route metrics for the detour bypass
  // Calculate a proportional bypass distance based on the actual delay and risk
  const bypassDistanceMeters = Math.min(100000, delayMins * 500); // 500m per minute of delay
  const bypassDurationSeconds = (bypassDistanceMeters / 50000) * 3600; // Assuming 50km/h on detour

  const actualRouteData = {
    distance: bypassDistanceMeters, 
    duration: bypassDurationSeconds 
  };

  const costImpact = calculateCostImpact({
    delay: delayMins,
    priority: "High",
    riskLevel: riskResult.level,
    routeData: actualRouteData
  });

  const carbonImpact = calculateCarbonImpact({
    distanceMeters: actualRouteData.distance || 0,
    delayMinutes: delayMins || 0
  });

  // 4. Explainer
  const explanation = explainDecision({
    risk: riskResult,
    recoveryPlan,
    shipmentId: shipmentData.shipmentId
  });

  // 5. Final Output Schema
  return {
    shipmentId: shipmentData.shipmentId || "SHP-UNKNOWN",
    slaRisk: {
      score: riskResult.score,
      level: riskResult.level,
      breachProbability: riskResult.breachProbability,
      breakdown: riskResult.breakdown // Exposing the breakdown
    },
    recovery: {
      primaryCause: recoveryPlan.primaryCause,
      recommendedActions: recoveryPlan.recommendedActions,
      suggestedRoute: recoveryPlan.suggestedRoute,
      suggestedEcoRoute: recoveryPlan.suggestedEcoRoute || "Green Corridor Bypass",
      ecoSavingsExplanation: recoveryPlan.ecoSavingsExplanation || "Reduces idling emissions in urban traffic zones.",
      estimatedTimeSaved,
      lossPrevented,
      savings: Math.max(0, costImpact.savings || 0),
      potentialLoss: noActionLoss.totalLoss
    },
    explanation: {
      confidence: explanation.confidence,
      summary: explanation.summary,
      keyFactors: explanation.keyFactors,
      explanation: explanation.explanation
    },
    carbonImpact
  };
};
