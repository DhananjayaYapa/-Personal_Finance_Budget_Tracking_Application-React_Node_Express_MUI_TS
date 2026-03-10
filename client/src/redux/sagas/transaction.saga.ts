/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeLatest } from 'redux-saga/effects'
import { transactionService } from '../../services'
import { TRANSACTION_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import { dispatchAlert } from '../../utilities/helpers'
import type {
  TransactionFilterParams,
  CreateTransactionRequestDto,
  UpdateTransactionRequestDto,
  ApiResponseDto,
  Transaction,
  TransactionListResponseDto,
} from '../../utilities/models'
import type { AxiosResponse } from 'axios'

function* fetchTransactionsSaga(action: { type: string; params?: TransactionFilterParams }) {
  try {
    const response: AxiosResponse<ApiResponseDto<TransactionListResponseDto>> = yield call(
      transactionService.getTransactions,
      action.params
    )
    yield put({
      type: TRANSACTION_ACTION_TYPES.FETCH_TRANSACTIONS + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
  } catch (error: any) {
    yield put({
      type: TRANSACTION_ACTION_TYPES.FETCH_TRANSACTIONS + COMMON_ACTION_TYPES.ERROR,
      error,
    })
  }
}

function* fetchTransactionSaga(action: { type: string; params: { id: string } }) {
  try {
    const response: AxiosResponse<ApiResponseDto<Transaction>> = yield call(
      transactionService.getTransactionById,
      action.params.id
    )
    yield put({
      type: TRANSACTION_ACTION_TYPES.FETCH_TRANSACTION + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
  } catch (error: any) {
    yield put({
      type: TRANSACTION_ACTION_TYPES.FETCH_TRANSACTION + COMMON_ACTION_TYPES.ERROR,
      error,
    })
  }
}

function* createTransactionSaga(action: { type: string; payload: CreateTransactionRequestDto }) {
  try {
    const response: AxiosResponse<ApiResponseDto<Transaction>> = yield call(
      transactionService.createTransaction,
      action.payload
    )
    yield put({
      type: TRANSACTION_ACTION_TYPES.CREATE_TRANSACTION + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })

    // Check for budget warning in response
    const warning = response.data.warning
    if (warning) {
      // Show warning alert with budget exceeded message
      yield* dispatchAlert(
        TRANSACTION_ACTION_TYPES.CREATE_TRANSACTION,
        `Transaction created! ⚠️ ${warning.message}`,
        'warning'
      )
    } else {
      yield* dispatchAlert(
        TRANSACTION_ACTION_TYPES.CREATE_TRANSACTION,
        response.data.message || 'Transaction created successfully',
        'success'
      )
    }
  } catch (error: any) {
    yield put({
      type: TRANSACTION_ACTION_TYPES.CREATE_TRANSACTION + COMMON_ACTION_TYPES.ERROR,
      error,
    })
    yield* dispatchAlert(
      TRANSACTION_ACTION_TYPES.CREATE_TRANSACTION,
      error || 'Failed to create transaction',
      'error'
    )
  }
}

function* updateTransactionSaga(action: {
  type: string
  payload: { id: string; data: UpdateTransactionRequestDto }
}) {
  try {
    const response: AxiosResponse<ApiResponseDto<Transaction>> = yield call(
      transactionService.updateTransaction,
      action.payload.id,
      action.payload.data
    )
    yield put({
      type: TRANSACTION_ACTION_TYPES.UPDATE_TRANSACTION + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
    yield* dispatchAlert(
      TRANSACTION_ACTION_TYPES.UPDATE_TRANSACTION,
      response.data.message || 'Transaction updated successfully',
      'success'
    )
  } catch (error: any) {
    yield put({
      type: TRANSACTION_ACTION_TYPES.UPDATE_TRANSACTION + COMMON_ACTION_TYPES.ERROR,
      error,
    })
    yield* dispatchAlert(
      TRANSACTION_ACTION_TYPES.UPDATE_TRANSACTION,
      error || 'Failed to update transaction',
      'error'
    )
  }
}

function* deleteTransactionSaga(action: { type: string; params: { id: string } }) {
  try {
    yield call(transactionService.deleteTransaction, action.params.id)
    yield put({
      type: TRANSACTION_ACTION_TYPES.DELETE_TRANSACTION + COMMON_ACTION_TYPES.SUCCESS,
      data: { id: action.params.id },
    })
    yield* dispatchAlert(
      TRANSACTION_ACTION_TYPES.DELETE_TRANSACTION,
      'Transaction deleted successfully',
      'success'
    )
  } catch (error: any) {
    yield put({
      type: TRANSACTION_ACTION_TYPES.DELETE_TRANSACTION + COMMON_ACTION_TYPES.ERROR,
      error,
    })
    yield* dispatchAlert(
      TRANSACTION_ACTION_TYPES.DELETE_TRANSACTION,
      error || 'Failed to delete transaction',
      'error'
    )
  }
}

export default function* transactionSaga() {
  yield takeLatest(
    TRANSACTION_ACTION_TYPES.FETCH_TRANSACTIONS + COMMON_ACTION_TYPES.REQUEST,
    fetchTransactionsSaga
  )
  yield takeLatest(
    TRANSACTION_ACTION_TYPES.FETCH_TRANSACTION + COMMON_ACTION_TYPES.REQUEST,
    fetchTransactionSaga
  )
  yield takeLatest(
    TRANSACTION_ACTION_TYPES.CREATE_TRANSACTION + COMMON_ACTION_TYPES.REQUEST,
    createTransactionSaga
  )
  yield takeLatest(
    TRANSACTION_ACTION_TYPES.UPDATE_TRANSACTION + COMMON_ACTION_TYPES.REQUEST,
    updateTransactionSaga
  )
  yield takeLatest(
    TRANSACTION_ACTION_TYPES.DELETE_TRANSACTION + COMMON_ACTION_TYPES.REQUEST,
    deleteTransactionSaga
  )
}
