import { generateDelayDNAInsights } from '../engine/delayDnaEngine.js';
import { Shipment } from '../models/shipment.model.js';
import { systemSettings } from '../config/settings.js';

export const getDelayDNAInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    let insights = await generateDelayDNAInsights(userId);

    if (systemSettings.demoMode) {
      const liveCount = await Shipment.countDocuments({ isDemo: false });
      if (liveCount < 5) {
        insights = {
          isDemo: true,
          chronicBottlenecks: [
            { route: 'Mumbai → Delhi', primaryCause: 'Warehouse Congestion', occurrences: 43, totalSample: 45, avgRiskScore: 88, confidence: 92 },
            { route: 'Pune → Ahmedabad', primaryCause: 'Severe Weather', occurrences: 18, totalSample: 20, avgRiskScore: 92, confidence: 85 },
            { route: 'Chennai → Bangalore', primaryCause: 'Traffic Congestion', occurrences: 12, totalSample: 15, avgRiskScore: 76, confidence: 78 }
          ],
          mitigationEffectiveness: [
            { action: 'Switch to Alternate Hub', appliedCount: 45, successRate: 88, confidence: 95 },
            { action: 'Expedite via Air Freight', appliedCount: 20, successRate: 95, confidence: 90 },
            { action: 'Reroute to Highway 48', appliedCount: 15, successRate: 75, confidence: 82 }
          ],
          systemicRisks: [
            { escalationType: 'Critical SLA Breach', dominantDriver: 'Warehouse Congestion', triggerFrequency: 68, sampleSize: 43, confidence: 92 },
            { escalationType: 'Customer Delay Notification', dominantDriver: 'Severe Weather', triggerFrequency: 85, sampleSize: 18, confidence: 85 }
          ]
        };
      }
    }

    return res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Delay DNA error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate Delay DNA insights'
    });
  }
};
