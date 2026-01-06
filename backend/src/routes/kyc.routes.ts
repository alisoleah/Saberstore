import { Router } from 'express';
import multer from 'multer';
import kycController from '../controllers/kyc.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Protect all KYC routes
router.use(authenticate);

// Upload document
router.post('/upload-document', upload.single('file'), kycController.uploadDocument);

// Submit Application
router.post('/submit', kycController.submitKyc);

// Get Status
router.get('/status', kycController.getStatus);

export default router;
