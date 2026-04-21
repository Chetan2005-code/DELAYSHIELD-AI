export const explainDecision = ({ risk, decision, cost }) => {
  const { score = 0, level = "Low", breakdown = {} } = risk || {};
  const { action = "CONTINUE" } = decision || {};
  const { savings = 0, noActionCost = 0, rerouteCost = 0 } = cost || {};

  // Identify dominant factors
  const factors = Object.keys(breakdown).sort((a, b) => breakdown[b] - breakdown[a]);
  const keyFactors = factors.filter(factor => breakdown[factor] > 20); // arbitrary threshold

  // Provide fallback key factor if array is empty
  const topFactor = factors[0];
  if (keyFactors.length === 0 && topFactor) {
    keyFactors.push(topFactor);
  }

  let explanationParts = [];

  // 1. Factor explanation
  if (keyFactors.includes("traffic") && keyFactors.includes("delay")) {
    explanationParts.push("High traffic congestion and significant delay expectations increased the overall risk.");
  } else if (keyFactors.includes("weather") && level === "High") {
    explanationParts.push("Severe weather conditions significantly impact the route safety.");
  } else if (keyFactors.includes("traffic")) {
    explanationParts.push("Heavy traffic congestion is the primary concern on the current route.");
  } else if (keyFactors.includes("delay")) {
    explanationParts.push("Historical delay trends suggest potential slowdowns.");
  } else if (keyFactors.includes("weather")) {
    explanationParts.push("Challenging weather conditions are present.");
  }

  // 2. Decision explanation
  if (level === "High") {
    explanationParts.push(`Given the high risk score (${score}), immediate action is required.`);
  } else if (level === "Medium") {
    explanationParts.push("Conditions are moderate; careful monitoring is advised.");
  } else {
    explanationParts.push("Conditions are stable and safe to proceed normally.");
  }

  // 3. Cost explanation
  let costSummary = "";
  if (action === "REROUTE" || action === "HALT") {
    if (savings > 0) {
      costSummary = `Rerouting is recommended as it helps avoid delays, saving approximately INR ${typeof savings === 'number' ? savings.toFixed(2) : savings}.`;
      explanationParts.push(costSummary);
    } else if (rerouteCost > noActionCost) {
      costSummary = "Although rerouting is recommended for safety and efficiency, it may incur a higher immediate cost compared to proceeding.";
      explanationParts.push(costSummary);
    } else {
      costSummary = "Rerouting provides a safer and more optimal path.";
      explanationParts.push(costSummary);
    }
  }

  const explanation = explanationParts.join(" ").trim();

  // 4. Determine a short one-line summary
  let summary = "";
  if (action === "REROUTE") {
    summary = `Rerouting recommended due to ${keyFactors.join(" and ")}`;
  } else if (action === "MONITOR") {
    summary = `Monitoring advised due to moderate ${keyFactors.join(" and ")}`;
  } else {
    summary = "Safe to continue current route";
  }

  return {
    explanation: explanation || "Proceed with current route, no significant risks identified.",
    keyFactors,
    summary
  };
};
