import express from 'express';
import AuthController from './auth.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import {
    registerSchema,
    loginSchema,
    updateProfileSchema,
    changePasswordSchema,
} from './auth.schema.js';

const router = express.Router();

// ─── Public Routes ──────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: Password1
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already registered
 */
router.post(
    '/register',
    validate({ body: registerSchema }),
    asyncHandler(AuthController.register),
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login and receive JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password1
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post(
    '/login',
    validate({ body: loginSchema }),
    asyncHandler(AuthController.login),
);

// ─── Protected Routes ───────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     summary: Get authenticated user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    '/profile',
    authenticate,
    asyncHandler(AuthController.getProfile),
);

/**
 * @swagger
 * /api/v1/auth/profile:
 *   put:
 *     summary: Update authenticated user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Jane Doe
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put(
    '/profile',
    authenticate,
    validate({ body: updateProfileSchema }),
    asyncHandler(AuthController.updateProfile),
);

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   put:
 *     summary: Change authenticated user's password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: Password1
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: NewPassword2
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Current password is incorrect
 *       401:
 *         description: Unauthorized
 */
router.put(
    '/change-password',
    authenticate,
    validate({ body: changePasswordSchema }),
    asyncHandler(AuthController.changePassword),
);

export default router;
