/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeLatest } from 'redux-saga/effects'
import { categoryService } from '../../services'
import { CATEGORY_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import { dispatchAlert } from '../../utilities/helpers'
import type {
  CategoryFilterParams,
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
  ApiResponseDto,
  Category,
} from '../../utilities/models'
import type { AxiosResponse } from 'axios'

function* fetchCategoriesSaga(action: { type: string; params?: CategoryFilterParams }) {
  try {
    const response: AxiosResponse<ApiResponseDto<Category[]>> = yield call(
      categoryService.getCategories,
      action.params
    )
    yield put({
      type: CATEGORY_ACTION_TYPES.FETCH_CATEGORIES + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
  } catch (error: any) {
    yield put({
      type: CATEGORY_ACTION_TYPES.FETCH_CATEGORIES + COMMON_ACTION_TYPES.ERROR,
      error,
    })
  }
}

function* fetchCategorySaga(action: { type: string; params: { id: string } }) {
  try {
    const response: AxiosResponse<ApiResponseDto<Category>> = yield call(
      categoryService.getCategoryById,
      action.params.id
    )
    yield put({
      type: CATEGORY_ACTION_TYPES.FETCH_CATEGORY + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
  } catch (error: any) {
    yield put({
      type: CATEGORY_ACTION_TYPES.FETCH_CATEGORY + COMMON_ACTION_TYPES.ERROR,
      error,
    })
  }
}

function* createCategorySaga(action: { type: string; payload: CreateCategoryRequestDto }) {
  try {
    const response: AxiosResponse<ApiResponseDto<Category>> = yield call(
      categoryService.createCategory,
      action.payload
    )
    yield put({
      type: CATEGORY_ACTION_TYPES.CREATE_CATEGORY + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
    yield* dispatchAlert(
      CATEGORY_ACTION_TYPES.CREATE_CATEGORY,
      response.data.message || 'Category created successfully',
      'success'
    )
  } catch (error: any) {
    yield put({
      type: CATEGORY_ACTION_TYPES.CREATE_CATEGORY + COMMON_ACTION_TYPES.ERROR,
      error,
    })
    yield* dispatchAlert(
      CATEGORY_ACTION_TYPES.CREATE_CATEGORY,
      error || 'Failed to create category',
      'error'
    )
  }
}

function* updateCategorySaga(action: {
  type: string
  payload: { id: string; data: UpdateCategoryRequestDto }
}) {
  try {
    const response: AxiosResponse<ApiResponseDto<Category>> = yield call(
      categoryService.updateCategory,
      action.payload.id,
      action.payload.data
    )
    yield put({
      type: CATEGORY_ACTION_TYPES.UPDATE_CATEGORY + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
    yield* dispatchAlert(
      CATEGORY_ACTION_TYPES.UPDATE_CATEGORY,
      response.data.message || 'Category updated successfully',
      'success'
    )
  } catch (error: any) {
    yield put({
      type: CATEGORY_ACTION_TYPES.UPDATE_CATEGORY + COMMON_ACTION_TYPES.ERROR,
      error,
    })
    yield* dispatchAlert(
      CATEGORY_ACTION_TYPES.UPDATE_CATEGORY,
      error || 'Failed to update category',
      'error'
    )
  }
}

function* deleteCategorySaga(action: { type: string; params: { id: string } }) {
  try {
    yield call(categoryService.deleteCategory, action.params.id)
    yield put({
      type: CATEGORY_ACTION_TYPES.DELETE_CATEGORY + COMMON_ACTION_TYPES.SUCCESS,
      data: { id: action.params.id },
    })
    yield* dispatchAlert(
      CATEGORY_ACTION_TYPES.DELETE_CATEGORY,
      'Category deleted successfully',
      'success'
    )
  } catch (error: any) {
    yield put({
      type: CATEGORY_ACTION_TYPES.DELETE_CATEGORY + COMMON_ACTION_TYPES.ERROR,
      error,
    })
    yield* dispatchAlert(
      CATEGORY_ACTION_TYPES.DELETE_CATEGORY,
      error || 'Failed to delete category',
      'error'
    )
  }
}

export default function* categorySaga() {
  yield takeLatest(
    CATEGORY_ACTION_TYPES.FETCH_CATEGORIES + COMMON_ACTION_TYPES.REQUEST,
    fetchCategoriesSaga
  )
  yield takeLatest(
    CATEGORY_ACTION_TYPES.FETCH_CATEGORY + COMMON_ACTION_TYPES.REQUEST,
    fetchCategorySaga
  )
  yield takeLatest(
    CATEGORY_ACTION_TYPES.CREATE_CATEGORY + COMMON_ACTION_TYPES.REQUEST,
    createCategorySaga
  )
  yield takeLatest(
    CATEGORY_ACTION_TYPES.UPDATE_CATEGORY + COMMON_ACTION_TYPES.REQUEST,
    updateCategorySaga
  )
  yield takeLatest(
    CATEGORY_ACTION_TYPES.DELETE_CATEGORY + COMMON_ACTION_TYPES.REQUEST,
    deleteCategorySaga
  )
}
