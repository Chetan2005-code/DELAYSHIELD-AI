import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    passwordHash: {
      type: String,
      default: null
    },
    authProviders: {
      type: [String],
      default: []
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

export const User = mongoose.models.User || mongoose.model('User', userSchema)
