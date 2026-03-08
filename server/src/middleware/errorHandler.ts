import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../shared/utils/responseHelper.js';
import logger from '../config/logger.js';

// ─── Custom Error Classes ────────────────────────────────────────────────────

export class ApiError extends Error {
    public statusCode: number;
    public isOperational: boolean;
    public errors: unknown[] | null;

    constructor(message: string, statusCode = 500, errors: unknown[] | null = null) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends ApiError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

export class ValidationError extends ApiError {
    constructor(message = 'Validation failed', errors: unknown[] | null = null) {
        super(message, 400, errors);
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message = 'Unauthorized access') {
        super(message, 401);
    }
}

export class ConflictError extends ApiError {
    constructor(message = 'Resource already exists') {
        super(message, 409);
    }
}

// ─── Error Handler Middleware ────────────────────────────────────────────────

export const errorHandler = (
    err: Error | ApiError,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    logger.error({ err }, err.message);

    // Default error values
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errors: unknown[] | null = null;

    // Handle custom API errors
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token has expired';
    }

    // Handle Prisma errors (duck-type check)
    const errWithCode = err as Error & { code?: string };
    if (errWithCode.code) {
        switch (errWithCode.code) {
            case 'P2002':
                statusCode = 409;
                message = 'Duplicate entry — resource already exists';
                break;
            case 'P2025':
                statusCode = 404;
                message = 'Record not found';
                break;
            case 'P2003':
                statusCode = 400;
                message = 'Foreign key constraint failed';
                break;
        }
    }

    // In production, don't expose internal error details
    if (process.env.NODE_ENV === 'production' && !(err instanceof ApiError)) {
        message = 'An unexpected error occurred';
        errors = null;
    }

    return errorResponse(res, message, statusCode, errors);
};

// ─── 404 Not Found Handler ──────────────────────────────────────────────────

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction) => {
    return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

// ─── Async Handler Wrapper ──────────────────────────────────────────────────

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
