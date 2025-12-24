import { Request, Response } from 'express';
import authService from '../services/auth.service';

export class AuthController {
  /**
   * Register new user
   * POST /api/auth/register
   */
  async register(req: Request, res: Response) {
    try {
      const { fullName, phoneNumber, email, password, governorate } = req.body;

      // Validate required fields
      if (!fullName || !phoneNumber || !password) {
        return res.status(400).json({
          success: false,
          message: 'Full name, phone number, and password are required',
        });
      }

      const result = await authService.register({
        fullName,
        phoneNumber,
        email,
        password,
        governorate,
      });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Registration failed',
      });
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req: Request, res: Response) {
    try {
      const { phoneNumber, password } = req.body;

      // Validate required fields
      if (!phoneNumber || !password) {
        return res.status(400).json({
          success: false,
          message: 'Phone number and password are required',
        });
      }

      const result = await authService.login({
        phoneNumber,
        password,
      });

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Login failed',
      });
    }
  }

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        });
      }

      const tokens = await authService.refreshToken(refreshToken);

      return res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: tokens,
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Token refresh failed',
      });
    }
  }

  /**
   * Get current user
   * GET /api/auth/me
   */
  async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      const user = await authService.getUserById(userId);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || 'User not found',
      });
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  async logout(req: Request, res: Response) {
    // In a stateless JWT system, logout is handled client-side
    // by removing the tokens from storage
    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  }
}

export default new AuthController();
