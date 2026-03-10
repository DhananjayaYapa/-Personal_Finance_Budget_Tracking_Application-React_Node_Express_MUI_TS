import express from 'express';
import TransactionController from './transaction.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import {
    createTransactionSchema,
    updateTransactionSchema,
    transactionQuerySchema,
} from './transaction.schema.js';

const router = express.Router();

// All transaction routes require authentication
router.use(authenticate);

// ─── Export Routes (must be defined BEFORE /:id to avoid conflict) ──────────

/**
 * @swagger
 * /api/v1/transactions/export/csv:
 *   get:
 *     summary: Export transactions as CSV
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-12-31"
 *     responses:
 *       200:
 *         description: CSV file
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
router.get(
    '/export/csv',
    validate({ query: transactionQuerySchema }),
    asyncHandler(TransactionController.exportCSV),
);

/**
 * @swagger
 * /api/v1/transactions/export/json:
 *   get:
 *     summary: Export transactions as JSON
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: JSON export file
 */
router.get(
    '/export/json',
    validate({ query: transactionQuerySchema }),
    asyncHandler(TransactionController.exportJSON),
);

// ─── CRUD Routes ────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, amount, type, date, categoryId]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Grocery Shopping
 *               amount:
 *                 type: number
 *                 example: 45.50
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *                 example: EXPENSE
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-03-08"
 *               note:
 *                 type: string
 *                 example: Weekly groceries
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Validation error or category type mismatch
 *       404:
 *         description: Category not found
 */
router.post(
    '/',
    validate({ body: createTransactionSchema }),
    asyncHandler(TransactionController.create),
);

/**
 * @swagger
 * /api/v1/transactions:
 *   get:
 *     summary: Get all transactions with optional filters
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *         description: Filter by transaction type
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (inclusive)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (inclusive)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, amount, createdAt]
 *           default: date
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Transactions retrieved with pagination
 */
router.get(
    '/',
    validate({ query: transactionQuerySchema }),
    asyncHandler(TransactionController.getAll),
);

/**
 * @swagger
 * /api/v1/transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction retrieved successfully
 *       404:
 *         description: Transaction not found
 */
router.get('/:id', asyncHandler(TransactionController.getById));

/**
 * @swagger
 * /api/v1/transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               date:
 *                 type: string
 *                 format: date
 *               note:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       404:
 *         description: Transaction not found
 */
router.put(
    '/:id',
    validate({ body: updateTransactionSchema }),
    asyncHandler(TransactionController.update),
);

/**
 * @swagger
 * /api/v1/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       404:
 *         description: Transaction not found
 */
router.delete('/:id', asyncHandler(TransactionController.delete));

export default router;
