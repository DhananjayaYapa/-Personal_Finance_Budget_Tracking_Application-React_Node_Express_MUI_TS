import { Request, Response, NextFunction } from 'express';
import BudgetService from './budget.service.js';
import { successResponse, createdResponse } from '../../shared/utils/responseHelper.js';

// ─── Budget Controller (HTTP Layer Only) ────────────────────────────────────

class BudgetController {
    static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const budget = await BudgetService.create(req.user!.userId, req.body);
            createdResponse(res, budget, 'Budget created successfully');
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const budgets = await BudgetService.getAll(req.user!.userId, req.query as never);
            successResponse(res, budgets, 'Budgets retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            const budget = await BudgetService.getById(req.user!.userId, id);
            successResponse(res, budget, 'Budget retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            const budget = await BudgetService.update(req.user!.userId, id, req.body);
            successResponse(res, budget, 'Budget updated successfully');
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            await BudgetService.delete(req.user!.userId, id);
            successResponse(res, null, 'Budget deleted successfully');
        } catch (error) {
            next(error);
        }
    }

    static async getProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const progress = await BudgetService.getProgress(req.user!.userId, req.query as never);
            successResponse(res, progress, 'Budget progress retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
}

export default BudgetController;
