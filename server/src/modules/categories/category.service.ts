import prisma from '../../config/db.js';
import { ConflictError, NotFoundError, ValidationError } from '../../middleware/errorHandler.js';
import type { CreateCategoryInput, UpdateCategoryInput, CategoryQueryInput } from './category.schema.js';
import type { CategoryType } from '../../generated/prisma/client.js';

// ─── Category Service ───────────────────────────────────────────────────────

class CategoryService {
    // ── Create ──────────────────────────────────────────────────────────────

    static async create(userId: number, data: CreateCategoryInput) {
        const existing = await prisma.category.findFirst({
            where: { name: data.name, userId, type: data.type as CategoryType },
        });

        if (existing) {
            throw new ConflictError(`Category "${data.name}" already exists for type ${data.type}`);
        }

        return prisma.category.create({
            data: {
                name: data.name,
                type: data.type as CategoryType,
                userId,
            },
            select: {
                id: true,
                name: true,
                type: true,
                createdAt: true,
            },
        });
    }

    // ── Get All ─────────────────────────────────────────────────────────────

    static async getAll(userId: number, query: CategoryQueryInput) {
        const where: Record<string, unknown> = { userId };

        if (query.type) {
            where.type = query.type;
        }

        return prisma.category.findMany({
            where,
            select: {
                id: true,
                name: true,
                type: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { name: 'asc' },
        });
    }

    // ── Get By ID ───────────────────────────────────────────────────────────

    static async getById(userId: number, id: number) {
        const category = await prisma.category.findFirst({
            where: { id, userId },
            select: {
                id: true,
                name: true,
                type: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!category) {
            throw new NotFoundError('Category not found');
        }

        return category;
    }

    // ── Update ──────────────────────────────────────────────────────────────

    static async update(userId: number, id: number, data: UpdateCategoryInput) {
        const category = await prisma.category.findFirst({
            where: { id, userId },
        });

        if (!category) {
            throw new NotFoundError('Category not found');
        }

        // Check for duplicate name if name or type is being changed
        if (data.name || data.type) {
            const checkName = data.name || category.name;
            const checkType = (data.type || category.type) as CategoryType;

            const duplicate = await prisma.category.findFirst({
                where: {
                    name: checkName,
                    userId,
                    type: checkType,
                    NOT: { id },
                },
            });

            if (duplicate) {
                throw new ConflictError(`Category "${checkName}" already exists for type ${checkType}`);
            }
        }

        return prisma.category.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.type && { type: data.type as CategoryType }),
            },
            select: {
                id: true,
                name: true,
                type: true,
                updatedAt: true,
            },
        });
    }

    // ── Delete ──────────────────────────────────────────────────────────────

    static async delete(userId: number, id: number) {
        const category = await prisma.category.findFirst({
            where: { id, userId },
        });

        if (!category) {
            throw new NotFoundError('Category not found');
        }

        // Prevent deletion if category has transactions
        const transactionCount = await prisma.transaction.count({
            where: { categoryId: id },
        });

        if (transactionCount > 0) {
            throw new ValidationError(
                `Cannot delete category with ${transactionCount} transaction(s). Remove transactions first.`,
            );
        }

        // Check for budgets too
        const budgetCount = await prisma.budget.count({
            where: { categoryId: id },
        });

        if (budgetCount > 0) {
            throw new ValidationError(
                `Cannot delete category with ${budgetCount} budget(s). Remove budgets first.`,
            );
        }

        await prisma.category.delete({ where: { id } });
    }
}

export default CategoryService;
