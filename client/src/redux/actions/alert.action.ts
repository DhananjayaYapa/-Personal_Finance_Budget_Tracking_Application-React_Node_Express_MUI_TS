import {
  CATEGORY_ACTION_TYPES,
  TRANSACTION_ACTION_TYPES,
  BUDGET_ACTION_TYPES,
  EXPORT_ACTION_TYPES,
  AUTH_ACTION_TYPES,
  COMMON_ACTION_TYPES,
} from '../../utilities/constants'

// Category alerts
const clearCreateCategoryAlert = () => ({
  type: CATEGORY_ACTION_TYPES.CREATE_CATEGORY + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

const clearUpdateCategoryAlert = () => ({
  type: CATEGORY_ACTION_TYPES.UPDATE_CATEGORY + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

const clearDeleteCategoryAlert = () => ({
  type: CATEGORY_ACTION_TYPES.DELETE_CATEGORY + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

// Transaction alerts
const clearCreateTransactionAlert = () => ({
  type: TRANSACTION_ACTION_TYPES.CREATE_TRANSACTION + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

const clearUpdateTransactionAlert = () => ({
  type: TRANSACTION_ACTION_TYPES.UPDATE_TRANSACTION + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

const clearDeleteTransactionAlert = () => ({
  type: TRANSACTION_ACTION_TYPES.DELETE_TRANSACTION + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

// Budget alerts
const clearCreateBudgetAlert = () => ({
  type: BUDGET_ACTION_TYPES.CREATE_BUDGET + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

const clearUpdateBudgetAlert = () => ({
  type: BUDGET_ACTION_TYPES.UPDATE_BUDGET + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

const clearDeleteBudgetAlert = () => ({
  type: BUDGET_ACTION_TYPES.DELETE_BUDGET + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

// Export alerts
const clearExportCsvAlert = () => ({
  type: EXPORT_ACTION_TYPES.EXPORT_CSV + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

const clearExportJsonAlert = () => ({
  type: EXPORT_ACTION_TYPES.EXPORT_JSON + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

// Profile alerts
const clearUpdateProfileAlert = () => ({
  type: AUTH_ACTION_TYPES.UPDATE_PROFILE + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

const clearChangePasswordAlert = () => ({
  type: AUTH_ACTION_TYPES.CHANGE_PASSWORD + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

export const alertActions = {
  // Category
  clearCreateCategoryAlert,
  clearUpdateCategoryAlert,
  clearDeleteCategoryAlert,
  // Transaction
  clearCreateTransactionAlert,
  clearUpdateTransactionAlert,
  clearDeleteTransactionAlert,
  // Budget
  clearCreateBudgetAlert,
  clearUpdateBudgetAlert,
  clearDeleteBudgetAlert,
  // Export
  clearExportCsvAlert,
  clearExportJsonAlert,
  // Profile
  clearUpdateProfileAlert,
  clearChangePasswordAlert,
}
