import express from 'express';
import { petController } from '../../controller/pet/petController.js';
import { authenticateToken } from '../../middleware/token-middleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', petController.getAll);
router.post('/', petController.create);
router.get('/:id', petController.getById);
router.put('/:id', petController.update);
router.delete('/:id', petController.deleteById);

export { router as petRouter }; 