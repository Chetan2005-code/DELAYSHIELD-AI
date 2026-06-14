import { Router } from 'express';
import { getDelayDNAInsights } from '../controllers/delayDna.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', requireAuth, getDelayDNAInsights);

export default router;
