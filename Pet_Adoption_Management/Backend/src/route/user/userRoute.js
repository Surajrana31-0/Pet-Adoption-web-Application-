import express from 'express'
import { userController } from '../../controller/index.js';
import { requireAuth, requireAdmin } from '../../middleware/auth-middleware.js';
const router=express.Router();

router.use(requireAuth);

router.get("/", requireAdmin, userController.getAll);
router.post("/", requireAdmin, userController.create);
router.patch("/:id", requireAdmin, userController.update);
router.get("/:id", userController.getById);
router.delete("/:id", requireAdmin, userController.delelteById);

export  {router as userRouter };



