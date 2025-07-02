import express from 'express';
import { petController } from '../../controller/pet/petController.js';
import { requireAuth, requireAdmin } from '../../middleware/auth-middleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', petController.getAll);
router.post('/', requireAdmin, petController.create);
router.get('/:id', petController.getById);
router.put('/:id', requireAdmin, petController.update);
router.delete('/:id', requireAdmin, petController.deleteById);

export { router as petRouter }; 