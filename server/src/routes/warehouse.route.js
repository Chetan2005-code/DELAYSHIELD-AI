import { Router } from 'express'
import {
  getWarehouses,
  redirectShipment,
  resetWarehouses,
  simulateSurge
} from '../controllers/warehouse.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', requireAuth, getWarehouses)
router.post('/redirect', requireAuth, redirectShipment)
router.post('/reset', requireAuth, resetWarehouses)
router.post('/surge', requireAuth, simulateSurge)

export default router
