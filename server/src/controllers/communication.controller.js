import { CommunicationLog } from '../models/communicationLog.model.js'
import { CommunicationTemplate } from '../models/communicationTemplate.model.js'
import { Shipment } from '../models/shipment.model.js'
import { triggerAllStakeholderNotifications } from '../engine/communication/communicationEngine.js'

import { systemSettings } from '../config/settings.js'

export const getLogs = async (req, res) => {
  try {
    let logs = await CommunicationLog.find().sort({ createdAt: -1 }).limit(100).lean()
    
    if (systemSettings.demoMode) {
      const liveCount = await Shipment.countDocuments({ isDemo: false });
      if (liveCount < 5) {
        const demoLogs = [
          {
            _id: 'demo-log-1',
            shipmentId: 'SHP-1002',
            recipient: 'Driver D-2034',
            channel: 'SMS',
            eventType: 'Delay Risk',
            subject: 'Traffic Congestion detected',
            body: 'Traffic congestion detected ahead. Recommended Route: NH48 Express Corridor. Estimated Time Saving: 40 Mins.',
            status: 'Delivered',
            isDemo: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
          },
          {
            _id: 'demo-log-2',
            shipmentId: 'SHP-1003',
            recipient: 'Warehouse WH-HYD-1 Manager',
            channel: 'Email',
            eventType: 'Warehouse Change',
            subject: 'Congestion Alert: Incoming Shipment Redirected',
            body: 'Warehouse congestion detected. Shipment SHP-1003 has been redirected to Alternate Hub to save 120 minutes.',
            status: 'Delivered',
            isDemo: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
          },
          {
            _id: 'demo-log-3',
            shipmentId: 'SHP-1005',
            recipient: 'Reliance Industries (Customer)',
            channel: 'Email',
            eventType: 'Delay Risk',
            subject: 'Critical SLA Breach Warning',
            body: 'We are escalating shipment SHP-1005 via Air Freight to prevent a critical SLA breach. Estimated saving: 360 minutes.',
            status: 'Delivered',
            isDemo: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
          }
        ];
        logs = [...demoLogs, ...logs];
      }
    }

    return res.status(200).json({
      success: true,
      data: logs
    })
  } catch (error) {
    console.error('[communicationController] Get logs failed:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch communication logs'
    })
  }
}

export const getTemplates = async (req, res) => {
  try {
    const templates = await CommunicationTemplate.find().lean()
    return res.status(200).json({
      success: true,
      data: templates
    })
  } catch (error) {
    console.error('[communicationController] Get templates failed:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch communication templates'
    })
  }
}

export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params
    const { subject, body, channel } = req.body

    const template = await CommunicationTemplate.findOneAndUpdate(
      { id },
      { subject, body, channel },
      { new: true }
    )

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Template updated successfully',
      data: template
    })
  } catch (error) {
    console.error('[communicationController] Update template failed:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Failed to update template'
    })
  }
}

export const triggerManualNotification = async (req, res) => {
  try {
    const { shipmentId, eventType, reason, alternative, timeSaving } = req.body

    if (!shipmentId || !eventType) {
      return res.status(400).json({
        success: false,
        message: 'shipmentId and eventType are required'
      })
    }

    // Attempt to locate shipment in the database
    const dbShipment = await Shipment.findOne({ id: shipmentId }).lean()

    let shipment
    if (dbShipment) {
      shipment = {
        id: dbShipment.id,
        origin: dbShipment.origin,
        destination: dbShipment.destination,
        status: dbShipment.status,
        delay: dbShipment.delay,
        etas: {
          original: dbShipment.shipmentPayload?.shipment?.etas?.original || '06:00 PM',
          updated: dbShipment.shipmentPayload?.shipment?.etas?.updated || (dbShipment.delay > 0 ? `+${dbShipment.delay} min` : 'On Time')
        },
        traffic: dbShipment.traffic,
        weather: dbShipment.weather,
        priority: dbShipment.priority
      }
    } else {
      // Create mock shipment wrapper to construct templates successfully
      shipment = {
        id: shipmentId,
        origin: { name: 'Mumbai, Maharashtra', lat: 19.076, lon: 72.877 },
        destination: { name: 'Delhi, NCR', lat: 28.704, lon: 77.1025 },
        status: eventType === 'Delay Risk' ? 'Delayed' : 'In Transit',
        delay: 90,
        etas: { original: '06:00 PM', updated: '07:30 PM' },
        traffic: 75,
        weather: 30,
        priority: 'Medium'
      }
    }

    const logs = await triggerAllStakeholderNotifications(shipment, eventType, {
      reason: reason || 'Traffic Congestion',
      alternative: alternative || 'NH48',
      timeSaving: timeSaving || '35'
    })

    return res.status(200).json({
      success: true,
      message: 'Automated notifications sent successfully to all stakeholders.',
      data: logs
    })
  } catch (error) {
    console.error('[communicationController] Manual trigger failed:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Failed to send automated notifications'
    })
  }
}
