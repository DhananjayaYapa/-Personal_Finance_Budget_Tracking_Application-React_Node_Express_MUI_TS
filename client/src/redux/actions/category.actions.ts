import { CATEGORY_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import type {
  CategoryFilterParams,
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
} from '../../utilities/models'

// Fetch categories list
const fetchCategories = (params?: CategoryFilterParams) => ({
  type: CATEGORY_ACTION_TYPES.FETCH_CATEGORIES + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// Fetch single category
const fetchCategory = (params: { id: string }) => ({
  type: CATEGORY_ACTION_TYPES.FETCH_CATEGORY + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// Create category
const createCategory = (payload: CreateCategoryRequestDto) => ({
  type: CATEGORY_ACTION_TYPES.CREATE_CATEGORY + COMMON_ACTION_TYPES.REQUEST,
  payload,
})

// Update category
const updateCategory = (payload: { id: string; data: UpdateCategoryRequestDto }) => ({
  type: CATEGORY_ACTION_TYPES.UPDATE_CATEGORY + COMMON_ACTION_TYPES.REQUEST,
  payload,
})

// Delete category
const deleteCategory = (params: { id: string }) => ({
  type: CATEGORY_ACTION_TYPES.DELETE_CATEGORY + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// Clear current category
const clearCurrentCategory = () => ({
  type: CATEGORY_ACTION_TYPES.CLEAR_CURRENT_CATEGORY,
})

export const categoryActions = {
  fetchCategories,
  fetchCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  clearCurrentCategory,
}
