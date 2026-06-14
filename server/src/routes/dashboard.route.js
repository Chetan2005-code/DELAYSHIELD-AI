import { Router } from 'express';
import { getDashboardMetrics } from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', requireAuth, getDashboardMetrics);

export default router;
