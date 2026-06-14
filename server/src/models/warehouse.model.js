import mongoose from 'mongoose'

const coordinateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  {
    _id: false
  }
)

const warehouseSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    currentLoad: {
      type: Number,
      required: true
    },
    processingSpeed: {
      type: Number,
      default: 50
    },
    location: {
      type: coordinateSchema,
      required: true
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString()
    }
  },
  {
    versionKey: false
  }
)

export const Warehouse = mongoose.models.Warehouse || mongoose.model('Warehouse', warehouseSchema)
