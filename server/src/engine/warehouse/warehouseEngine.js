import { getActiveIncomingShipmentsByWarehouse } from '../../repositories/shipment.repository.js'

function getHaversineDistance(loc1, loc2) {
  const R = 6371 // Earth radius in km
  const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180
  const dLon = ((loc2.lon - loc1.lon) * Math.PI) / 180
  const lat1 = (loc1.lat * Math.PI) / 180
  const lat2 = (loc2.lat * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in km
}

export async function calculateWarehouseStats(warehouse, allWarehouses) {
  const incomingShipments = await getActiveIncomingShipmentsByWarehouse(warehouse.id)
  const incomingVolume = incomingShipments.length * 15 // assume each active shipment represents a load of 15 packages/units

  const activeLoad = warehouse.currentLoad + incomingVolume
  const utilization = Math.min(100, Math.round((activeLoad / warehouse.capacity) * 100))

  // Project processing queue duration
  // Queue Time = (current load + incoming volume) / processing speed
  const queueTimeHours = activeLoad / (warehouse.processingSpeed || 50)

  let status = 'Available'
  let color = 'emerald'
  let risk = 'Low'

  if (utilization >= 95) {
    status = 'Congested'
    color = 'red'
    risk = 'Critical'
  } else if (utilization >= 80) {
    status = 'Near Capacity'
    color = 'amber'
    risk = 'High'
  } else if (utilization >= 55) {
    status = 'Busy'
    color = 'amber'
    risk = 'Medium'
  } else if (utilization >= 30) {
    status = 'Operational'
    color = 'emerald'
    risk = 'Low'
  }

  return {
    ...warehouse,
    incomingVolume,
    activeLoad,
    util: utilization,
    queueTimeHours,
    status,
    color,
    risk,
    incomingShipmentsCount: incomingShipments.length
  }
}

export async function getAlternativeRecommendations(congestedWarehouse, allStats) {
  // Find active incoming shipments destined for the warehouse
  const incomingShipments = await getActiveIncomingShipmentsByWarehouse(congestedWarehouse.id)
  if (incomingShipments.length === 0) {
    return []
  }

  // Find candidate alternative warehouses (must have lower utilization than current warehouse)
  const alternatives = allStats.filter(wh => wh.id !== congestedWarehouse.id && wh.util < congestedWarehouse.util)
  if (alternatives.length === 0) {
    return []
  }

  const recommendations = []

  // Loop through shipments to find suitable redirects
  for (const shipment of incomingShipments) {
    // Current shipment position or origin
    const shipmentLoc = shipment.origin || { lat: 20.0, lon: 77.0 } 
    
    let bestAlt = null
    let maxNetSavedMinutes = 0

    for (const alt of alternatives) {
      // Distance from shipment origin/current position to original warehouse
      const distToOrig = getHaversineDistance(shipmentLoc, congestedWarehouse.location)
      // Distance from shipment origin/current position to alternative warehouse
      const distToAlt = getHaversineDistance(shipmentLoc, alt.location)
      
      const distanceDeltaKm = distToAlt - distToOrig
      // Travel delay/save (assuming average truck speed of 60 km/h)
      const transitOverheadHours = distanceDeltaKm / 60.0

      // Queue wait duration delta
      const queueTimeOrigHours = congestedWarehouse.queueTimeHours
      const queueTimeAltHours = alt.queueTimeHours

      // Net hours saved
      const netSavedHours = queueTimeOrigHours - (queueTimeAltHours + transitOverheadHours)
      const netSavedMinutes = Math.round(netSavedHours * 60)

      if (netSavedMinutes > maxNetSavedMinutes) {
        maxNetSavedMinutes = netSavedMinutes
        bestAlt = alt
      }
    }

    if (bestAlt && maxNetSavedMinutes > 15) {
      recommendations.push({
        shipmentId: shipment.id,
        shipmentOrigin: shipment.origin?.name || 'Origin',
        shipmentDestination: shipment.destination?.name || 'Destination',
        originalWarehouseId: congestedWarehouse.id,
        originalWarehouseName: congestedWarehouse.name,
        recommendedWarehouseId: bestAlt.id,
        recommendedWarehouseName: bestAlt.name,
        timeSavedMinutes: maxNetSavedMinutes,
        timeSavedFormatted: maxNetSavedMinutes >= 60 
          ? `${Math.floor(maxNetSavedMinutes / 60)}h ${maxNetSavedMinutes % 60}m` 
          : `${maxNetSavedMinutes} min`,
        reason: congestedWarehouse.util >= 75
          ? `${congestedWarehouse.name} is congested (${congestedWarehouse.util}% util). Redirecting to ${bestAlt.name} (${bestAlt.util}% util) saves queue wait time despite minor route changes.`
          : `Load-balancing optimization: Redirecting from ${congestedWarehouse.name} (${congestedWarehouse.util}% util) to ${bestAlt.name} (${bestAlt.util}% util) to balance network throughput.`
      })
    }
  }

  // Return recommendations sorted by most time saved
  return recommendations.sort((a, b) => b.timeSavedMinutes - a.timeSavedMinutes)
}
