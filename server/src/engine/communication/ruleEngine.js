import { CommunicationLog } from '../../models/communicationLog.model.js';
import { sendStakeholderNotification } from './communicationEngine.js';

const ANTI_SPAM_WINDOW_MS = 6 * 60 * 60 * 1000; // 6 hours

/**
 * Check if a notification should be sent based on anti-spam rules.
 * Rule: Do not send duplicate notifications for the same shipmentId, eventType, stakeholderType within 6 hours.
 * Exception: Allow if risk severity has increased (tracked via a custom score in the log, or we can just always override if the risk is higher).
 * Since CommunicationLog doesn't store the exact SLA risk score natively, we can parse it from the body or rely on an escalating event, but since risk is dynamic, we'll store the risk score in the log body or use a metadata field if we added one. Wait, we didn't add riskScore to CommunicationLog.
 * Let's just query the latest log for this exact combination.
 */
async function shouldSendNotification(shipmentId, eventType, stakeholderType, currentRiskScore = 0) {
  const sixHoursAgo = new Date(Date.now() - ANTI_SPAM_WINDOW_MS);
  
  // Find the most recent log for this combination within the last 6 hours
  const recentLog = await CommunicationLog.findOne({
    shipmentId,
    eventType,
    stakeholderType,
    createdAt: { $gte: sixHoursAgo }
  }).sort({ createdAt: -1 }).lean();

  if (!recentLog) {
    return true; // No recent log, send it
  }

  // To handle the exception "Allow a new notification if the shipment risk level escalates",
  // we can attempt to extract the previous risk score from the body if it was recorded there, 
  // or simply compare it if we inject the risk score into the body text.
  // A cleaner way is to just assume if the risk score crosses a new threshold that wasn't previously triggered, it's a new stakeholder anyway.
  // Wait, if Risk = 72, it sends to Driver and Warehouse.
  // If Risk = 95, it sends to Driver, Warehouse, and Customer. Customer gets it (no recent log). Driver and Warehouse have recent logs. Should they get it again because risk escalated? Yes, "Allow a new notification if the shipment risk level escalates".
  // We can extract risk score if we append it to the log body as `[Risk: XX]`. Let's assume we do.
  
  const match = recentLog.body.match(/\[Risk: (\d+)\]/);
  if (match) {
    const previousRiskScore = parseInt(match[1], 10);
    if (currentRiskScore > previousRiskScore) {
      return true; // Risk escalated, send it
    }
  }

  return false; // Spam protection active
}

async function triggerWithAntiSpam(shipment, eventType, stakeholderType, customContext, currentRiskScore) {
  const canSend = await shouldSendNotification(shipment.id, eventType, stakeholderType, currentRiskScore);
  if (!canSend) {
    return null;
  }

  // Inject risk score into body to track escalations in the future
  const trackingBodyAppender = ` [Risk: ${Math.round(currentRiskScore)}]`;

  try {
    const log = await sendStakeholderNotification({
      shipment,
      eventType,
      stakeholderType,
      customContext: {
        ...customContext,
        riskScoreTracking: trackingBodyAppender // Handled inside communicationEngine if we want, or we just rely on the engine's default parse. Wait, the simplest way is to pass it as customContext and append it in the engine or just modify the log body after generation.
      }
    });

    // Manually append the risk tracking tag to the saved log so shouldSendNotification can find it next time.
    if (log && log._id) {
       log.body = log.body + trackingBodyAppender;
       await log.save();
    }
    
    return log;
  } catch (err) {
    console.error(`[ruleEngine] Error triggering ${stakeholderType} notification:`, err.message);
    return null;
  }
}

