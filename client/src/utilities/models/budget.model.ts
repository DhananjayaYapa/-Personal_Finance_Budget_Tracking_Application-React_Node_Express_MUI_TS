import type { ActionState } from './core.model'
import type { Category } from './category.model'

// Budget Model
export interface Budget {
  id: string
  amount: number
  month: number
  year: number
  categoryId: string
  category: Category
  createdAt: string
  updatedAt: string
}

// Create Budget Request
export interface CreateBudgetRequestDto {
  amount: number
  month: number
  year: number
  categoryId: string
}

// Update Budget Request
export interface UpdateBudgetRequestDto {
  amount: number
}

// Budget Filter Params
export interface BudgetFilterParams {
  month?: number
  year?: number
  categoryId?: string
}

// Budget Progress Model
export interface BudgetProgress {
  budgetId: string
  category: Category
  budgetAmount: number
  spentAmount: number
  remaining: number
  percentageUsed: number
  exceeded: boolean
  month: number
  year: number
}

// Budget Progress Filter
export interface BudgetProgressFilterParams {
  month?: number
  year?: number
}

// Budget All Progress Filter (optional date range)
export interface BudgetAllProgressFilterParams {
  startMonth?: number
  startYear?: number
  endMonth?: number
  endYear?: number
}

// Budget Export Filter
export interface BudgetExportFilterParams {
  startMonth?: number
  startYear?: number
  endMonth?: number
  endYear?: number
  categoryId?: string
}

// ============================================
// CONTROLLED FORM DTOs (Athena Pattern)
// ============================================

// Budget Entry Form DTO (for Create)
export interface BudgetEntryFormDto {
  categoryId: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  amount: {
    value: number | string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  month: {
    value: number
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  year: {
    value: number
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
}

// Budget Edit Form DTO (for Update)
export interface BudgetEditFormDto {
  budgetId: {
    value: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  categoryId: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  amount: {
    value: number | string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  month: {
    value: number
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  year: {
    value: number
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
}

// Initial states for Budget forms
export const INITIAL_BUDGET_FORM_STATE = (
  currentMonth: number,
  currentYear: number
): BudgetEntryFormDto => ({
  categoryId: {
    value: '',
    validator: 'select',
    isRequired: true,
    error: null,
    disable: false,
  },
  amount: {
    value: '',
    validator: 'amount',
    isRequired: true,
    error: null,
    disable: false,
  },
  month: {
    value: currentMonth,
    validator: 'select',
    isRequired: true,
    error: null,
    disable: false,
  },
  year: {
    value: currentYear,
    validator: 'select',
    isRequired: true,
    error: null,
    disable: false,
  },
})

export const INITIAL_BUDGET_EDIT_STATE = (
  currentMonth: number,
  currentYear: number
): BudgetEditFormDto => ({
  budgetId: {
    value: '',
    isRequired: true,
    error: null,
    disable: false,
  },
  categoryId: {
    value: '',
    validator: 'select',
    isRequired: true,
    error: null,
    disable: false,
  },
  amount: {
    value: '',
    validator: 'amount',
    isRequired: true,
    error: null,
    disable: false,
  },
  month: {
    value: currentMonth,
    validator: 'select',
    isRequired: true,
    error: null,
    disable: false,
  },
  year: {
    value: currentYear,
    validator: 'select',
    isRequired: true,
    error: null,
    disable: false,
  },
})

// Budget State for Redux
export interface BudgetStateDto extends ActionState {
  budgets: Budget[]
  selectedBudget: Budget | null
  budgetProgress: BudgetProgress[]
}

export const initialBudgetState: BudgetStateDto = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  budgets: [],
  selectedBudget: null,
  budgetProgress: [],
}
