import express from 'express';
import { login, signup } from '../../controller/auth/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

export { router as authRouter }; 