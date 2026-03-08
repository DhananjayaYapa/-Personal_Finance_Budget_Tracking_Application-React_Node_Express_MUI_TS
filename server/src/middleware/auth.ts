import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './errorHandler.js';

// ─── JWT Payload Interface ──────────────────────────────────────────────────

export interface JwtPayload {
    userId: number;
    email: string;
    name: string;
}

// ─── Authentication Middleware ──────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedError('No authorization token provided');
        }

        const parts = authHeader.split(' ');

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new UnauthorizedError('Invalid authorization header format. Use: Bearer <token>');
        }

        const token = parts[1];
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            name: decoded.name,
        };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new UnauthorizedError('Invalid token'));
        }
        if (error instanceof jwt.TokenExpiredError) {
            return next(new UnauthorizedError('Token has expired'));
        }
        next(error);
    }
};

// ─── Generate JWT Token ─────────────────────────────────────────────────────

export const generateToken = (user: { id: number; email: string; name: string }): string => {
    const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
    };

    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'],
    });
};
