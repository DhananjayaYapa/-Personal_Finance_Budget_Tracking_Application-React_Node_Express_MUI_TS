import { Request, Response, NextFunction } from 'express';
import TransactionService from './transaction.service.js';
import { successResponse } from '../../shared/utils/responseHelper.js';
import { exportToCSV, exportToJSON, getExportFilename } from '../../shared/utils/exportHelper.js';

// ─── Transaction Controller (HTTP Layer Only) ───────────────────────────────

class TransactionController {
    static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { transaction, budgetWarning } = await TransactionService.create(
                req.user!.userId,
                req.body,
            );

            const message = budgetWarning
                ? 'Transaction created successfully'
                : 'Transaction created successfully';

            res.status(201).json({
                success: true,
                message,
                data: transaction,
                warning: budgetWarning || null,
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await TransactionService.getAll(req.user!.userId, req.query as never);
            successResponse(res, result, 'Transactions retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            const transaction = await TransactionService.getById(req.user!.userId, id);
            successResponse(res, transaction, 'Transaction retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            const transaction = await TransactionService.update(req.user!.userId, id, req.body);
            successResponse(res, transaction, 'Transaction updated successfully');
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            await TransactionService.delete(req.user!.userId, id);
            successResponse(res, null, 'Transaction deleted successfully');
        } catch (error) {
            next(error);
        }
    }

    // ── Export CSV ──────────────────────────────────────────────────────────

    static async exportCSV(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const transactions = await TransactionService.getForExport(
                req.user!.userId,
                req.query as never,
            );
            const csv = exportToCSV(transactions);
            const filename = getExportFilename('csv');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.send(csv);
        } catch (error) {
            next(error);
        }
    }

    // ── Export JSON ─────────────────────────────────────────────────────────

    static async exportJSON(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const transactions = await TransactionService.getForExport(
                req.user!.userId,
                req.query as never,
            );
            const data = exportToJSON(transactions);
            const filename = getExportFilename('json');

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
}

export default TransactionController;
