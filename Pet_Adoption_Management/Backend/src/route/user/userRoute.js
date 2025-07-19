import express from 'express'
import { getAll, update, deleteById, getById, getMe, updateMe, getProfile } from '../../controller/user/userController.js';
import { requireAuth, requireAdmin } from '../../middleware/auth-middleware.js';
import upload from '../../middleware/multerConfig.js';
import { body } from 'express-validator';
const router=express.Router();

console.log("userRouter loaded");

router.use(requireAuth);

router.get("/", requireAdmin, getAll);
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
router.get('/me', getMe);
router.put('/me',
  upload.single('image'),
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  updateMe
);
router.get('/profile', getProfile);

export  {router as userRouter };



