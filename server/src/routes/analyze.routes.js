import express from 'express'
import { analyzeShipment } from '../controllers/analyze.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/', requireAuth, analyzeShipment)

export default router
