import { Request, Response, NextFunction } from 'express';
import installmentsService from '../services/installments.service';

export class InstallmentsController {
  /**
   * Get all active installment plans
   */
  async getPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await installmentsService.getPlans();
      res.status(200).json({
        success: true,
        data: plans,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Calculate installment details
   */
  async calculate(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount, planId } = req.body;

      if (!amount || !planId) {
        return res.status(400).json({
          success: false,
          message: 'Amount and planId are required',
        });
      }

      const calculation = await installmentsService.calculate(Number(amount), planId);

      res.status(200).json({
        success: true,
        data: calculation,
      });
    } catch (error: any) {
      next(error);
    }
  }
}

export default new InstallmentsController();
