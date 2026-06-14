import { Shipment } from '../models/shipment.model.js';
import { CommunicationLog } from '../models/communicationLog.model.js';
import { getAllWarehouses } from '../repositories/warehouse.repository.js';
import { calculateWarehouseStats } from '../engine/warehouse/warehouseEngine.js';

import { systemSettings } from '../config/settings.js';

export const getDashboardMetrics = async (req, res) => {
  try {
    const userId = req.user.id;
    const allShipments = await Shipment.find({
      $or: [{ userId }, { isDemo: true }]
    }).lean();
    const showDemo = req.query.showDemo === 'true';

    let shipments = allShipments;
    let isHybridDemo = false;

    if (systemSettings.demoMode) {
      const liveCount = allShipments.filter(s => !s.isDemo).length;
      if (liveCount < 5) {
        isHybridDemo = true; // Use hybrid KPI overrides
      } else if (!showDemo) {
        shipments = allShipments.filter(s => !s.isDemo); // Hide demo shipments
      }
    } else {
      shipments = allShipments.filter(s => !s.isDemo);
    }

    let activeShipments = 0;
    let compliantCount = 0;
    let highRiskCount = 0;
    let lossPreventedTotal = 0;

    const criticalAlerts = [];
    const healthOverview = [];

    shipments.forEach(shipment => {
      const isDelivered = shipment.status === 'Delivered';
      if (!isDelivered) activeShipments++;

      const riskScore = shipment.riskScore || 0;
      if (riskScore < 50 || isDelivered) compliantCount++;
      if (riskScore >= 70 && !isDelivered) highRiskCount++;

      if (shipment.shipmentPayload?.recovery?.lossPrevented) {
        lossPreventedTotal += shipment.shipmentPayload.recovery.lossPrevented;
      }

      // Prepare Critical Alerts (high risk)
      if (riskScore >= 70 && !isDelivered) {
        criticalAlerts.push({
          id: shipment.id,
          risk: riskScore,
          issue: shipment.shipmentPayload?.recovery?.primaryCause || 'Unknown Risk',
          action: shipment.shipmentPayload?.recovery?.action || 'Requires Attention',
          saved: shipment.shipmentPayload?.recovery?.estimatedTimeSaved ? `${shipment.shipmentPayload.recovery.estimatedTimeSaved} Minutes` : 'N/A'
        });
      }

      // Prepare Health Overview
      healthOverview.push({
        id: shipment.id,
        route: `${shipment.origin.name.split(',')[0]} → ${shipment.destination.name.split(',')[0]}`,
        risk: riskScore,
        status: isDelivered ? 'Delivered' : riskScore >= 70 ? 'Critical' : riskScore >= 50 ? 'High Risk' : riskScore >= 30 ? 'Moderate' : 'On Track',
        color: isDelivered ? 'slate' : riskScore >= 70 ? 'red' : riskScore >= 50 ? 'amber' : riskScore >= 30 ? 'blue' : 'emerald',
        action: shipment.shipmentPayload?.recovery?.action || (isDelivered ? 'Completed' : 'Monitor'),
        isDemo: shipment.isDemo || false
      });
    });

    const slaCompliance = shipments.length > 0 ? ((compliantCount / shipments.length) * 100).toFixed(1) : 100;
    
    // Sort and limit critical alerts
    criticalAlerts.sort((a, b) => b.risk - a.risk);
    criticalAlerts.splice(3);

    // Sort and limit health overview
    healthOverview.sort((a, b) => b.risk - a.risk);
    healthOverview.splice(8);

    // Warehouse Utilization
    const rawWarehouses = await getAllWarehouses();
    let totalCapacity = 0;
    let totalActiveLoad = 0;
    for (const wh of rawWarehouses) {
      const stats = await calculateWarehouseStats(wh, rawWarehouses);
      totalCapacity += stats.capacity;
      totalActiveLoad += stats.activeLoad;
    }
    const whUtilization = totalCapacity > 0 ? Math.round((totalActiveLoad / totalCapacity) * 100) : 0;

    // Notifications
    const notificationsCount = await CommunicationLog.countDocuments();

    // Recent AI Decisions (from logs)
    const recentLogs = await CommunicationLog.find().sort({ createdAt: -1 }).limit(6).lean();
    const recentDecisions = recentLogs.map(log => {
      let color = 'bg-blue-500';
      if (log.eventType === 'Delay Risk') color = 'bg-amber-500';
      if (log.eventType === 'Warehouse Change') color = 'bg-emerald-500';

      let timeStr = 'Just now';
      if (log.createdAt) {
        const diffMs = Date.now() - new Date(log.createdAt).getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 60) timeStr = `${diffMins} min ago`;
        else timeStr = `${Math.floor(diffMins/60)} hr ago`;
      }

      return {
        time: timeStr,
        title: log.eventType,
        desc: `${log.recipient} notified for ${log.shipmentId}`,
        color
      };
    });

    const formatCurrency = (val) => {
      if (val >= 1000000) return `₹${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
      return `₹${val}`;
    };

    let kpis = {
      activeShipments,
      slaCompliance: `${slaCompliance}%`,
      highRisk: highRiskCount,
      lossPrevented: formatCurrency(lossPreventedTotal),
      whUtilization: `${whUtilization}%`,
      notifications: notificationsCount
    };

    if (isHybridDemo) {
      kpis = {
        activeShipments: 24,
        slaCompliance: '92.4%',
        highRisk: 5,
        lossPrevented: '₹12.2M',
        whUtilization: '86%',
        notifications: 48
      };
    }

    res.status(200).json({
      success: true,
      data: {
        isHybridDemo,
        kpis,
        criticalAlerts,
        healthOverview,
        recentDecisions
      }
    });
  } catch (error) {
    console.error("[Dashboard Controller Error]:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
