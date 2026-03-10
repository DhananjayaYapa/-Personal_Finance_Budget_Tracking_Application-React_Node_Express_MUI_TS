import { API_ROUTES } from '../utilities/constants'
import type {
  Transaction,
  CreateTransactionRequestDto,
  UpdateTransactionRequestDto,
  TransactionFilterParams,
  TransactionListResponseDto,
  ApiResponseDto,
} from '../utilities/models'
import { axiosPrivateInstance } from './index'

const getTransactions = (params?: TransactionFilterParams) => {
  return axiosPrivateInstance.get<ApiResponseDto<TransactionListResponseDto>>(
    API_ROUTES.TRANSACTIONS,
    { params }
  )
}

const getTransactionById = (id: string) => {
  return axiosPrivateInstance.get<ApiResponseDto<Transaction>>(API_ROUTES.TRANSACTION_BY_ID(id))
}

const createTransaction = (payload: CreateTransactionRequestDto) => {
  return axiosPrivateInstance.post<ApiResponseDto<Transaction>>(API_ROUTES.TRANSACTIONS, payload)
}

const updateTransaction = (id: string, payload: UpdateTransactionRequestDto) => {
  return axiosPrivateInstance.put<ApiResponseDto<Transaction>>(
    API_ROUTES.TRANSACTION_BY_ID(id),
    payload
  )
}

const deleteTransaction = (id: string) => {
  return axiosPrivateInstance.delete(API_ROUTES.TRANSACTION_BY_ID(id))
}

const exportCSV = (params?: TransactionFilterParams) => {
  return axiosPrivateInstance.get(API_ROUTES.EXPORT_CSV, {
    params,
    responseType: 'blob',
  }).then(res => res.data)
}

const exportJSON = (params?: TransactionFilterParams) => {
  return axiosPrivateInstance.get(API_ROUTES.EXPORT_JSON, {
    params,
    responseType: 'blob',
  }).then(res => res.data)
}

export const transactionService = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  exportCSV,
  exportJSON,
}