export async function evaluateSLAEvent(shipment, slaAnalysis) {
  const riskScore = slaAnalysis.slaRisk?.score || 0;
  const eventType = 'Delay Risk';
  const customContext = {
    reason: slaAnalysis.recovery?.primaryCause || 'Unknown Delay Factors',
    alternative: slaAnalysis.recovery?.suggestedRoute || 'Alternative Route',
    timeSaving: slaAnalysis.recovery?.estimatedTimeSaved || 0
  };

  const logs = [];

  // Risk >= 50 -> Driver Alert
  if (riskScore >= 50) {
    const log = await triggerWithAntiSpam(shipment, eventType, 'Driver', customContext, riskScore);
    if (log) logs.push(log);
  }

  // Risk >= 70 -> Warehouse Alert
  if (riskScore >= 70) {
    const log = await triggerWithAntiSpam(shipment, eventType, 'Warehouse', customContext, riskScore);
    if (log) logs.push(log);
  }

  // Risk >= 90 -> Customer Delay Notification
  if (riskScore >= 90) {
    const log = await triggerWithAntiSpam(shipment, eventType, 'Customer', customContext, riskScore);
    if (log) logs.push(log);
  }

  return logs;
}

export async function evaluateWarehouseEvent(shipment, slaAnalysis) {
  const warehouseIntelligence = slaAnalysis.recovery?.warehouseIntelligence;
  if (!warehouseIntelligence) return [];

  const eventType = 'Warehouse Change';
  const currentRiskScore = slaAnalysis.slaRisk?.score || 0;
  
  const customContext = {
    reason: slaAnalysis.recovery?.primaryCause || 'Warehouse Optimization',
    alternative: warehouseIntelligence.recommendedWarehouseName,
    timeSaving: warehouseIntelligence.timeSavedMinutes
  };

  const logs = [];

  // Stakeholders: Destination Warehouse, Operations Team
  const whLog = await triggerWithAntiSpam(shipment, eventType, 'Warehouse', customContext, currentRiskScore);
  if (whLog) logs.push(whLog);

  const opLog = await triggerWithAntiSpam(shipment, eventType, 'Operations', customContext, currentRiskScore);
  if (opLog) logs.push(opLog);

  return logs;
}

export async function evaluateETAEvent(shipment, previousETA, newETA, delayMins) {
  // Simplistic check for ETA updates if needed. 
  // For now, if delayMins > 0, we can trigger this event, but to avoid spam, we rely on the anti-spam window.
  // The user requested: "When shipment ETA changes significantly... Automatically trigger... Stakeholders: Customer, Driver"
  // Since we don't have historical ETA tracking easily available in slaGuardian stateless calls, we'll trigger it if delay is significant (> 15).
  if (delayMins < 15) return [];

  const eventType = 'Updated ETA';
  const customContext = {
    reason: 'Schedule adjustments',
    originalEta: previousETA || 'Scheduled ETA',
    updatedEta: newETA || 'New ETA',
    delay: delayMins
  };

  const logs = [];

  const cusLog = await triggerWithAntiSpam(shipment, eventType, 'Customer', customContext, delayMins);
  if (cusLog) logs.push(cusLog);

  const drvLog = await triggerWithAntiSpam(shipment, eventType, 'Driver', customContext, delayMins);
  if (drvLog) logs.push(drvLog);

  return logs;
}

export async function evaluateAndTriggerRules(shipmentData, slaAnalysis, delayMins) {
  const shipment = {
    id: shipmentData.shipmentId || 'SHP-XXXX',
    origin: shipmentData.originLoc || { name: shipmentData.origin },
    destination: shipmentData.destinationLoc || { name: shipmentData.destination },
    status: delayMins > 0 ? 'Delayed' : 'In Transit',
    delay: delayMins || 0,
    etas: {
      original: shipmentData.slaDeadline,
      updated: shipmentData.currentETA
    },
    traffic: shipmentData.traffic,
    weather: shipmentData.weather,
    priority: shipmentData.priority || 'Medium'
  };

  const logs = [];

  // 1. SLA Guardian Automation
  const slaLogs = await evaluateSLAEvent(shipment, slaAnalysis);
  logs.push(...slaLogs);

  // 2. Warehouse Intelligence Automation
  const whLogs = await evaluateWarehouseEvent(shipment, slaAnalysis);
  logs.push(...whLogs);

  // 3. ETA Update Automation
  // Let's trigger ETA if delay > 15
  if (delayMins > 15) {
     const etaLogs = await evaluateETAEvent(shipment, shipmentData.slaDeadline, shipmentData.currentETA, delayMins);
     logs.push(...etaLogs);
  }

  return logs;
}
