import { Router } from 'express';
import adminController from '../controllers/admin.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Protect all admin routes
router.use(authenticate);
router.use(requireRole('admin'));

// KYC Management
router.get('/kyc/pending', adminController.getPendingKyc);
router.put('/kyc/approve', adminController.approveKyc);
router.put('/kyc/reject', adminController.rejectKyc);

// Analytics
router.get('/analytics', adminController.getAnalytics);

export default router;
