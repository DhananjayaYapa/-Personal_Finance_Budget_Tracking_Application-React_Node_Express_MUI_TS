/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeLatest } from 'redux-saga/effects'
import { transactionService, budgetService } from '../../services'
import { EXPORT_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import { dispatchAlert } from '../../utilities/helpers'
import type { TransactionFilterParams, BudgetExportFilterParams } from '../../utilities/models'

function* exportCsvSaga(action: { type: string; params?: TransactionFilterParams }) {
  try {
    const blob: Blob = yield call(transactionService.exportCSV, action.params)

    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'transactions.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    yield put({
      type: EXPORT_ACTION_TYPES.EXPORT_CSV + COMMON_ACTION_TYPES.SUCCESS,
    })
    yield* dispatchAlert(
      EXPORT_ACTION_TYPES.EXPORT_CSV,
      'Transactions exported as CSV',
      'success'
    )
  } catch (error: any) {
    yield put({
      type: EXPORT_ACTION_TYPES.EXPORT_CSV + COMMON_ACTION_TYPES.ERROR,
      error,
    })
    yield* dispatchAlert(
      EXPORT_ACTION_TYPES.EXPORT_CSV,
      error || 'Failed to export CSV',
      'error'
    )
  }
}

function* exportJsonSaga(action: { type: string; params?: TransactionFilterParams }) {
  try {
    const blob: Blob = yield call(transactionService.exportJSON, action.params)

    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'transactions.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    yield put({
      type: EXPORT_ACTION_TYPES.EXPORT_JSON + COMMON_ACTION_TYPES.SUCCESS,
    })
    yield* dispatchAlert(
      EXPORT_ACTION_TYPES.EXPORT_JSON,
      'Transactions exported as JSON',
      'success'
    )
  } catch (error: any) {
    yield put({
      type: EXPORT_ACTION_TYPES.EXPORT_JSON + COMMON_ACTION_TYPES.ERROR,
      error,
    })
    yield* dispatchAlert(
      EXPORT_ACTION_TYPES.EXPORT_JSON,
      error || 'Failed to export JSON',
      'error'
    )
  }
}

function* exportBudgetCsvSaga(action: { type: string; params?: BudgetExportFilterParams }) {
  try {
    const blob: Blob = yield call(budgetService.exportCSV, action.params)

    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'budgets.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    yield put({
      type: EXPORT_ACTION_TYPES.EXPORT_BUDGET_CSV + COMMON_ACTION_TYPES.SUCCESS,
    })
    yield* dispatchAlert(
      EXPORT_ACTION_TYPES.EXPORT_BUDGET_CSV,
      'Budgets exported as CSV',
      'success'
    )
  } catch (error: any) {
    yield put({
      type: EXPORT_ACTION_TYPES.EXPORT_BUDGET_CSV + COMMON_ACTION_TYPES.ERROR,
      error,
    })
    yield* dispatchAlert(
      EXPORT_ACTION_TYPES.EXPORT_BUDGET_CSV,
      error || 'Failed to export budgets CSV',
      'error'
    )
  }
}

function* exportBudgetJsonSaga(action: { type: string; params?: BudgetExportFilterParams }) {
  try {
    const blob: Blob = yield call(budgetService.exportJSON, action.params)

    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'budgets.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    yield put({
      type: EXPORT_ACTION_TYPES.EXPORT_BUDGET_JSON + COMMON_ACTION_TYPES.SUCCESS,
    })
    yield* dispatchAlert(
      EXPORT_ACTION_TYPES.EXPORT_BUDGET_JSON,
      'Budgets exported as JSON',
      'success'
    )
  } catch (error: any) {
    yield put({
      type: EXPORT_ACTION_TYPES.EXPORT_BUDGET_JSON + COMMON_ACTION_TYPES.ERROR,
      error,
    })
    yield* dispatchAlert(
      EXPORT_ACTION_TYPES.EXPORT_BUDGET_JSON,
      error || 'Failed to export budgets JSON',
      'error'
    )
  }
}

export default function* exportSaga() {
  yield takeLatest(EXPORT_ACTION_TYPES.EXPORT_CSV + COMMON_ACTION_TYPES.REQUEST, exportCsvSaga)
  yield takeLatest(EXPORT_ACTION_TYPES.EXPORT_JSON + COMMON_ACTION_TYPES.REQUEST, exportJsonSaga)
  yield takeLatest(EXPORT_ACTION_TYPES.EXPORT_BUDGET_CSV + COMMON_ACTION_TYPES.REQUEST, exportBudgetCsvSaga)
  yield takeLatest(EXPORT_ACTION_TYPES.EXPORT_BUDGET_JSON + COMMON_ACTION_TYPES.REQUEST, exportBudgetJsonSaga)
}
