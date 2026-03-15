import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from '../src/config/db.js';
import logger from '../src/config/logger.js';
import { SALT_ROUNDS } from '../src/shared/constants/index.js';

// ─── Seed Data ──────────────────────────────────────────────────────────────

const SEED_USER = {
  name: 'Rohan Perera',
  email: 'rohan@gmail.com',
  password: 'Rohan1',
};

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Housing & Rent',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
];

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Other Income'];

// ─── Helper: Random Amount ──────────────────────────────────────────────────

function randomAmount(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

// ─── Helper: Random Date in Range ───────────────────────────────────────────

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// ─── Main Seed Function ─────────────────────────────────────────────────────

async function seed() {
  logger.info('🌱 Starting database seed...');

  // ── 1. Clean existing data (in order due to foreign keys) ──────────────

  logger.info('Cleaning existing data...');
  await prisma.budget.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // ── 2. Create demo user ────────────────────────────────────────────────

  logger.info('Creating demo user...');
  const passwordHash = await bcrypt.hash(SEED_USER.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: SEED_USER.name,
      email: SEED_USER.email,
      passwordHash,
    },
  });

  logger.info(`✅ User created: ${user.email} (ID: ${user.id})`);

  // ── 3. Create categories ───────────────────────────────────────────────

  logger.info('Creating categories...');

  const expenseCategories = await Promise.all(
    EXPENSE_CATEGORIES.map((name) =>
      prisma.category.create({
        data: { name, type: 'EXPENSE', userId: user.id },
      }),
    ),
  );

  const incomeCategories = await Promise.all(
    INCOME_CATEGORIES.map((name) =>
      prisma.category.create({
        data: { name, type: 'INCOME', userId: user.id },
      }),
    ),
  );

  logger.info(
    `✅ Categories created: ${expenseCategories.length} expense, ${incomeCategories.length} income`,
  );

  // ── 4. Create transactions (3 months of data) ─────────────────────────

  logger.info('Creating transactions...');

  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

  // Expense transactions
  const expenseTransactions = [
    { title: 'Grocery Shopping', categoryName: 'Food & Dining', min: 30, max: 150 },
    { title: 'Restaurant Dinner', categoryName: 'Food & Dining', min: 20, max: 80 },
    { title: 'Fuel', categoryName: 'Transportation', min: 40, max: 100 },
    { title: 'Bus Pass', categoryName: 'Transportation', min: 50, max: 80 },
    { title: 'Monthly Rent', categoryName: 'Housing & Rent', min: 1000, max: 1500 },
    { title: 'Electricity Bill', categoryName: 'Utilities', min: 50, max: 120 },
    { title: 'Water Bill', categoryName: 'Utilities', min: 20, max: 50 },
    { title: 'Internet', categoryName: 'Utilities', min: 40, max: 70 },
    { title: 'Movie Tickets', categoryName: 'Entertainment', min: 15, max: 40 },
    { title: 'Streaming Subscription', categoryName: 'Entertainment', min: 10, max: 30 },
    { title: 'Doctor Visit', categoryName: 'Healthcare', min: 50, max: 200 },
    { title: 'Pharmacy', categoryName: 'Healthcare', min: 10, max: 50 },
    { title: 'Clothing', categoryName: 'Shopping', min: 30, max: 200 },
    { title: 'Online Course', categoryName: 'Education', min: 20, max: 100 },
  ];

  // Income transactions
  const incomeTransactions = [
    { title: 'Monthly Salary', categoryName: 'Salary', min: 4000, max: 5000 },
    { title: 'Freelance Project', categoryName: 'Freelance', min: 300, max: 1500 },
    { title: 'Dividend Income', categoryName: 'Investments', min: 50, max: 300 },
    { title: 'Side Gig', categoryName: 'Other Income', min: 100, max: 500 },
  ];

  const categoryMap = new Map(
    [...expenseCategories, ...incomeCategories].map((c) => [c.name, c.id]),
  );

  let totalTransactions = 0;

  // Create multiple expense transactions spread across 3 months
  for (const tx of expenseTransactions) {
    const count = Math.floor(Math.random() * 3) + 1; // 1-3 transactions each
    for (let i = 0; i < count; i++) {
      await prisma.transaction.create({
        data: {
          title: tx.title,
          amount: randomAmount(tx.min, tx.max),
          type: 'EXPENSE',
          date: randomDate(threeMonthsAgo, now),
          note: i === 0 ? `Seed data: ${tx.title}` : null,
          userId: user.id,
          categoryId: categoryMap.get(tx.categoryName)!,
        },
      });
      totalTransactions++;
    }
  }

  // Create income transactions (1-2 per type per month)
  for (const tx of incomeTransactions) {
    const count = tx.categoryName === 'Salary' ? 3 : Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < count; i++) {
      await prisma.transaction.create({
        data: {
          title: tx.title,
          amount: randomAmount(tx.min, tx.max),
          type: 'INCOME',
          date: randomDate(threeMonthsAgo, now),
          note: null,
          userId: user.id,
          categoryId: categoryMap.get(tx.categoryName)!,
        },
      });
      totalTransactions++;
    }
  }

  logger.info(`✅ Transactions created: ${totalTransactions}`);

  // ── 5. Create budgets (current month) ──────────────────────────────────

  logger.info('Creating budgets for current month...');

  const budgetData = [
    { categoryName: 'Food & Dining', amount: 500 },
    { categoryName: 'Transportation', amount: 200 },
    { categoryName: 'Housing & Rent', amount: 1500 },
    { categoryName: 'Utilities', amount: 200 },
    { categoryName: 'Entertainment', amount: 100 },
    { categoryName: 'Healthcare', amount: 150 },
    { categoryName: 'Shopping', amount: 300 },
    { categoryName: 'Education', amount: 100 },
  ];

  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  for (const b of budgetData) {
    await prisma.budget.create({
      data: {
        amount: b.amount,
        month: currentMonth,
        year: currentYear,
        userId: user.id,
        categoryId: categoryMap.get(b.categoryName)!,
      },
    });
  }

  logger.info(`✅ Budgets created: ${budgetData.length} for ${currentMonth}/${currentYear}`);

  // ── Summary ────────────────────────────────────────────────────────────

  logger.info('='.repeat(50));
  logger.info('🎉 Seed completed successfully!');
  logger.info('='.repeat(50));
  logger.info(`  User:         ${SEED_USER.email} / ${SEED_USER.password}`);
  logger.info(`  Categories:   ${expenseCategories.length + incomeCategories.length}`);
  logger.info(`  Transactions: ${totalTransactions}`);
  logger.info(`  Budgets:      ${budgetData.length}`);
  logger.info('='.repeat(50));
}

// ─── Run ────────────────────────────────────────────────────────────────────

seed()
  .catch((error) => {
    logger.error(error, 'Seed failed');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
