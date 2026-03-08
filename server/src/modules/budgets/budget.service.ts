import prisma from '../../config/db.js';
import { ConflictError, NotFoundError, ValidationError } from '../../middleware/errorHandler.js';
import type {
    CreateBudgetInput,
    UpdateBudgetInput,
    BudgetQueryInput,
    BudgetProgressQueryInput,
} from './budget.schema.js';

// ─── Budget Service ─────────────────────────────────────────────────────────

class BudgetService {
    // ── Create ──────────────────────────────────────────────────────────────

    static async create(userId: number, data: CreateBudgetInput) {
        // Validate category belongs to user and is EXPENSE type
        const category = await prisma.category.findFirst({
            where: { id: data.categoryId, userId },
        });

        if (!category) {
            throw new NotFoundError('Category not found');
        }

        if (category.type !== 'EXPENSE') {
            throw new ValidationError('Budgets can only be created for EXPENSE categories');
        }

        // Check for existing budget (unique constraint: userId + categoryId + month + year)
        const existing = await prisma.budget.findFirst({
            where: {
                userId,
                categoryId: data.categoryId,
                month: data.month,
                year: data.year,
            },
        });

        if (existing) {
            throw new ConflictError(
                `Budget already exists for category "${category.name}" in ${data.month}/${data.year}`,
            );
        }

        return prisma.budget.create({
            data: {
                amount: data.amount,
                month: data.month,
                year: data.year,
                userId,
                categoryId: data.categoryId,
            },
            include: {
                category: { select: { id: true, name: true, type: true } },
            },
        });
    }

    // ── Get All ─────────────────────────────────────────────────────────────

    static async getAll(userId: number, query: BudgetQueryInput) {
        const where: Record<string, unknown> = { userId };

        if (query.month) where.month = query.month;
        if (query.year) where.year = query.year;

        return prisma.budget.findMany({
            where,
            include: {
                category: { select: { id: true, name: true, type: true } },
            },
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
        });
    }

    // ── Get By ID ───────────────────────────────────────────────────────────

    static async getById(userId: number, id: number) {
        const budget = await prisma.budget.findFirst({
            where: { id, userId },
            include: {
                category: { select: { id: true, name: true, type: true } },
            },
        });

        if (!budget) {
            throw new NotFoundError('Budget not found');
        }

        return budget;
    }

    // ── Update ──────────────────────────────────────────────────────────────

    static async update(userId: number, id: number, data: UpdateBudgetInput) {
        const budget = await prisma.budget.findFirst({
            where: { id, userId },
        });

        if (!budget) {
            throw new NotFoundError('Budget not found');
        }

        return prisma.budget.update({
            where: { id },
            data: { amount: data.amount },
            include: {
                category: { select: { id: true, name: true, type: true } },
            },
        });
    }

    // ── Delete ──────────────────────────────────────────────────────────────

    static async delete(userId: number, id: number) {
        const budget = await prisma.budget.findFirst({
            where: { id, userId },
        });

        if (!budget) {
            throw new NotFoundError('Budget not found');
        }

        await prisma.budget.delete({ where: { id } });
    }

    // ── Get Progress (Budget vs Actual Spending) ────────────────────────────

    static async getProgress(userId: number, query: BudgetProgressQueryInput) {
        const { month, year } = query;

        // Get all budgets for the given month/year
        const budgets = await prisma.budget.findMany({
            where: { userId, month, year },
            include: {
                category: { select: { id: true, name: true, type: true } },
            },
        });

        if (budgets.length === 0) {
            return [];
        }

        // Get start and end dates for the month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59); // Last day of month

        // Aggregate actual spending per category
        const spending = await prisma.transaction.groupBy({
            by: ['categoryId'],
            where: {
                userId,
                type: 'EXPENSE',
                date: { gte: startDate, lte: endDate },
                categoryId: { in: budgets.map((b) => b.categoryId) },
            },
            _sum: { amount: true },
        });

        // Build spending map
        const spendingMap = new Map(
            spending.map((s) => [s.categoryId, Number(s._sum.amount ?? 0)]),
        );

        // Combine budgets with spending data
        return budgets.map((budget) => {
            const budgetAmount = Number(budget.amount);
            const spentAmount = spendingMap.get(budget.categoryId) || 0;
            const remaining = budgetAmount - spentAmount;
            const percentageUsed = budgetAmount > 0 ? Math.round((spentAmount / budgetAmount) * 100) : 0;

            return {
                budgetId: budget.id,
                category: budget.category,
                budgetAmount,
                spentAmount,
                remaining,
                percentageUsed,
                exceeded: spentAmount > budgetAmount,
                month,
                year,
            };
        });
    }
}

export default BudgetService;
