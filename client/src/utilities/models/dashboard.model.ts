import type { ActionState } from './core.model'
import type { Transaction } from './transaction.model'
import type { BudgetProgress } from './budget.model'

// Dashboard Summary
export interface DashboardSummary {
  totalIncome: number
  totalExpenses: number
  netBalance: number
  transactionCount: number
}

// Category Breakdown for charts
export interface CategoryBreakdown {
  categoryId: string
  categoryName: string
  type: string
  total: number
  percentage: number
}

// Monthly Trend for charts
export interface MonthlyTrend {
  month: string
  year: number
  income: number
  expenses: number
}

// Dashboard Data
export interface DashboardData {
  summary: DashboardSummary
  recentTransactions: Transaction[]
  categoryBreakdown: CategoryBreakdown[]
  monthlyTrends: MonthlyTrend[]
  budgetProgress: BudgetProgress[]
}

// Dashboard State for Redux
export interface DashboardStateDto extends ActionState {
  summary: DashboardSummary | null
  recentTransactions: Transaction[]
  categoryBreakdown: CategoryBreakdown[]
  monthlyTrends: MonthlyTrend[]
  budgetProgress: BudgetProgress[]
}

export const initialDashboardState: DashboardStateDto = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  summary: null,
  recentTransactions: [],
  categoryBreakdown: [],
  monthlyTrends: [],
  budgetProgress: [],
}
