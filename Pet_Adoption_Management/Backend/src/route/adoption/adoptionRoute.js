import express from 'express';
import { adoptionController } from '../../controller/adoption/adoptionController.js';
import { requireAuth, requireAdmin } from '../../middleware/auth-middleware.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', adoptionController.create);
router.get('/', adoptionController.getAll);
router.put('/:id/approve', requireAdmin, adoptionController.approve);
router.put('/:id/reject', requireAdmin, adoptionController.reject);

export { router as adoptionRouter }; 