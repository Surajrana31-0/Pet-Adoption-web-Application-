import express from 'express';
import { login, signup, requestPasswordReset, confirmPasswordReset } from '../../controller/auth/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/reset-password', requestPasswordReset);
router.post('/reset-password/confirm', confirmPasswordReset);

export { router as authRouter }; 