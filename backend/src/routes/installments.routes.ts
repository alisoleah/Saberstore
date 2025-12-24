import { Router } from 'express';
import installmentsController from '../controllers/installments.controller';

const router = Router();

// Get plans (Public)
router.get('/plans', installmentsController.getPlans);

// Calculate (Public)
router.post('/calculate', installmentsController.calculate);

export default router;
