import prisma from '../../config/db.js';
import { NotFoundError, ValidationError } from '../../middleware/errorHandler.js';
import type {
    CreateTransactionInput,
    UpdateTransactionInput,
    TransactionQueryInput,
} from './transaction.schema.js';
import type { TransactionType, Transaction, Category } from '../../generated/prisma/client.js';

// ─── Types ──────────────────────────────────────────────────────────────────

interface BudgetWarning {
    message: string;
    budgetAmount: number;
    totalSpent: number;
    percentageUsed: number;
    categoryName: string;
}

interface CreateTransactionResult {
    transaction: Transaction & { category: Pick<Category, 'id' | 'name' | 'type'> | null };
    budgetWarning?: BudgetWarning;
}

// ─── Transaction Service ────────────────────────────────────────────────────

class TransactionService {
    // ── Create ──────────────────────────────────────────────────────────────

    static async create(userId: number, data: CreateTransactionInput): Promise<CreateTransactionResult> {
        // Validate category belongs to user and matches transaction type
        const category = await prisma.category.findFirst({
            where: { id: data.categoryId, userId },
        });

        if (!category) {
            throw new NotFoundError('Category not found');
        }

        if (category.type !== data.type) {
            throw new ValidationError(
                `Category "${category.name}" is of type ${category.type}, but transaction type is ${data.type}`,
            );
        }

        const transaction = await prisma.transaction.create({
            data: {
                title: data.title,
                amount: data.amount,
                type: data.type as TransactionType,
                date: new Date(data.date),
                note: data.note || null,
                userId,
                categoryId: data.categoryId,
            },
            include: {
                category: { select: { id: true, name: true, type: true } },
            },
        });

        // Check budget warning for EXPENSE transactions
        let budgetWarning: BudgetWarning | undefined;
        if (data.type === 'EXPENSE') {
            const transactionDate = new Date(data.date);
            const month = transactionDate.getMonth() + 1; // 1-12
            const year = transactionDate.getFullYear();

            // Find budget for this category/month/year
            const budget = await prisma.budget.findFirst({
                where: {
                    userId,
                    categoryId: data.categoryId,
                    month,
                    year,
                },
            });

            if (budget) {
                // Calculate total spent for this category in this month/year
                const startOfMonth = new Date(year, month - 1, 1);
                const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

                const totalSpentResult = await prisma.transaction.aggregate({
                    where: {
                        userId,
                        categoryId: data.categoryId,
                        type: 'EXPENSE',
                        date: {
                            gte: startOfMonth,
                            lte: endOfMonth,
                        },
                    },
                    _sum: {
                        amount: true,
                    },
                });

                const totalSpent = Number(totalSpentResult._sum.amount || 0);
                const budgetAmount = Number(budget.amount);
                const percentageUsed = budgetAmount > 0 ? (totalSpent / budgetAmount) * 100 : 0;

                if (totalSpent > budgetAmount) {
                    budgetWarning = {
                        message: `Budget exceeded for "${category.name}"! You've spent ${percentageUsed.toFixed(1)}% of your budget.`,
                        budgetAmount,
                        totalSpent,
                        percentageUsed,
                        categoryName: category.name,
                    };
                }
            }
        }

        return { transaction, budgetWarning };
    }

    // ── Get All (with filters + pagination) ─────────────────────────────────

    static async getAll(userId: number, query: TransactionQueryInput) {
        const { type, categoryId, startDate, endDate, sortBy, sortOrder, page, limit } = query;

        // Build where clause dynamically
        const where: Record<string, unknown> = { userId };

        if (type) where.type = type;
        if (categoryId) where.categoryId = categoryId;

        if (startDate || endDate) {
            const dateFilter: Record<string, Date> = {};
            if (startDate) dateFilter.gte = new Date(startDate);
            if (endDate) dateFilter.lte = new Date(endDate);
            where.date = dateFilter;
        }

        const skip = (page - 1) * limit;

        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                where,
                include: {
                    category: { select: { id: true, name: true, type: true } },
                },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            prisma.transaction.count({ where }),
        ]);

        return {
            transactions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // ── Get By ID ───────────────────────────────────────────────────────────

    static async getById(userId: number, id: number) {
        const transaction = await prisma.transaction.findFirst({
            where: { id, userId },
            include: {
                category: { select: { id: true, name: true, type: true } },
            },
        });

        if (!transaction) {
            throw new NotFoundError('Transaction not found');
        }

        return transaction;
    }

    // ── Update ──────────────────────────────────────────────────────────────

    static async update(userId: number, id: number, data: UpdateTransactionInput) {
        const transaction = await prisma.transaction.findFirst({
            where: { id, userId },
        });

        if (!transaction) {
            throw new NotFoundError('Transaction not found');
        }

        // If categoryId is being changed, validate it
        if (data.categoryId) {
            const category = await prisma.category.findFirst({
                where: { id: data.categoryId, userId },
            });

            if (!category) {
                throw new NotFoundError('Category not found');
            }

            const txType = data.type || transaction.type;
            if (category.type !== txType) {
                throw new ValidationError(
                    `Category "${category.name}" is of type ${category.type}, but transaction type is ${txType}`,
                );
            }
        }

        return prisma.transaction.update({
            where: { id },
            data: {
                ...(data.title && { title: data.title }),
                ...(data.amount !== undefined && { amount: data.amount }),
                ...(data.type && { type: data.type as TransactionType }),
                ...(data.date && { date: new Date(data.date) }),
                ...(data.note !== undefined && { note: data.note }),
                ...(data.categoryId && { categoryId: data.categoryId }),
            },
            include: {
                category: { select: { id: true, name: true, type: true } },
            },
        });
    }

    // ── Delete ──────────────────────────────────────────────────────────────

    static async delete(userId: number, id: number) {
        const transaction = await prisma.transaction.findFirst({
            where: { id, userId },
        });

        if (!transaction) {
            throw new NotFoundError('Transaction not found');
        }

        await prisma.transaction.delete({ where: { id } });
    }

    // ── Get For Export (no pagination — returns all matching) ────────────────

    static async getForExport(userId: number, query: TransactionQueryInput) {
        const { type, categoryId, startDate, endDate, sortBy, sortOrder } = query;

        const where: Record<string, unknown> = { userId };

        if (type) where.type = type;
        if (categoryId) where.categoryId = categoryId;

        if (startDate || endDate) {
            const dateFilter: Record<string, Date> = {};
            if (startDate) dateFilter.gte = new Date(startDate);
            if (endDate) dateFilter.lte = new Date(endDate);
            where.date = dateFilter;
        }

        const transactions = await prisma.transaction.findMany({
            where,
            include: {
                category: { select: { name: true } },
            },
            orderBy: { [sortBy]: sortOrder },
        });

        // Format for export (flatten category name)
        return transactions.map((t) => ({
            id: t.id,
            title: t.title,
            amount: t.amount.toString(),
            type: t.type,
            category: t.category.name,
            date: t.date.toISOString().split('T')[0],
            note: t.note,
            createdAt: t.createdAt.toISOString(),
        }));
    }
}

export default TransactionService;
