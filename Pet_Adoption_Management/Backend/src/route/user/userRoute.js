import express from 'express'
import { userController } from '../../controller/index.js';
import { requireAuth, requireAdmin } from '../../middleware/auth-middleware.js';
import { getMe, updateMe } from '../../controller/user/userController.js';
import upload from '../../middleware/multerConfig.js';
import { body } from 'express-validator';
const router=express.Router();

router.use(requireAuth);

router.get("/", requireAdmin, userController.getAll);
// PATCH with image upload and validation
router.patch(
  "/:id",
  requireAdmin,
  upload.single('image'),
  [
    body('role').optional().isIn(['user', 'admin']).withMessage('Role must be user or admin'),
  ],
  userController.update
);
router.get("/:id", userController.getById);
router.delete("/:id", requireAdmin, userController.delelteById);
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

export  {router as userRouter };



