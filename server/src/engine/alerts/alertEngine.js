/**
 * alertEngine.js
 * Proactive Alert System for DelayShield AI.
 */

export const generateAlert = ({ risk = {}, decision = {}, delay = 0, traffic = 0 }) => {
  const { score = 0, level = "Low" } = risk;
  
  // 1. High Risk Check
  if (score > 80) {
    return {
      alert: true,
      type: "HIGH_RISK",
      message: "Critical risk detected. Immediate rerouting required.",
      severity: "High"
    };
  }
  
  // 2. High Delay Check
  if (delay > 60) {
    return {
      alert: true,
      type: "DELAY",
      message: "Significant delay threshold crossed. Monitoring or action advised.",
      severity: "Medium"
    };
  }

  // 3. High Traffic Check
  if (traffic > 85) {
    return {
      alert: true,
      type: "TRAFFIC",
      message: "Heavy traffic condition detected causing potential bottlenecks.",
      severity: "Medium"
    };
  }

  // Fallback
  return {
    alert: false,
    type: "NONE",
    message: "Conditions are normal.",
    severity: "Low"
  };
};
