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

const shipmentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    userId: {
      type: String,
      required: true,
      index: true
    },
    origin: {
      type: coordinateSchema,
      required: true
    },
    destination: {
      type: coordinateSchema,
      required: true
    },
    traffic: {
      type: Number,
      default: 0
    },
    weather: {
      type: Number,
      default: 0
    },
    delay: {
      type: Number,
      default: 0
    },
    priority: {
      type: String,
      default: 'Medium'
    },
    status: {
      type: String,
      default: 'In Transit'
    },
    riskScore: {
      type: Number,
      default: 0
    },
    shipmentPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: null
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

shipmentSchema.index({ userId: 1, createdAt: -1 })

export const Shipment = mongoose.models.Shipment || mongoose.model('Shipment', shipmentSchema)
