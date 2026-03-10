// Alert Action DTO
export interface AlertActionDto {
  type: string
  message?: string
  severity?: 'success' | 'error' | 'warning' | 'info'
  autoClear?: boolean
  timeout?: number
}

// Alert State
export interface AlertState {
  message: string | null
  severity: 'success' | 'error' | 'warning' | 'info' | null
}

// Alert Reducer State
export interface AlertReducerState {
  createCategoryAlert: AlertState
  updateCategoryAlert: AlertState
  deleteCategoryAlert: AlertState
  createTransactionAlert: AlertState
  updateTransactionAlert: AlertState
  deleteTransactionAlert: AlertState
  createBudgetAlert: AlertState
  updateBudgetAlert: AlertState
  deleteBudgetAlert: AlertState
  exportCsvAlert: AlertState
  exportJsonAlert: AlertState
  updateProfileAlert: AlertState
  changePasswordAlert: AlertState
}
