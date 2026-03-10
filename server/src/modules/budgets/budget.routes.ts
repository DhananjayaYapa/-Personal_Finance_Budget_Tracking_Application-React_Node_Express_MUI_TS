import express from 'express';
import BudgetController from './budget.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import {
    createBudgetSchema,
    updateBudgetSchema,
    budgetQuerySchema,
    budgetProgressQuerySchema,
    budgetExportQuerySchema,
    budgetAllProgressQuerySchema,
} from './budget.schema.js';

const router = express.Router();

// All budget routes require authentication
router.use(authenticate);

// ─── Progress Route (must be defined BEFORE /:id) ───────────────────────────

/**
 * @swagger
 * /api/v1/budgets/progress:
 *   get:
 *     summary: Get budget vs actual spending progress
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month (1-12)
 *         example: 3
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year
 *         example: 2026
 *     responses:
 *       200:
 *         description: Budget progress data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       budgetId:
 *                         type: integer
 *                       category:
 *                         type: object
 *                       budgetAmount:
 *                         type: number
 *                       spentAmount:
 *                         type: number
 *                       remaining:
 *                         type: number
 *                       percentageUsed:
 *                         type: integer
 *                       exceeded:
 *                         type: boolean
 */
router.get(
    '/progress',
    validate({ query: budgetProgressQuerySchema }),
    asyncHandler(BudgetController.getProgress),
);

/**
 * @swagger
 * /api/v1/budgets/progress/all:
 *   get:
 *     summary: Get all budget progress data in a single call
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startMonth
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Start month (optional)
 *       - in: query
 *         name: startYear
 *         schema:
 *           type: integer
 *         description: Start year (optional)
 *       - in: query
 *         name: endMonth
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: End month (optional)
 *       - in: query
 *         name: endYear
 *         schema:
 *           type: integer
 *         description: End year (optional)
 *     responses:
 *       200:
 *         description: All budget progress data
 */
router.get(
    '/progress/all',
    validate({ query: budgetAllProgressQuerySchema }),
    asyncHandler(BudgetController.getAllProgress),
);

// ─── CRUD Routes ────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/budgets:
 *   post:
 *     summary: Create a budget for a category
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, month, year, categoryId]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 500
 *               month:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *                 example: 3
 *               year:
 *                 type: integer
 *                 example: 2026
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Budget created successfully
 *       400:
 *         description: Validation error or non-EXPENSE category
 *       404:
 *         description: Category not found
 *       409:
 *         description: Budget already exists for this category/month/year
 */
router.post(
    '/',
    validate({ body: createBudgetSchema }),
    asyncHandler(BudgetController.create),
);

/**
 * @swagger
 * /api/v1/budgets:
 *   get:
 *     summary: Get all budgets with optional filters
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Budgets retrieved successfully
 */
router.get(
    '/',
    validate({ query: budgetQuerySchema }),
    asyncHandler(BudgetController.getAll),
);

/**
 * @swagger
 * /api/v1/budgets/{id}:
 *   get:
 *     summary: Get a budget by ID
 *     tags: [Budgets]
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
 *         description: Budget retrieved successfully
 *       404:
 *         description: Budget not found
 */

// ─── Export Routes (must be before /:id) ────────────────────────────────────

/**
 * @swagger
 * /api/v1/budgets/export/csv:
 *   get:
 *     summary: Export budgets to CSV
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startMonth
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *       - in: query
 *         name: startYear
 *         schema:
 *           type: integer
 *       - in: query
 *         name: endMonth
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *       - in: query
 *         name: endYear
 *         schema:
 *           type: integer
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
router.get(
    '/export/csv',
    validate({ query: budgetExportQuerySchema }),
    asyncHandler(BudgetController.exportCSV),
);

/**
 * @swagger
 * /api/v1/budgets/export/json:
 *   get:
 *     summary: Export budgets to JSON
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startMonth
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *       - in: query
 *         name: startYear
 *         schema:
 *           type: integer
 *       - in: query
 *         name: endMonth
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *       - in: query
 *         name: endYear
 *         schema:
 *           type: integer
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: JSON file download
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get(
    '/export/json',
    validate({ query: budgetExportQuerySchema }),
    asyncHandler(BudgetController.exportJSON),
);

router.get('/:id', asyncHandler(BudgetController.getById));

/**
 * @swagger
 * /api/v1/budgets/{id}:
 *   put:
 *     summary: Update a budget amount
 *     tags: [Budgets]
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
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 750
 *     responses:
 *       200:
 *         description: Budget updated successfully
 *       404:
 *         description: Budget not found
 */
router.put(
    '/:id',
    validate({ body: updateBudgetSchema }),
    asyncHandler(BudgetController.update),
);

/**
 * @swagger
 * /api/v1/budgets/{id}:
 *   delete:
 *     summary: Delete a budget
 *     tags: [Budgets]
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
 *         description: Budget deleted successfully
 *       404:
 *         description: Budget not found
 */
router.delete('/:id', asyncHandler(BudgetController.delete));

export default router;
