/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeLatest } from 'redux-saga/effects'
import { budgetService } from '../../services'
import { BUDGET_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import { dispatchAlert } from '../../utilities/helpers'
import type {
  BudgetFilterParams,
  CreateBudgetRequestDto,
  UpdateBudgetRequestDto,
  BudgetProgressFilterParams,
  BudgetAllProgressFilterParams,
  ApiResponseDto,
  Budget,
  BudgetProgress,
} from '../../utilities/models'
import type { AxiosResponse } from 'axios'

function* fetchBudgetsSaga(action: { type: string; params?: BudgetFilterParams }) {
  try {
    const response: AxiosResponse<ApiResponseDto<Budget[]>> = yield call(
      budgetService.getBudgets,
      action.params
    )
    yield put({
      type: BUDGET_ACTION_TYPES.FETCH_BUDGETS + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
  } catch (error: any) {
    yield put({
      type: BUDGET_ACTION_TYPES.FETCH_BUDGETS + COMMON_ACTION_TYPES.ERROR,
      error,
    })
  }
}

function* fetchBudgetSaga(action: { type: string; params: { id: string } }) {
  try {
    const response: AxiosResponse<ApiResponseDto<Budget>> = yield call(
      budgetService.getBudgetById,
      action.params.id
    )
    yield put({
      type: BUDGET_ACTION_TYPES.FETCH_BUDGET + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
  } catch (error: any) {
    yield put({
      type: BUDGET_ACTION_TYPES.FETCH_BUDGET + COMMON_ACTION_TYPES.ERROR,
      error,
    })
  }
}

function* createBudgetSaga(action: { type: string; payload: CreateBudgetRequestDto }) {
  try {
    const response: AxiosResponse<ApiResponseDto<Budget>> = yield call(
      budgetService.createBudget,
      action.payload
    )
    yield put({
      type: BUDGET_ACTION_TYPES.CREATE_BUDGET + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
    yield* dispatchAlert(
      BUDGET_ACTION_TYPES.CREATE_BUDGET,
      response.data.message || 'Budget created successfully',
      'success'
    )
  } catch (error: any) {
    yield put({
      type: BUDGET_ACTION_TYPES.CREATE_BUDGET + COMMON_ACTION_TYPES.ERROR,
      error,
    })
    yield* dispatchAlert(
      BUDGET_ACTION_TYPES.CREATE_BUDGET,
      error || 'Failed to create budget',
      'error'
    )
  }
}

function* updateBudgetSaga(action: {
  type: string
  payload: { id: string; data: UpdateBudgetRequestDto }
}) {
  try {
    const response: AxiosResponse<ApiResponseDto<Budget>> = yield call(
      budgetService.updateBudget,
      action.payload.id,
      action.payload.data
    )
    yield put({
      type: BUDGET_ACTION_TYPES.UPDATE_BUDGET + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
    yield* dispatchAlert(
      BUDGET_ACTION_TYPES.UPDATE_BUDGET,
      response.data.message || 'Budget updated successfully',
      'success'
    )
  } catch (error: any) {
    yield put({
      type: BUDGET_ACTION_TYPES.UPDATE_BUDGET + COMMON_ACTION_TYPES.ERROR,
      error,
    })
    yield* dispatchAlert(
      BUDGET_ACTION_TYPES.UPDATE_BUDGET,
      error || 'Failed to update budget',
      'error'
    )
  }
}

function* deleteBudgetSaga(action: { type: string; params: { id: string } }) {
  try {
    yield call(budgetService.deleteBudget, action.params.id)
    yield put({
      type: BUDGET_ACTION_TYPES.DELETE_BUDGET + COMMON_ACTION_TYPES.SUCCESS,
      data: { id: action.params.id },
    })
    yield* dispatchAlert(
      BUDGET_ACTION_TYPES.DELETE_BUDGET,
      'Budget deleted successfully',
      'success'
    )
  } catch (error: any) {
    yield put({
      type: BUDGET_ACTION_TYPES.DELETE_BUDGET + COMMON_ACTION_TYPES.ERROR,
      error,
    })
    yield* dispatchAlert(
      BUDGET_ACTION_TYPES.DELETE_BUDGET,
      error || 'Failed to delete budget',
      'error'
    )
  }
}

function* fetchBudgetProgressSaga(action: { type: string; params?: BudgetProgressFilterParams }) {
  try {
    const response: AxiosResponse<ApiResponseDto<BudgetProgress[]>> = yield call(
      budgetService.getBudgetProgress,
      action.params
    )
    yield put({
      type: BUDGET_ACTION_TYPES.FETCH_BUDGET_PROGRESS + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
  } catch (error: any) {
    yield put({
      type: BUDGET_ACTION_TYPES.FETCH_BUDGET_PROGRESS + COMMON_ACTION_TYPES.ERROR,
      error,
    })
  }
}

function* fetchAllBudgetProgressSaga(action: { type: string; params?: BudgetAllProgressFilterParams }) {
  try {
    const response: AxiosResponse<ApiResponseDto<BudgetProgress[]>> = yield call(
      budgetService.getAllBudgetProgress,
      action.params
    )
    yield put({
      type: BUDGET_ACTION_TYPES.FETCH_ALL_BUDGET_PROGRESS + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
  } catch (error: any) {
    yield put({
      type: BUDGET_ACTION_TYPES.FETCH_ALL_BUDGET_PROGRESS + COMMON_ACTION_TYPES.ERROR,
      error,
    })
  }
}

export default function* budgetSaga() {
  yield takeLatest(
    BUDGET_ACTION_TYPES.FETCH_BUDGETS + COMMON_ACTION_TYPES.REQUEST,
    fetchBudgetsSaga
  )
  yield takeLatest(
    BUDGET_ACTION_TYPES.FETCH_BUDGET + COMMON_ACTION_TYPES.REQUEST,
    fetchBudgetSaga
  )
  yield takeLatest(
    BUDGET_ACTION_TYPES.CREATE_BUDGET + COMMON_ACTION_TYPES.REQUEST,
    createBudgetSaga
  )
  yield takeLatest(
    BUDGET_ACTION_TYPES.UPDATE_BUDGET + COMMON_ACTION_TYPES.REQUEST,
    updateBudgetSaga
  )
  yield takeLatest(
    BUDGET_ACTION_TYPES.DELETE_BUDGET + COMMON_ACTION_TYPES.REQUEST,
    deleteBudgetSaga
  )
  yield takeLatest(
    BUDGET_ACTION_TYPES.FETCH_BUDGET_PROGRESS + COMMON_ACTION_TYPES.REQUEST,
    fetchBudgetProgressSaga
  )
  yield takeLatest(
    BUDGET_ACTION_TYPES.FETCH_ALL_BUDGET_PROGRESS + COMMON_ACTION_TYPES.REQUEST,
    fetchAllBudgetProgressSaga
  )
}
