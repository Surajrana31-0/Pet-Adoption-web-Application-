import express from 'express';
import { petController } from '../../controller/pet/petController.js';
import { requireAuth, requireAdmin } from '../../middleware/auth-middleware.js';
import upload from '../../middleware/multerConfig.js';
import { body } from 'express-validator';

const router = express.Router();

router.get('/', petController.getAll);
router.post(
  '/',
  requireAuth,
  requireAdmin,
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('breed').notEmpty().withMessage('Breed is required'),
    body('type').notEmpty().withMessage('Type is required'),
    body('age').isInt({ min: 1 }).withMessage('Age must be a positive number'),
    body('status').notEmpty().withMessage('Status is required'),
  ],
  petController.create
);
router.get('/:id', petController.getById);
router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('breed').notEmpty().withMessage('Breed is required'),
    body('type').notEmpty().withMessage('Type is required'),
    body('age').isInt({ min: 1 }).withMessage('Age must be a positive number'),
    body('status').notEmpty().withMessage('Status is required'),
  ],
  petController.update
);
router.delete('/:id', requireAuth, requireAdmin, petController.deleteById);

export { router as petRouter }; 