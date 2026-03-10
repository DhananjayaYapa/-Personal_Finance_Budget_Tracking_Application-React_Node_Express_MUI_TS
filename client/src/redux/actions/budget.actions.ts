import { BUDGET_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import type {
  BudgetFilterParams,
  CreateBudgetRequestDto,
  UpdateBudgetRequestDto,
  BudgetProgressFilterParams,
  BudgetAllProgressFilterParams,
} from '../../utilities/models'

// Fetch budgets list
const fetchBudgets = (params?: BudgetFilterParams) => ({
  type: BUDGET_ACTION_TYPES.FETCH_BUDGETS + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// Fetch single budget
const fetchBudget = (params: { id: string }) => ({
  type: BUDGET_ACTION_TYPES.FETCH_BUDGET + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// Create budget
const createBudget = (payload: CreateBudgetRequestDto) => ({
  type: BUDGET_ACTION_TYPES.CREATE_BUDGET + COMMON_ACTION_TYPES.REQUEST,
  payload,
})

// Update budget
const updateBudget = (payload: { id: string; data: UpdateBudgetRequestDto }) => ({
  type: BUDGET_ACTION_TYPES.UPDATE_BUDGET + COMMON_ACTION_TYPES.REQUEST,
  payload,
})

// Delete budget
const deleteBudget = (params: { id: string }) => ({
  type: BUDGET_ACTION_TYPES.DELETE_BUDGET + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// Fetch budget progress
const fetchBudgetProgress = (params?: BudgetProgressFilterParams) => ({
  type: BUDGET_ACTION_TYPES.FETCH_BUDGET_PROGRESS + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// Fetch all budget progress in one call
const fetchAllBudgetProgress = (params?: BudgetAllProgressFilterParams) => ({
  type: BUDGET_ACTION_TYPES.FETCH_ALL_BUDGET_PROGRESS + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// Clear current budget
const clearCurrentBudget = () => ({
  type: BUDGET_ACTION_TYPES.CLEAR_CURRENT_BUDGET,
})

export const budgetActions = {
  fetchBudgets,
  fetchBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  fetchBudgetProgress,
  fetchAllBudgetProgress,
  clearCurrentBudget,
}
