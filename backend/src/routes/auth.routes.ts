import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 * Body: { fullName, phoneNumber, email?, password, governorate? }
 */
router.post('/register', authController.register);

/**
 * POST /api/auth/login
 * Login with phone and password
 * Body: { phoneNumber, password }
 */
router.post('/login', authController.login);

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 * Body: { refreshToken }
 */
router.post('/refresh', authController.refreshToken);

/**
 * GET /api/auth/me
 * Get current authenticated user
 * Headers: Authorization: Bearer <access_token>
 */
router.get('/me', authenticate, authController.getCurrentUser);

/**
 * POST /api/auth/logout
 * Logout (client-side token removal, placeholder for future token blacklist)
 * Headers: Authorization: Bearer <access_token>
 */
router.post('/logout', authenticate, authController.logout);

export default router;
