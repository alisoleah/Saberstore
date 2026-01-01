import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { connectDatabase } from './config/database';
import config from './config/config';
import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import ordersRoutes from './routes/orders.routes';
import installmentsRoutes from './routes/installments.routes';
import kycRoutes from './routes/kyc.routes';
import adminRoutes from './routes/admin.routes';
import marketplaceRoutes from './routes/marketplace.routes';
import uploadRoutes from './routes/upload.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware';
import { apiLimiter } from './middleware/rateLimiter.middleware';
import { sanitizeAll } from './middleware/sanitize.middleware';
import { startAllMarketplaceJobs } from './jobs/marketplace-sync.job';

const app: Express = express();

// Security Headers - Helmet.js
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:', 'http:'],
      connectSrc: ["'self'", config.frontendUrl],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  hidePoweredBy: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
}));

// CORS
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Input sanitization - Prevent XSS and NoSQL injection
app.use(sanitizeAll);

// Apply global rate limiting to all API routes
app.use('/api', apiLimiter);

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'SaberStore API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/installments', installmentsRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;

async function startServer() {
  try {
    // Connect to database
    await connectDatabase();

    // Start marketplace sync jobs (only in production or if explicitly enabled)
    if (config.nodeEnv === 'production' || process.env.ENABLE_MARKETPLACE_JOBS === 'true') {
      startAllMarketplaceJobs();
    } else {
      console.log('⏸️  Marketplace sync jobs disabled (set ENABLE_MARKETPLACE_JOBS=true to enable)');
    }

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${config.nodeEnv}`);
      console.log(`🌐 Frontend URL: ${config.frontendUrl}`);
      console.log(`\n✅ API Endpoints:`);
      console.log(`   POST   /api/auth/register`);
      console.log(`   POST   /api/auth/login`);
      console.log(`   POST   /api/auth/refresh`);
      console.log(`   GET    /api/auth/me`);
      console.log(`   GET    /api/products`);
      console.log(`   GET    /api/products/:id`);
      console.log(`   GET    /api/products/search`);
      console.log(`   GET    /api/products/budget/:amount`);
      console.log(`   GET    /api/categories`);
      console.log(`   POST   /api/orders`);
      console.log(`   GET    /api/orders`);
      console.log(`   GET    /api/orders/:id`);
      console.log(`   GET    /api/marketplace/inventory`);
      console.log(`   POST   /api/marketplace/sync/:productId`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;

