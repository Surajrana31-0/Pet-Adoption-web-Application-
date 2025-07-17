import express from 'express';
import { adoptionController } from '../../controller/adoption/adoptionController.js';
import { requireAuth, requireAdmin } from '../../middleware/auth-middleware.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', adoptionController.create);
router.get('/', adoptionController.getAllForUser);
router.patch('/:id/approve', requireAdmin, adoptionController.approve);

export { router as adoptionRouter }; 