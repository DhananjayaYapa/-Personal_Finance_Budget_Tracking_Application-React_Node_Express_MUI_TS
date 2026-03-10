import {
  CATEGORY_ACTION_TYPES,
  TRANSACTION_ACTION_TYPES,
  BUDGET_ACTION_TYPES,
  EXPORT_ACTION_TYPES,
  AUTH_ACTION_TYPES,
  COMMON_ACTION_TYPES,
} from '../../utilities/constants'
import type { AlertActionDto, AlertReducerState } from '../../utilities/models'

interface AlertState {
  message: string | null
  severity: 'success' | 'error' | 'warning' | 'info' | null
}

const INITIAL_ALERT_STATE: AlertState = {
  message: null,
  severity: null,
}

const INITIAL_STATE: AlertReducerState = {
  createCategoryAlert: { ...INITIAL_ALERT_STATE },
  updateCategoryAlert: { ...INITIAL_ALERT_STATE },
  deleteCategoryAlert: { ...INITIAL_ALERT_STATE },
  createTransactionAlert: { ...INITIAL_ALERT_STATE },
  updateTransactionAlert: { ...INITIAL_ALERT_STATE },
  deleteTransactionAlert: { ...INITIAL_ALERT_STATE },
  createBudgetAlert: { ...INITIAL_ALERT_STATE },
  updateBudgetAlert: { ...INITIAL_ALERT_STATE },
  deleteBudgetAlert: { ...INITIAL_ALERT_STATE },
  exportCsvAlert: { ...INITIAL_ALERT_STATE },
  exportJsonAlert: { ...INITIAL_ALERT_STATE },
  updateProfileAlert: { ...INITIAL_ALERT_STATE },
  changePasswordAlert: { ...INITIAL_ALERT_STATE },
}

const alertReducer = (state = INITIAL_STATE, action: AlertActionDto): AlertReducerState => {
  switch (action.type) {
    // Create Category
    case CATEGORY_ACTION_TYPES.CREATE_CATEGORY + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        createCategoryAlert: {
          message: action.message || null,
          severity: action.severity || null,
        },
      }
    case CATEGORY_ACTION_TYPES.CREATE_CATEGORY + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        createCategoryAlert: { ...INITIAL_ALERT_STATE },
      }

    // Update Category
    case CATEGORY_ACTION_TYPES.UPDATE_CATEGORY + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        updateCategoryAlert: {
          message: action.message || null,
          severity: action.severity || null,
        },
      }
    case CATEGORY_ACTION_TYPES.UPDATE_CATEGORY + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        updateCategoryAlert: { ...INITIAL_ALERT_STATE },
      }

    // Delete Category
    case CATEGORY_ACTION_TYPES.DELETE_CATEGORY + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        deleteCategoryAlert: {
          message: action.message || null,
          severity: action.severity || null,
        },
      }
    case CATEGORY_ACTION_TYPES.DELETE_CATEGORY + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        deleteCategoryAlert: { ...INITIAL_ALERT_STATE },
      }

    // Create Transaction
    case TRANSACTION_ACTION_TYPES.CREATE_TRANSACTION + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        createTransactionAlert: {
          message: action.message || null,
          severity: action.severity || null,
        },
      }
    case TRANSACTION_ACTION_TYPES.CREATE_TRANSACTION + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        createTransactionAlert: { ...INITIAL_ALERT_STATE },
      }

    // Update Transaction
    case TRANSACTION_ACTION_TYPES.UPDATE_TRANSACTION + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        updateTransactionAlert: {
          message: action.message || null,
          severity: action.severity || null,
        },
      }
    case TRANSACTION_ACTION_TYPES.UPDATE_TRANSACTION + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        updateTransactionAlert: { ...INITIAL_ALERT_STATE },
      }

    // Delete Transaction
    case TRANSACTION_ACTION_TYPES.DELETE_TRANSACTION + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        deleteTransactionAlert: {
          message: action.message || null,
          severity: action.severity || null,
        },
      }
    case TRANSACTION_ACTION_TYPES.DELETE_TRANSACTION + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        deleteTransactionAlert: { ...INITIAL_ALERT_STATE },
      }

    // Create Budget
    case BUDGET_ACTION_TYPES.CREATE_BUDGET + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        createBudgetAlert: {
          message: action.message || null,
          severity: action.severity || null,
        },
      }
    case BUDGET_ACTION_TYPES.CREATE_BUDGET + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        createBudgetAlert: { ...INITIAL_ALERT_STATE },
      }

    // Update Budget
    case BUDGET_ACTION_TYPES.UPDATE_BUDGET + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        updateBudgetAlert: {
          message: action.message || null,
          severity: action.severity || null,
        },
      }
    case BUDGET_ACTION_TYPES.UPDATE_BUDGET + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        updateBudgetAlert: { ...INITIAL_ALERT_STATE },
      }

    // Delete Budget
    case BUDGET_ACTION_TYPES.DELETE_BUDGET + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        deleteBudgetAlert: {
          message: action.message || null,
          severity: action.severity || null,
        },
      }
    case BUDGET_ACTION_TYPES.DELETE_BUDGET + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        deleteBudgetAlert: { ...INITIAL_ALERT_STATE },
      }

    // Export CSV
    case EXPORT_ACTION_TYPES.EXPORT_CSV + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        exportCsvAlert: {
          message: action.message || null,
          severity: action.severity || null,
        },
      }
    case EXPORT_ACTION_TYPES.EXPORT_CSV + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        exportCsvAlert: { ...INITIAL_ALERT_STATE },
      }

    // Export JSON
    case EXPORT_ACTION_TYPES.EXPORT_JSON + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        exportJsonAlert: {
          message: action.message || null,
          severity: action.severity || null,
        },
      }
    case EXPORT_ACTION_TYPES.EXPORT_JSON + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        exportJsonAlert: { ...INITIAL_ALERT_STATE },
      }

    // Update Profile
    case AUTH_ACTION_TYPES.UPDATE_PROFILE + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        updateProfileAlert: {
          message: action.message || null,
          severity: action.severity || null,
        },
      }
    case AUTH_ACTION_TYPES.UPDATE_PROFILE + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        updateProfileAlert: { ...INITIAL_ALERT_STATE },
      }

    // Change Password
    case AUTH_ACTION_TYPES.CHANGE_PASSWORD + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        changePasswordAlert: {
          message: action.message || null,
          severity: action.severity || null,
        },
      }
    case AUTH_ACTION_TYPES.CHANGE_PASSWORD + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        changePasswordAlert: { ...INITIAL_ALERT_STATE },
      }

    default:
      return state
  }
}

export default alertReducer
