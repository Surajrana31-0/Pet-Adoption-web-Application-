import express from 'express';
import { adoptionController } from '../../controller/adoption/adoptionController.js';
import { requireAuth, requireAdmin } from '../../middleware/auth-middleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', requireAdmin, adoptionController.getAll);
router.post('/', adoptionController.create);
router.get('/:id', adoptionController.getById);
router.put('/:id', adoptionController.update);
router.delete('/:id', adoptionController.deleteById);

export { router as adoptionRouter }; 