// API Routes - matching backend endpoints
export const API_ROUTES = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/auth/change-password',

  // Categories
  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id: string) => `/categories/${id}`,

  // Transactions
  TRANSACTIONS: '/transactions',
  TRANSACTION_BY_ID: (id: string) => `/transactions/${id}`,
  EXPORT_CSV: '/transactions/export/csv',
  EXPORT_JSON: '/transactions/export/json',

  // Budgets
  BUDGETS: '/budgets',
  BUDGET_BY_ID: (id: string) => `/budgets/${id}`,
  BUDGET_PROGRESS: '/budgets/progress',
  BUDGET_PROGRESS_ALL: '/budgets/progress/all',
  BUDGET_EXPORT_CSV: '/budgets/export/csv',
  BUDGET_EXPORT_JSON: '/budgets/export/json',
}

// Application Routes
export const APP_ROUTES = {
  // Public
  LOGIN: '/login',
  REGISTER: '/register',

  // Private
  DASHBOARD: '/',
  TRANSACTIONS: '/transactions',
  CATEGORIES: '/categories',
  BUDGETS: '/budgets',
  REPORTS: '/reports',
  PROFILE: '/profile',
}
