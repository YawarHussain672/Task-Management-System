import { Router } from 'express';
import { register, login, refresh, logout } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';
import {
    registerValidation,
    loginValidation,
    refreshValidation,
    validate,
} from '../middleware/validation';

const router = Router();

// POST /auth/register - Register a new user
router.post('/register', registerValidation, validate, register);

// POST /auth/login - Login user
router.post('/login', loginValidation, validate, login);

// POST /auth/refresh - Refresh access token
router.post('/refresh', refreshValidation, validate, refresh);

// POST /auth/logout - Logout user (requires auth)
router.post('/logout', authMiddleware, logout);

export default router;
