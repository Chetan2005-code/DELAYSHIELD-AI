import { Router } from 'express'
import { getAllHistory, getShipmentHistory, createHistoryEntry } from '../controllers/history.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', requireAuth, getAllHistory)
router.post('/', requireAuth, createHistoryEntry)
router.get('/:shipmentId', requireAuth, getShipmentHistory)

export default router
