/**
 * simulationEngine.js
 * What-If Simulation Engine for DelayShield AI.
 */
import { calculateRisk } from "../risk/riskengine.js";
import { makeDecision } from "../decision/decisionengine.js";
import { calculateCostImpact } from "../cost/costengine.js";
import { simulateTraffic } from "../../utils/simulatetraffic.js";
// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const safeNum = (value, fallback = 0) => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
};

const formatChange = (diff, unit = "") => {
  if (diff === 0) return `No change`;
  const sign = diff > 0 ? "+" : "";
  const direction = diff > 0 ? "increase" : "decrease";
  return `${sign}${unit}${Math.abs(diff)} ${direction}`;
};

import { generateAIPlan } from "../decision/aiplanner.js";
import { explainDecision } from "../decision/aiExplainer.js";

// ─────────────────────────────────────────────
// SCENARIO RUNNER
// ─────────────────────────────────────────────

const runScenario = async (input) => {
  const { traffic, weather, delay, priority, routeData } = input;

  const risk = calculateRisk({
    traffic: safeNum(traffic),
    weather: safeNum(weather),
    delay: safeNum(delay),
  });

  const decision = makeDecision(risk);

  const cost = calculateCostImpact({
    delay: safeNum(delay),
    priority: priority ?? "Low",
    riskLevel: risk.level,
    routeData: routeData ?? null,
  });

  const aiPlannerResult = await generateAIPlan({
    risk: {
      ...risk,
      traffic: safeNum(traffic),
      delay: safeNum(delay),
    },
    decision,
    route: routeData ?? null,
    cost,
  });

  const explanationResult = explainDecision({
    risk,
    decision,
    cost,
  });

  return { 
    input, 
    risk, 
    decision, 
    cost, 
    ai: aiPlannerResult?.data || null, 
    explanation: explanationResult 
  };
};

// ─────────────────────────────────────────────
// COMPARISON BUILDER
// ─────────────────────────────────────────────

const buildComparison = (original, simulated) => {
  const riskScoreChange = Math.round(
    (simulated.risk.score - original.risk.score) * 100
  ) / 100;

  const costChange = Math.round(
    simulated.cost.noActionCost - original.cost.noActionCost
  );

  const percentCostChange =
    original.cost.noActionCost > 0
      ? ((costChange / original.cost.noActionCost) * 100).toFixed(2)
      : "0.00";

  const decisionChanged =
    original.decision.action !== simulated.decision.action;

  const decisionChange = decisionChanged
    ? `${original.decision.action} → ${simulated.decision.action}`
    : `No change (${original.decision.action})`;

  const riskLevelChanged =
    original.risk.level !== simulated.risk.level;

  // 🔥 Impact Score (custom metric)
  const impactScore = Math.round(
    Math.abs(riskScoreChange) + Math.abs(costChange / 10)
  );

  return {
    comparison: {
      riskScore: {
        original: original.risk.score,
        simulated: simulated.risk.score,
      },
      noActionCost: {
        original: original.cost.noActionCost,
        simulated: simulated.cost.noActionCost,
      },
      rerouteCost: {
        original: original.cost.rerouteCost ?? null,
        simulated: simulated.cost.rerouteCost ?? null,
      },
      savings: {
        original: original.cost.savings ?? null,
        simulated: simulated.cost.savings ?? null,
      },
      riskLevel: {
        original: original.risk.level,
        simulated: simulated.risk.level,
      },
      recommendation: {
        original: original.cost.recommendation,
        simulated: simulated.cost.recommendation,
      },
    },

    difference: {
      riskScoreChange,
      costChange,
      percentCostChange: `${percentCostChange}%`,
      decisionChange,
      riskScoreFormatted: formatChange(riskScoreChange),
      costChangeFormatted: formatChange(costChange, "₹"),
      decisionChanged,
      riskLevelChanged,
      impactScore, // 🔥 highlight this in UI
    },
  };
};

// ─────────────────────────────────────────────
// MULTI-SCENARIO SUPPORT
// ─────────────────────────────────────────────

export const runMultipleScenarios = async (baseInput, scenarios = []) => {
  if (!baseInput || Object.keys(baseInput).length === 0) {
    throw new Error("baseInput is required");
  }

  if (!Array.isArray(scenarios) || scenarios.length === 0) {
    throw new Error("scenarios must be a non-empty array");
  }

  const promises = scenarios.map(async (changes, index) => {
    const label = changes.label ?? `Scenario ${index + 1}`;
    const result = await runSimulation(baseInput, changes);
    return { label, ...result };
  });

  return Promise.all(promises);
};

// ─────────────────────────────────────────────
// CORE EXPORT
// ─────────────────────────────────────────────

export const runSimulation = async (baseInput = {}, changes = {}) => {
  if (!baseInput || Object.keys(baseInput).length === 0) {
    throw new Error("baseInput is required for simulation");
  }

  const newInput = {
    ...baseInput, ...changes,

    // 🔥 Smart traffic handling
    traffic:
      changes.traffic ??
      simulateTraffic(
        "high",                         // simulation scenario → stress test
        baseInput.weather ?? 30,        // use base weather if available
        "Bhopal"                        // or dynamic later
      ),
  };


  const original = await runScenario(baseInput);
  const simulated = await runScenario(newInput);

  const { comparison, difference } = buildComparison(original, simulated);

  return {
    timestamp: new Date().toISOString(), // 🔥 added
    original,
    simulated,
    comparison,
    difference,
  };
};
