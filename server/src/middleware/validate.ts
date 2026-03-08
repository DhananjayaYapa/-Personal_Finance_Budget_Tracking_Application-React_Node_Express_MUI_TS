import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from './errorHandler.js';

// ─── Validation Schema Configuration ────────────────────────────────────────

interface ValidateSchemas {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}

// ─── Zod Validation Middleware ──────────────────────────────────────────────

export const validate = (schemas: ValidateSchemas) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            if (schemas.body) {
                req.body = schemas.body.parse(req.body);
            }
            if (schemas.query) {
                req.query = schemas.query.parse(req.query);
            }
            if (schemas.params) {
                req.params = schemas.params.parse(req.params);
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                    value: undefined,
                }));
                next(new ValidationError('Validation failed', formattedErrors));
            } else {
                next(error);
            }
        }
    };
};
