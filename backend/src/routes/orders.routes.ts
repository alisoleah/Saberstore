import { Router } from 'express';
import ordersController from '../controllers/orders.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protect all order routes
router.use(authenticate);

// Create new order
router.post('/', ordersController.createOrder);

// Get my orders
router.get('/', ordersController.getMyOrders);

// Get order by ID
router.get('/:id', ordersController.getOrderById);

export default router;
