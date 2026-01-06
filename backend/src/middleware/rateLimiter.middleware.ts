import rateLimit from 'express-rate-limit';
import Redis from 'ioredis';

// Initialize Redis client
let redis: Redis | null = null;

// Try to connect to Redis if available, otherwise use memory store
try {
  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times) => {
      if (times > 3) {
        console.warn('⚠️  Redis unavailable - using in-memory rate limiting');
        return null; // Stop retrying
      }
      return Math.min(times * 100, 3000);
    },
  });

  redis.on('error', (err) => {
    console.warn('⚠️  Redis connection error:', err.message);
    redis = null; // Fallback to memory store
  });

  redis.on('connect', () => {
    console.log('✅ Redis connected for rate limiting');
  });
} catch (error) {
  console.warn('⚠️  Redis initialization failed - using in-memory rate limiting');
  redis = null;
}

/**
 * Standard API rate limiter
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  keyGenerator: (req) => {
    const userAgent = req.get('user-agent') || 'unknown';
    return `${req.ip}-${userAgent}`;
  },
});

/**
 * Strict authentication rate limiter
 * 5 login attempts per 15 minutes per IP
 * Prevents brute force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    error: 'Too many login attempts from this IP. Please try again in 15 minutes.',
    retryAfter: '15 minutes',
    lockoutTime: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
  keyGenerator: (req) => {
    const userAgent = req.get('user-agent') || 'unknown';
    return `auth:${req.ip}-${userAgent}`;
  },
});

/**
 * Registration rate limiter
 * 3 registration attempts per hour per IP
 * Prevents spam account creation
 */
export const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per hour
  message: {
    error: 'Too many accounts created from this IP. Please try again later.',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return `register:${req.ip}`;
  },
});

/**
 * OTP rate limiter
 * 3 OTP requests per 5 minutes per phone number
 * Prevents SMS bombing
 */
export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // 3 OTP requests per window
  message: {
    error: 'Too many OTP requests. Please try again in 5 minutes.',
    retryAfter: '5 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use phone number from request body for better tracking
    const phoneNumber = req.body?.phoneNumber || req.ip;
    return `otp:${phoneNumber}`;
  },
});

/**
 * Password reset rate limiter
 * 3 password reset requests per hour per IP
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 reset requests per hour
  message: {
    error: 'Too many password reset attempts. Please try again in 1 hour.',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return `reset:${req.ip}`;
  },
});

/**
 * File upload rate limiter
 * 10 uploads per hour per user
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: {
    error: 'Too many file uploads. Please try again later.',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use authenticated user ID if available, otherwise IP
    const userId = (req as any).user?.id || req.ip;
    return `upload:${userId}`;
  },
});

/**
 * Admin action rate limiter (more lenient for admins)
 * 200 requests per 15 minutes
 */
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per window
  message: {
    error: 'Too many admin actions. Please slow down.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const userId = (req as any).user?.id || req.ip;
    return `admin:${userId}`;
  },
});

/**
 * Order creation rate limiter
 * 5 orders per hour per user
 */
export const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 orders per hour
  message: {
    error: 'Too many orders created. Please try again later.',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const userId = (req as any).user?.id || req.ip;
    return `order:${userId}`;
  },
});

// Export Redis instance for use in other services
export { redis };
