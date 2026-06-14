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
    isDemo: document.isDemo || false,
    createdAt: document.createdAt
  }
}

export async function getShipmentsByUserId(userId) {
  const shipments = await Shipment.find({
    $or: [{ userId }, { isDemo: true }]
  }).sort({ createdAt: -1 }).lean()
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

export async function seedDemoShipments() {
  const count = await Shipment.countDocuments({ isDemo: true });
  if (count >= 5) return;

  // Clear old demo shipments or any existing shipments matching the master demo IDs
  await Shipment.deleteMany({
    $or: [
      { isDemo: true },
      { id: { $in: ['SHP-1001', 'SHP-1002', 'SHP-1003', 'SHP-1004', 'SHP-1005'] } }
    ]
  });

  console.log('[shipment] Seeding default demo shipments...');
  const adminUserId = 'demo-admin';

  const demoShipments = [
    {
      id: 'SHP-1001',
      userId: adminUserId,
      isDemo: true,
      origin: { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
      destination: { name: 'Delhi', lat: 28.7041, lon: 77.1025 },
      traffic: 10,
      weather: 10,
      delay: 0,
      priority: 'Medium',
      status: 'In Transit',
      riskScore: 10,
      shipmentPayload: {
        recovery: { primaryCause: 'Normal Operations', action: 'On Schedule' }
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'SHP-1002',
      userId: adminUserId,
      isDemo: true,
      origin: { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
      destination: { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
      traffic: 85,
      weather: 20,
      delay: 45,
      priority: 'High',
      status: 'Delayed',
      riskScore: 75,
      shipmentPayload: {
        recovery: { primaryCause: 'Traffic Congestion', action: 'Reroute to Highway 48', estimatedTimeSaved: 40, lossPrevented: 1500 }
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'SHP-1003',
      userId: adminUserId,
      isDemo: true,
      origin: { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
      destination: { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
      traffic: 40,
      weather: 30,
      delay: 60,
      priority: 'High',
      status: 'At Risk',
      riskScore: 85,
      warehouseId: 'WH-HYD-1',
      shipmentPayload: {
        recovery: { primaryCause: 'Warehouse Congestion', action: 'Switch to Alternate Hub', estimatedTimeSaved: 120, lossPrevented: 4500 }
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'SHP-1004',
      userId: adminUserId,
      isDemo: true,
      origin: { name: 'Pune', lat: 18.5204, lon: 73.8567 },
      destination: { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
      traffic: 30,
      weather: 95,
      delay: 120,
      priority: 'Critical',
      status: 'Delayed',
      riskScore: 92,
      shipmentPayload: {
        recovery: { primaryCause: 'Severe Weather', action: 'Halt & Secure Cargo', estimatedTimeSaved: 0, lossPrevented: 12000 }
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'SHP-1005',
      userId: adminUserId,
      isDemo: true,
      origin: { name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
      destination: { name: 'Surat', lat: 21.1702, lon: 72.8311 },
      traffic: 95,
      weather: 90,
      delay: 240,
      priority: 'Critical',
      status: 'Delayed',
      riskScore: 98,
      shipmentPayload: {
        recovery: { primaryCause: 'Critical SLA Breach', action: 'Expedite via Air Freight', estimatedTimeSaved: 360, lossPrevented: 52000 }
      },
      createdAt: new Date().toISOString()
    }
  ];

  await Shipment.insertMany(demoShipments);
  console.log('[shipment] Unified Demo scenarios seeded successfully');
}
