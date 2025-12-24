import { Router } from 'express';
import productsController from '../controllers/products.controller';
import { authenticate, optionalAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

/**
 * GET /api/products
 * List products with filters and pagination
 * Query params: categoryId, brand, minPrice, maxPrice, search, inStock, page, limit
 */
router.get('/', optionalAuth, productsController.getProducts);

/**
 * GET /api/products/featured
 * Get featured products
 * Query params: limit (default: 8)
 */
router.get('/featured', optionalAuth, productsController.getFeaturedProducts);

/**
 * GET /api/products/search
 * Search products by query
 * Query params: q (query), limit (default: 10)
 */
router.get('/search', optionalAuth, productsController.searchProducts);

/**
 * GET /api/products/budget/:monthlyBudget
 * Get products by monthly installment budget
 * Params: monthlyBudget (in EGP)
 * Query params: duration (default: 24 months), limit (default: 20)
 */
router.get('/budget/:monthlyBudget', optionalAuth, productsController.getProductsByBudget);

/**
 * GET /api/products/:id
 * Get single product by ID
 * Params: id (product UUID)
 */
router.get('/:id', optionalAuth, productsController.getProductById);

/**
 * GET /api/categories
 * List all categories
 */
router.get('/categories', optionalAuth, productsController.getCategories);

/**
 * GET /api/categories/:id
 * Get category with products
 * Params: id (category UUID)
 */
router.get('/categories/:id', optionalAuth, productsController.getCategoryById);

// Admin routes (Protected)
router.post('/', authenticate, requireRole('admin'), productsController.createProduct);
router.put('/:id', authenticate, requireRole('admin'), productsController.updateProduct);
router.delete('/:id', authenticate, requireRole('admin'), productsController.deleteProduct);

export default router;
