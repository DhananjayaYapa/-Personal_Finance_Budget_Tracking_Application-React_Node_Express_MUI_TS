import bcrypt from 'bcryptjs';
import prisma from '../../config/db.js';
import { generateToken } from '../../middleware/auth.js';
import { SALT_ROUNDS } from '../../shared/constants/index.js';
import { ConflictError, NotFoundError, UnauthorizedError, ValidationError } from '../../middleware/errorHandler.js';
import type { RegisterInput, LoginInput, UpdateProfileInput, ChangePasswordInput } from './auth.schema.js';

// ─── Auth Service ───────────────────────────────────────────────────────────

class AuthService {
    // ── Register ────────────────────────────────────────────────────────────

    static async register(data: RegisterInput) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new ConflictError('Email already registered');
        }

        const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });

        const token = generateToken(user);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
            token,
        };
    }

    // ── Login ───────────────────────────────────────────────────────────────

    static async login(data: LoginInput) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            throw new UnauthorizedError('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid email or password');
        }
        const token = generateToken(user);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        };
    }

    // ── Get Profile ─────────────────────────────────────────────────────────

    static async getProfile(userId: number) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return user;
    }

    // ── Update Profile ──────────────────────────────────────────────────────

    static async updateProfile(userId: number, data: UpdateProfileInput) {
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });

        if (!existingUser) {
            throw new NotFoundError('User not found');
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { name: data.name },
            select: {
                id: true,
                name: true,
                email: true,
                updatedAt: true,
            },
        });

        return user;
    }
    // ── Change Password ─────────────────────────────────────────────────────

    static async changePassword(userId: number, data: ChangePasswordInput) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { passwordHash: true },
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        const isPasswordValid = await bcrypt.compare(data.currentPassword, user.passwordHash);

        if (!isPasswordValid) {
            throw new ValidationError('Current password is incorrect');
        }

        const passwordHash = await bcrypt.hash(data.newPassword, SALT_ROUNDS);

        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });
    }
}

export default AuthService;
