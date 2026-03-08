import { z } from 'zod';

// ─── Create Category Schema ────────────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z
    .string({ required_error: 'Category name is required' })
    .trim()
    .min(1, 'Category name is required')
    .max(100, 'Category name must be at most 100 characters'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    required_error: 'Category type is required',
    invalid_type_error: 'Type must be INCOME or EXPENSE',
  }),
});

// ─── Update Category Schema ────────────────────────────────────────────────

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
});

// ─── Query Schema ──────────────────────────────────────────────────────────

export const categoryQuerySchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
});

// ─── Inferred Types ────────────────────────────────────────────────────────

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryQueryInput = z.infer<typeof categoryQuerySchema>;
