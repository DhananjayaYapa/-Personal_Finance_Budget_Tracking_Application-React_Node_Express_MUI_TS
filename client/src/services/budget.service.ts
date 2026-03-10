import { API_ROUTES } from '../utilities/constants'
import type {
  Budget,
  CreateBudgetRequestDto,
  UpdateBudgetRequestDto,
  BudgetFilterParams,
  BudgetProgress,
  BudgetProgressFilterParams,
  BudgetAllProgressFilterParams,
  BudgetExportFilterParams,
  ApiResponseDto,
} from '../utilities/models'
import { axiosPrivateInstance } from './index'

const getBudgets = (params?: BudgetFilterParams) => {
  return axiosPrivateInstance.get<ApiResponseDto<Budget[]>>(API_ROUTES.BUDGETS, { params })
}

const getBudgetById = (id: string) => {
  return axiosPrivateInstance.get<ApiResponseDto<Budget>>(API_ROUTES.BUDGET_BY_ID(id))
}

const createBudget = (payload: CreateBudgetRequestDto) => {
  return axiosPrivateInstance.post<ApiResponseDto<Budget>>(API_ROUTES.BUDGETS, payload)
}

const updateBudget = (id: string, payload: UpdateBudgetRequestDto) => {
  return axiosPrivateInstance.put<ApiResponseDto<Budget>>(API_ROUTES.BUDGET_BY_ID(id), payload)
}

const deleteBudget = (id: string) => {
  return axiosPrivateInstance.delete(API_ROUTES.BUDGET_BY_ID(id))
}

const getBudgetProgress = (params?: BudgetProgressFilterParams) => {
  return axiosPrivateInstance.get<ApiResponseDto<BudgetProgress[]>>(API_ROUTES.BUDGET_PROGRESS, {
    params,
  })
}

const getAllBudgetProgress = (params?: BudgetAllProgressFilterParams) => {
  return axiosPrivateInstance.get<ApiResponseDto<BudgetProgress[]>>(API_ROUTES.BUDGET_PROGRESS_ALL, {
    params,
  })
}

const exportCSV = (params?: BudgetExportFilterParams) => {
  return axiosPrivateInstance.get(API_ROUTES.BUDGET_EXPORT_CSV, {
    params,
    responseType: 'blob',
  }).then(res => res.data)
}

const exportJSON = (params?: BudgetExportFilterParams) => {
  return axiosPrivateInstance.get(API_ROUTES.BUDGET_EXPORT_JSON, {
    params,
    responseType: 'blob',
  }).then(res => res.data)
}

export const budgetService = {
  getBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetProgress,
  getAllBudgetProgress,
  exportCSV,
  exportJSON,
}
