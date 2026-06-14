import { Warehouse } from '../models/warehouse.model.js'
import { Shipment } from '../models/shipment.model.js'

export const defaultWarehouses = [
  {
    id: 'WH-Chennai-2',
    name: 'WH-Chennai-2',
    capacity: 350,
    currentLoad: 340,
    processingSpeed: 45,
    location: { name: 'Chennai, Tamil Nadu', lat: 13.0827, lon: 80.2707 }
  },
  {
    id: 'WH-Mumbai-1',
    name: 'WH-Mumbai-1',
    capacity: 500,
    currentLoad: 425,
    processingSpeed: 55,
    location: { name: 'Mumbai, Maharashtra', lat: 19.0760, lon: 72.8777 }
  },
  {
    id: 'WH-Kolkata-4',
    name: 'WH-Kolkata-4',
    capacity: 450,
    currentLoad: 360,
    processingSpeed: 40,
    location: { name: 'Kolkata, West Bengal', lat: 22.5726, lon: 88.3639 }
  },
  {
    id: 'WH-Delhi-3',
    name: 'WH-Delhi-3',
    capacity: 800,
    currentLoad: 520,
    processingSpeed: 75,
    location: { name: 'Delhi, Delhi', lat: 28.6139, lon: 77.2090 }
  },
  {
    id: 'WH-Bangalore-1',
    name: 'WH-Bangalore-1',
    capacity: 600,
    currentLoad: 390,
    processingSpeed: 60,
    location: { name: 'Bangalore, Karnataka', lat: 12.9716, lon: 77.5946 }
  },
  {
    id: 'WH-Hyderabad-2',
    name: 'WH-Hyderabad-2',
    capacity: 700,
    currentLoad: 280,
    processingSpeed: 50,
    location: { name: 'Hyderabad, Telangana', lat: 17.3850, lon: 78.4867 }
  }
]

function mapWarehouse(doc) {
  if (!doc) return null
  return {
    id: doc.id,
    name: doc.name,
    capacity: doc.capacity,
    currentLoad: doc.currentLoad,
    processingSpeed: doc.processingSpeed,
    location: doc.location,
    createdAt: doc.createdAt
  }
}

export async function getAllWarehouses() {
  const list = await Warehouse.find({}).lean()
  return list.map(mapWarehouse)
}

export async function getWarehouseById(id) {
  const wh = await Warehouse.findOne({ id }).lean()
  return mapWarehouse(wh)
}

export async function updateWarehouseLoad(id, currentLoad) {
  const updated = await Warehouse.findOneAndUpdate(
    { id },
    { currentLoad },
    { new: true }
  ).lean()
  return mapWarehouse(updated)
}

export async function seedWarehouses(force = false) {
  if (!force) {
    const count = await Warehouse.countDocuments()
    if (count > 0) {
      await linkShipmentsToWarehouses(false)
      return
    }
  }

  if (force) {
    await Warehouse.deleteMany({})
  }

  await Warehouse.insertMany(defaultWarehouses)
  await linkShipmentsToWarehouses(true)
}

async function linkShipmentsToWarehouses(forceAll = false) {
  const query = forceAll ? {} : { warehouseId: null }
  const shipments = await Shipment.find(query)
  for (const s of shipments) {
    let matchedWarehouse = 'WH-Bangalore-1'
    const destName = (s.destination?.name || '').toLowerCase()

    if (destName.includes('chennai')) {
      matchedWarehouse = 'WH-Chennai-2'
    } else if (destName.includes('mumbai')) {
      matchedWarehouse = 'WH-Mumbai-1'
    } else if (destName.includes('kolkata')) {
      matchedWarehouse = 'WH-Kolkata-4'
    } else if (destName.includes('delhi')) {
      matchedWarehouse = 'WH-Delhi-3'
    } else if (destName.includes('bangalore')) {
      matchedWarehouse = 'WH-Bangalore-1'
    } else if (destName.includes('hyderabad')) {
      matchedWarehouse = 'WH-Hyderabad-2'
    } else {
      const index = Math.floor(Math.random() * defaultWarehouses.length)
      matchedWarehouse = defaultWarehouses[index].id
    }

    await Shipment.updateOne({ id: s.id }, { warehouseId: matchedWarehouse })
  }
}
