import { BUDGET_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import type { Budget, BudgetProgress } from '../../utilities/models'

export interface BudgetState {
  budgets: Budget[]
  currentBudget: Budget | null
  budgetProgress: BudgetProgress[]
  isLoading: boolean
  error: string | null
}

const INITIAL_STATE: BudgetState = {
  budgets: [],
  currentBudget: null,
  budgetProgress: [],
  isLoading: false,
  error: null,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const budgetReducer = (state = INITIAL_STATE, action: any): BudgetState => {
  switch (action.type) {
    // Fetch Budgets
    case BUDGET_ACTION_TYPES.FETCH_BUDGETS + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case BUDGET_ACTION_TYPES.FETCH_BUDGETS + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        budgets: action.data,
        error: null,
      }
    case BUDGET_ACTION_TYPES.FETCH_BUDGETS + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Fetch Single Budget
    case BUDGET_ACTION_TYPES.FETCH_BUDGET + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case BUDGET_ACTION_TYPES.FETCH_BUDGET + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentBudget: action.data,
        error: null,
      }
    case BUDGET_ACTION_TYPES.FETCH_BUDGET + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Create Budget
    case BUDGET_ACTION_TYPES.CREATE_BUDGET + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case BUDGET_ACTION_TYPES.CREATE_BUDGET + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        budgets: [...state.budgets, action.data],
        error: null,
      }
    case BUDGET_ACTION_TYPES.CREATE_BUDGET + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Update Budget
    case BUDGET_ACTION_TYPES.UPDATE_BUDGET + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case BUDGET_ACTION_TYPES.UPDATE_BUDGET + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        budgets: state.budgets.map((budget) =>
          budget.id === action.data.id ? action.data : budget
        ),
        error: null,
      }
    case BUDGET_ACTION_TYPES.UPDATE_BUDGET + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Delete Budget
    case BUDGET_ACTION_TYPES.DELETE_BUDGET + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case BUDGET_ACTION_TYPES.DELETE_BUDGET + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        budgets: state.budgets.filter((budget) => budget.id !== action.data.id),
        error: null,
      }
    case BUDGET_ACTION_TYPES.DELETE_BUDGET + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Fetch Budget Progress
    case BUDGET_ACTION_TYPES.FETCH_BUDGET_PROGRESS + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case BUDGET_ACTION_TYPES.FETCH_BUDGET_PROGRESS + COMMON_ACTION_TYPES.SUCCESS: {
      // Merge new progress with existing, replacing by budgetId
      const newProgress = action.data as BudgetProgress[]
      const newBudgetIds = new Set(newProgress.map((p) => p.budgetId))
      const existingProgress = state.budgetProgress.filter(
        (p) => !newBudgetIds.has(p.budgetId)
      )
      return {
        ...state,
        isLoading: false,
        budgetProgress: [...existingProgress, ...newProgress],
        error: null,
      }
    }
    case BUDGET_ACTION_TYPES.FETCH_BUDGET_PROGRESS + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Fetch All Budget Progress (replaces entire array)
    case BUDGET_ACTION_TYPES.FETCH_ALL_BUDGET_PROGRESS + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case BUDGET_ACTION_TYPES.FETCH_ALL_BUDGET_PROGRESS + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        budgetProgress: action.data,
        error: null,
      }
    case BUDGET_ACTION_TYPES.FETCH_ALL_BUDGET_PROGRESS + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Clear Current Budget
    case BUDGET_ACTION_TYPES.CLEAR_CURRENT_BUDGET:
      return {
        ...state,
        currentBudget: null,
      }

    // Clear Error
    case BUDGET_ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

export default budgetReducer
