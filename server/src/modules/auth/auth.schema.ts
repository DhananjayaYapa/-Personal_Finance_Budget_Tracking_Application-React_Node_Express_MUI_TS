import { z } from 'zod';

// ─── Register Schema ────────────────────────────────────────────────────────

export const registerSchema = z.object({
    name: z
        .string({ required_error: 'Name is required' })
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be at most 100 characters'),
    email: z
        .string({ required_error: 'Email is required' })
        .trim()
        .email('Please enter a valid email address')
        .toLowerCase(),
    password: z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password must be at least 6 characters')
        .regex(/\d/, 'Password must contain at least one number'),
});

// ─── Login Schema ───────────────────────────────────────────────────────────

export const loginSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .trim()
        .email('Please enter a valid email address')
        .toLowerCase(),
    password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

// ─── Update Profile Schema ──────────────────────────────────────────────────

export const updateProfileSchema = z.object({
    name: z
        .string({ required_error: 'Name is required' })
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be at most 100 characters'),
});

// ─── Change Password Schema ────────────────────────────────────────────────

export const changePasswordSchema = z.object({
    currentPassword: z
        .string({ required_error: 'Current password is required' })
        .min(1, 'Current password is required'),
    newPassword: z
        .string({ required_error: 'New password is required' })
        .min(6, 'New password must be at least 6 characters')
        .regex(/\d/, 'New password must contain at least one number'),
});

// ─── Inferred Types ────────────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
