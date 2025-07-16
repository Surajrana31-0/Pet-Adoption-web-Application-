import express from 'express'
import { userController } from '../../controller/index.js';
import { requireAuth, requireAdmin, authenticateJWT } from '../../middleware/auth-middleware.js';
import { getMe, updateMe } from '../../controller/user/userController.js';
const router=express.Router();

router.use(requireAuth);

router.get("/", requireAdmin, userController.getAll);
router.post("/", requireAdmin, userController.create);
router.patch("/:id", requireAdmin, userController.update);
router.get("/:id", userController.getById);
router.delete("/:id", requireAdmin, userController.delelteById);
router.get('/me', authenticateJWT, getMe);
router.put('/me', authenticateJWT, updateMe);

export  {router as userRouter };



