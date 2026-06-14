import { 
  getAllWarehouses, 
  getWarehouseById, 
  updateWarehouseLoad, 
  seedWarehouses 
} from '../repositories/warehouse.repository.js'
import { updateShipmentWarehouse, getShipmentByIdPublic } from '../repositories/shipment.repository.js'
import { calculateWarehouseStats, getAlternativeRecommendations } from '../engine/warehouse/warehouseEngine.js'
import { addHistory } from '../engine/history/historyEngine.js'
import { systemSettings } from '../config/settings.js'

export const getWarehouses = async (req, res) => {
  try {
    const rawWarehouses = await getAllWarehouses()
    
    // Calculate stats dynamically for each warehouse
    const statsList = []
    for (const wh of rawWarehouses) {
      const stats = await calculateWarehouseStats(wh, rawWarehouses)
      
      // Inject demo scenario mapping
      if (systemSettings.demoMode && stats.id === 'WH-HYD-1') {
        stats.affectedShipmentId = 'SHP-1003';
      }
      
      statsList.push(stats)
    }

    // Generate recommendations dynamically
    let allRecommendations = []
    for (const whStats of statsList) {
      const recs = await getAlternativeRecommendations(whStats, statsList)
      allRecommendations = allRecommendations.concat(recs)
    }

    // Compute executive dashboard metrics
    const totalCapacity = statsList.reduce((sum, w) => sum + w.capacity, 0)
    const totalActiveLoad = statsList.reduce((sum, w) => sum + w.activeLoad, 0)
    const averageUtilization = totalCapacity > 0 ? Math.round((totalActiveLoad / totalCapacity) * 100) : 0
    const congestedHubsCount = statsList.filter(w => w.util >= 80).length
    
    // Simulate sum of total time saved from active redirects (e.g. from history or active suggestions)
    const totalHoursSaved = allRecommendations.reduce((sum, r) => sum + (r.timeSavedMinutes / 60.0), 0)

    const dashboard = {
      averageUtilization,
      congestedHubsCount,
      totalLoad: totalActiveLoad,
      totalCapacity,
      totalHoursSaved: Number(totalHoursSaved.toFixed(1))
    }

    return res.status(200).json({
      success: true,
      warehouses: statsList,
      recommendations: allRecommendations,
      dashboard
    })
  } catch (error) {
    console.error('[warehouseController] getWarehouses failure:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve warehouse analytics'
    })
  }
}

export const redirectShipment = async (req, res) => {
  try {
    const { shipmentId, recommendedWarehouseId } = req.body
    const userId = req.user.id

    if (!shipmentId || !recommendedWarehouseId) {
      return res.status(400).json({
        success: false,
        message: 'Both shipmentId and recommendedWarehouseId are required'
      })
    }

    // Fetch destination warehouse
    const targetWH = await getWarehouseById(recommendedWarehouseId)
    if (!targetWH) {
      return res.status(404).json({
        success: false,
        message: 'Target warehouse not found'
      })
    }

    // Fetch the shipment first to get the correct original warehouse ID
    const shipment = await getShipmentByIdPublic(shipmentId)
    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      })
    }
    const originalWarehouseId = shipment.warehouseId

    // Perform database redirection update
    const updatedShipment = await updateShipmentWarehouse(shipmentId, recommendedWarehouseId)
    if (!updatedShipment) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update shipment destination warehouse'
      })
    }
    
    // Adjust load levels in DB to reflect the real-time redirection
    if (originalWarehouseId && originalWarehouseId !== recommendedWarehouseId) {
      const origWH = await getWarehouseById(originalWarehouseId)
      if (origWH) {
        await updateWarehouseLoad(originalWarehouseId, Math.max(0, origWH.currentLoad - 15))
      }
    }
    
    // Increment target load
    await updateWarehouseLoad(recommendedWarehouseId, targetWH.currentLoad + 15)

    // Save redirection activity in history logs
    try {
      addHistory({
        shipmentId,
        userId,
        route: `Redirect: ${originalWarehouseId || 'Surge Dock'} -> ${recommendedWarehouseId}`,
        decision: 'Reroute',
        riskScore: 25,
        costImpact: '-INR 4,500' // estimated optimization saving
      })
    } catch (e) {
      console.warn('[warehouseController] Failed to write redirect history:', e.message)
    }

    return res.status(200).json({
      success: true,
      message: `Shipment ${shipmentId} successfully redirected to ${targetWH.name}.`,
      data: updatedShipment
    })
  } catch (error) {
    console.error('[warehouseController] redirectShipment failure:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Redirection operation failed'
    })
  }
}

export const resetWarehouses = async (req, res) => {
  try {
    await seedWarehouses(true)
    return res.status(200).json({
      success: true,
      message: 'Warehouse simulation reset to initial values'
    })
  } catch (error) {
    console.error('[warehouseController] resetWarehouses failure:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Failed to reset warehouse data'
    })
  }
}

export const simulateSurge = async (req, res) => {
  try {
    const { id, currentLoad } = req.body
    if (!id || currentLoad === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Both id and currentLoad are required'
      })
    }
    const updated = await updateWarehouseLoad(id, Number(currentLoad))
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      })
    }
    return res.status(200).json({
      success: true,
      message: `Surge simulation updated for ${id}`,
      data: updated
    })
  } catch (error) {
    console.error('[warehouseController] simulateSurge failure:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Surge simulation failed'
    })
  }
}
