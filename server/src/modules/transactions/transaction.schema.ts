import { z } from 'zod';

// ─── Create Transaction Schema ─────────────────────────────────────────────

export const createTransactionSchema = z.object({
    title: z
        .string({ required_error: 'Title is required' })
        .trim()
        .min(1, 'Title is required')
        .max(255, 'Title must be at most 255 characters'),
    amount: z
        .number({ required_error: 'Amount is required' })
        .positive('Amount must be a positive number'),
    type: z.enum(['INCOME', 'EXPENSE'], {
        required_error: 'Transaction type is required',
        invalid_type_error: 'Type must be INCOME or EXPENSE',
    }),
    date: z
        .string({ required_error: 'Date is required' })
        .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
    note: z.string().max(1000, 'Note must be at most 1000 characters').optional().nullable(),
    categoryId: z
        .number({ required_error: 'Category ID is required' })
        .int()
        .positive('Category ID must be a positive integer'),
});

// ─── Update Transaction Schema ─────────────────────────────────────────────

export const updateTransactionSchema = z.object({
    title: z.string().trim().min(1).max(255).optional(),
    amount: z.number().positive().optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    date: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')
        .optional(),
    note: z.string().max(1000).optional().nullable(),
    categoryId: z.number().int().positive().optional(),
});

// ─── Query Schema (for filtering/sorting/pagination) ───────────────────────

export const transactionQuerySchema = z.object({
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    categoryId: z.coerce.number().int().positive().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    sortBy: z.enum(['date', 'amount', 'createdAt']).default('date'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

// ─── Inferred Types ────────────────────────────────────────────────────────

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionQueryInput = z.infer<typeof transactionQuerySchema>;
