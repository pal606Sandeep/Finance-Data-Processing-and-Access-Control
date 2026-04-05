import express from 'express';
import { register, login, refresh } from '../controllers/authController.js';
import { authLimiter } from '../middleware/rateLimiting.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', authLimiter, login); 
router.post('/refresh', refresh);

export default router;