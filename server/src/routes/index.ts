import express from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import categoryRoutes from '../modules/categories/category.routes.js';
import transactionRoutes from '../modules/transactions/transaction.routes.js';
import budgetRoutes from '../modules/budgets/budget.routes.js';

const router = express.Router();

// ─── Mount Module Routes ────────────────────────────────────────────────────

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/budgets', budgetRoutes);

// ─── Health Check ───────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is running
 */
router.get('/health', (_req, res) => {
    res.json({
        status: 'OK',
        message: 'Personal Finance Tracker API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
    });
});

export default router;
