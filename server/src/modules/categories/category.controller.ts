import { Request, Response, NextFunction } from 'express';
import CategoryService from './category.service.js';
import { successResponse, createdResponse } from '../../shared/utils/responseHelper.js';

// ─── Category Controller (HTTP Layer Only) ──────────────────────────────────

class CategoryController {
    static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const category = await CategoryService.create(req.user!.userId, req.body);
            createdResponse(res, category, 'Category created successfully');
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const categories = await CategoryService.getAll(req.user!.userId, req.query);
            successResponse(res, categories, 'Categories retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            const category = await CategoryService.getById(req.user!.userId, id);
            successResponse(res, category, 'Category retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            const category = await CategoryService.update(req.user!.userId, id, req.body);
            successResponse(res, category, 'Category updated successfully');
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            await CategoryService.delete(req.user!.userId, id);
            successResponse(res, null, 'Category deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

export default CategoryController;
