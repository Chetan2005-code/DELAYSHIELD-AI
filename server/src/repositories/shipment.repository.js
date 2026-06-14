import { Shipment } from '../models/shipment.model.js'

function mapShipment(document) {
  if (!document) return null

  return {
    id: document.id,
    userId: document.userId,
    origin: document.origin,
    destination: document.destination,
    traffic: document.traffic,
    weather: document.weather,
    delay: document.delay,
    priority: document.priority,
    status: document.status,
    riskScore: document.riskScore,
    warehouseId: document.warehouseId || null,
    shipmentPayload: document.shipmentPayload,
    createdAt: document.createdAt
  }
}

export async function getShipmentsByUserId(userId) {
  const shipments = await Shipment.find({ userId }).sort({ createdAt: -1 }).lean()
  return shipments.map(mapShipment)
}

export async function getShipmentByIdForUser(shipmentId, userId) {
  const shipment = await Shipment.findOne({ id: shipmentId, userId }).lean()
  return mapShipment(shipment)
}

export async function getShipmentByIdPublic(shipmentId) {
  const shipment = await Shipment.findOne({ id: shipmentId }).lean()
  return mapShipment(shipment)
}

export async function createShipmentForUser(userId, shipment) {
  const payload = shipment.shipmentPayload || shipment.fullPayload || null

  const created = await Shipment.create({
    id: shipment.id,
    userId,
    origin: shipment.origin,
    destination: shipment.destination,
    traffic: shipment.traffic ?? 0,
    weather: shipment.weather ?? 0,
    delay: shipment.delay ?? 0,
    priority: shipment.priority ?? 'Medium',
    status: shipment.status ?? 'In Transit',
    riskScore: shipment.riskScore ?? 0,
    warehouseId: shipment.warehouseId ?? null,
    shipmentPayload: payload,
    createdAt: new Date().toISOString()
  })

  return mapShipment(created.toObject())
}

export async function getShipmentsByWarehouse(warehouseId) {
  const shipments = await Shipment.find({ warehouseId }).lean()
  return shipments.map(mapShipment)
}

export async function getActiveIncomingShipmentsByWarehouse(warehouseId) {
  const shipments = await Shipment.find({ warehouseId, status: { $in: ['In Transit', 'Delayed', 'At Risk', 'Monitoring'] } }).lean()
  return shipments.map(mapShipment)
}

export async function updateShipmentWarehouse(shipmentId, warehouseId) {
  const updated = await Shipment.findOneAndUpdate(
    { id: shipmentId },
    { warehouseId },
    { new: true }
  ).lean()
  return mapShipment(updated)
}

