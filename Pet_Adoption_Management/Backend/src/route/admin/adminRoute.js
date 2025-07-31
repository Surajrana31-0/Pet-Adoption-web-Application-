import express from 'express';
import { getAdminStats } from '../../controller/adminController.js';
import { requireAuth, requireAdmin } from '../../middleware/auth-middleware.js';

const router = express.Router();

router.get('/stats', requireAuth, requireAdmin, getAdminStats);

export { router as adminRouter }; 