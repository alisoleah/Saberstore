import { Request, Response, NextFunction } from 'express';
import adminService from '../services/admin.service';

export class AdminController {
  /**
   * Get Pending KYC
   */
  async getPendingKyc(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;
      const result = await adminService.getPendingKyc(
        Number(page || 1),
        Number(limit || 20)
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Approve KYC
   */
  async approveKyc(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, creditLimit } = req.body;
      const adminId = (req as any).user.userId;

      if (!userId || !creditLimit) {
        return res.status(400).json({
          success: false,
          message: 'UserId and CreditLimit are required',
        });
      }

      const result = await adminService.approveKyc(userId, adminId, Number(creditLimit));

      res.status(200).json({
        success: true,
        message: 'KYC Approved and Credit Limit Set',
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Reject KYC
   */
  async rejectKyc(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, reason } = req.body;
      const adminId = (req as any).user.userId;

      if (!userId || !reason) {
        return res.status(400).json({
          success: false,
          message: 'UserId and Reason are required',
        });
      }

      const result = await adminService.rejectKyc(userId, adminId, reason);

      res.status(200).json({
        success: true,
        message: 'KYC Rejected',
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get Analytics
   */
  async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await adminService.getAnalytics();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      next(error);
    }
  }
}

export default new AdminController();
