import { Router } from 'express';
import { getAnalyticsMetrics } from '../controllers/analytics.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', requireAuth, getAnalyticsMetrics);

export default router;
