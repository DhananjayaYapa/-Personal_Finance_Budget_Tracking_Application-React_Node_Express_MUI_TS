import prisma from '../../config/db.js';
import { ConflictError, NotFoundError, ValidationError } from '../../middleware/errorHandler.js';
import type {
    CreateBudgetInput,
    UpdateBudgetInput,
    BudgetQueryInput,
    BudgetProgressQueryInput,
    BudgetExportQueryInput,
    BudgetAllProgressQueryInput,
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

    // ── Get All Progress (fetch all budgets with spending in one call) ──────

    static async getAllProgress(userId: number, query: BudgetAllProgressQueryInput) {
        const { startMonth, startYear, endMonth, endYear } = query;

        // Get all budgets for the user
        const budgets = await prisma.budget.findMany({
            where: { userId },
            include: {
                category: { select: { id: true, name: true, type: true } },
            },
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
        });

        if (budgets.length === 0) {
            return [];
        }

        // Filter by date range if provided
        let filteredBudgets = budgets;
        if (startMonth && startYear && endMonth && endYear) {
            filteredBudgets = budgets.filter((b) => {
                const budgetDate = b.year * 12 + b.month;
                const start = startYear * 12 + startMonth;
                const end = endYear * 12 + endMonth;
                return budgetDate >= start && budgetDate <= end;
            });
        }

        if (filteredBudgets.length === 0) {
            return [];
        }

        // Group budgets by month/year to optimize spending queries
        const monthYearGroups = new Map<string, typeof filteredBudgets>();
        filteredBudgets.forEach((budget) => {
            const key = `${budget.year}-${budget.month}`;
            if (!monthYearGroups.has(key)) {
                monthYearGroups.set(key, []);
            }
            monthYearGroups.get(key)!.push(budget);
        });

        // Fetch spending for each month/year group in parallel
        const progressResults = await Promise.all(
            Array.from(monthYearGroups.entries()).map(async ([key, budgetsInMonth]) => {
                const [yearStr, monthStr] = key.split('-');
                const year = parseInt(yearStr, 10);
                const month = parseInt(monthStr, 10);

                // Get start and end dates for the month
                const startDate = new Date(year, month - 1, 1);
                const endDate = new Date(year, month, 0, 23, 59, 59);

                // Get spending for all categories in this month
                const spending = await prisma.transaction.groupBy({
                    by: ['categoryId'],
                    where: {
                        userId,
                        type: 'EXPENSE',
                        date: { gte: startDate, lte: endDate },
                        categoryId: { in: budgetsInMonth.map((b) => b.categoryId) },
                    },
                    _sum: { amount: true },
                });

                // Build spending map
                const spendingMap = new Map(
                    spending.map((s) => [s.categoryId, Number(s._sum.amount ?? 0)]),
                );

                // Map budgets to progress data
                return budgetsInMonth.map((budget) => {
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
            }),
        );

        // Flatten results and sort by year desc, month desc
        return progressResults.flat().sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year;
            return b.month - a.month;
        });
    }

    // ── Get For Export ──────────────────────────────────────────────────────

    static async getForExport(userId: number, query: BudgetExportQueryInput) {
        const { startMonth, startYear, endMonth, endYear, categoryId } = query;

        // Build where clause
        const where: Record<string, unknown> = { userId };

        if (categoryId) {
            where.categoryId = categoryId;
        }

        // Get all budgets with optional filters
        const budgets = await prisma.budget.findMany({
            where,
            include: {
                category: { select: { id: true, name: true, type: true } },
            },
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
        });

        // Filter by date range if provided
        let filteredBudgets = budgets;
        if (startMonth && startYear && endMonth && endYear) {
            filteredBudgets = budgets.filter((b) => {
                const budgetDate = b.year * 12 + b.month;
                const startDate = startYear * 12 + startMonth;
                const endDate = endYear * 12 + endMonth;
                return budgetDate >= startDate && budgetDate <= endDate;
            });
        }

        // Get spending data for all budgets
        const exportData = await Promise.all(
            filteredBudgets.map(async (budget) => {
                // Get start and end dates for the month
                const monthStartDate = new Date(budget.year, budget.month - 1, 1);
                const monthEndDate = new Date(budget.year, budget.month, 0, 23, 59, 59);

                // Get spending for this budget's category in its month
                const spending = await prisma.transaction.aggregate({
                    where: {
                        userId,
                        categoryId: budget.categoryId,
                        type: 'EXPENSE',
                        date: { gte: monthStartDate, lte: monthEndDate },
                    },
                    _sum: { amount: true },
                });

                const budgetAmount = Number(budget.amount);
                const spentAmount = Number(spending._sum.amount || 0);
                const remaining = budgetAmount - spentAmount;
                const percentageUsed = budgetAmount > 0 ? Math.round((spentAmount / budgetAmount) * 100) : 0;

                return {
                    id: budget.id,
                    category: budget.category?.name || 'Unknown',
                    amount: budgetAmount,
                    month: budget.month,
                    year: budget.year.toString(),
                    spentAmount,
                    remaining,
                    percentageUsed,
                    status: spentAmount > budgetAmount ? 'Over Budget' : spentAmount >= budgetAmount * 0.8 ? 'Near Limit' : 'On Track',
                    createdAt: budget.createdAt,
                };
            }),
        );

        return exportData;
    }
}

export default BudgetService;
