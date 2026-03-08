import { z } from 'zod';

// ─── Create Budget Schema ──────────────────────────────────────────────────

export const createBudgetSchema = z.object({
    amount: z
        .number({ required_error: 'Budget amount is required' })
        .positive('Budget amount must be positive'),
    month: z
        .number({ required_error: 'Month is required' })
        .int()
        .min(1, 'Month must be between 1 and 12')
        .max(12, 'Month must be between 1 and 12'),
    year: z
        .number({ required_error: 'Year is required' })
        .int()
        .min(2000, 'Year must be 2000 or later')
        .max(2100, 'Year must be 2100 or earlier'),
    categoryId: z
        .number({ required_error: 'Category ID is required' })
        .int()
        .positive('Category ID must be a positive integer'),
});

// ─── Update Budget Schema ──────────────────────────────────────────────────

export const updateBudgetSchema = z.object({
    amount: z.number().positive('Budget amount must be positive'),
});

// ─── Query Schema ──────────────────────────────────────────────────────────

export const budgetQuerySchema = z.object({
    month: z.coerce.number().int().min(1).max(12).optional(),
    year: z.coerce.number().int().min(2000).max(2100).optional(),
});

// ─── Progress Query Schema (month + year required) ─────────────────────────

export const budgetProgressQuerySchema = z.object({
    month: z.coerce
        .number({ required_error: 'Month is required for progress' })
        .int()
        .min(1)
        .max(12),
    year: z.coerce
        .number({ required_error: 'Year is required for progress' })
        .int()
        .min(2000)
        .max(2100),
});

// ─── Inferred Types ────────────────────────────────────────────────────────

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export type BudgetQueryInput = z.infer<typeof budgetQuerySchema>;
export type BudgetProgressQueryInput = z.infer<typeof budgetProgressQuerySchema>;
