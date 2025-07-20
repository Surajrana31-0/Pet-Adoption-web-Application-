import express from 'express'
import { getAll, update, deleteById, getById, getMe, updateMe, getProfile } from '../../controller/user/userController.js';
import { requireAuth, requireAdmin } from '../../middleware/auth-middleware.js';
import upload from '../../middleware/multerConfig.js';
import { body } from 'express-validator';
const router=express.Router();

console.log("userRouter loaded");

router.use(requireAuth);

router.get("/", requireAdmin, getAll);
router.get('/me', getMe);
router.get('/profile', getProfile);
// PATCH with image upload and validation
router.patch(
  "/:id",
  requireAdmin,
  upload.single('image'),
  [
    body('role').optional().isIn(['user', 'admin']).withMessage('Role must be user or admin'),
  ],
  update
);
router.get("/:id", getById);
router.delete("/:id", requireAdmin, deleteById);
router.put('/me',
  upload.single('image'),
  [
    body('firstName').optional().notEmpty().withMessage('First name is required'),
    body('lastName').optional().notEmpty().withMessage('Last name is required'),
    body('first_name').optional().notEmpty().withMessage('First name is required'),
    body('last_name').optional().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  updateMe
);

export  {router as userRouter };



