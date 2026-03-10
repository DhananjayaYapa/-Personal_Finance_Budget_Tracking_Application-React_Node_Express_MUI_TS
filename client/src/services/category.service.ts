import { API_ROUTES } from '../utilities/constants'
import type {
  Category,
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
  CategoryFilterParams,
  ApiResponseDto,
} from '../utilities/models'
import { axiosPrivateInstance } from './index'

const getCategories = (params?: CategoryFilterParams) => {
  return axiosPrivateInstance.get<ApiResponseDto<Category[]>>(API_ROUTES.CATEGORIES, { params })
}

const getCategoryById = (id: string) => {
  return axiosPrivateInstance.get<ApiResponseDto<Category>>(API_ROUTES.CATEGORY_BY_ID(id))
}

const createCategory = (payload: CreateCategoryRequestDto) => {
  return axiosPrivateInstance.post<ApiResponseDto<Category>>(API_ROUTES.CATEGORIES, payload)
}

const updateCategory = (id: string, payload: UpdateCategoryRequestDto) => {
  return axiosPrivateInstance.put<ApiResponseDto<Category>>(API_ROUTES.CATEGORY_BY_ID(id), payload)
}

const deleteCategory = (id: string) => {
  return axiosPrivateInstance.delete(API_ROUTES.CATEGORY_BY_ID(id))
}

export const categoryService = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
}
