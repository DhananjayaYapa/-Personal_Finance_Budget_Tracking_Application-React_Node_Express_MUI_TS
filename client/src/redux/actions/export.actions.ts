import { EXPORT_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import type { TransactionFilterParams, BudgetExportFilterParams } from '../../utilities/models'

// Export CSV
const exportCsv = (params?: TransactionFilterParams) => ({
  type: EXPORT_ACTION_TYPES.EXPORT_CSV + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// Export JSON
const exportJson = (params?: TransactionFilterParams) => ({
  type: EXPORT_ACTION_TYPES.EXPORT_JSON + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// Export Budget CSV
const exportBudgetCsv = (params?: BudgetExportFilterParams) => ({
  type: EXPORT_ACTION_TYPES.EXPORT_BUDGET_CSV + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// Export Budget JSON
const exportBudgetJson = (params?: BudgetExportFilterParams) => ({
  type: EXPORT_ACTION_TYPES.EXPORT_BUDGET_JSON + COMMON_ACTION_TYPES.REQUEST,
  params,
})

export const exportActions = {
  exportCsv,
  exportJson,
  exportBudgetCsv,
  exportBudgetJson,
}
