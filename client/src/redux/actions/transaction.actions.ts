import { TRANSACTION_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import type {
  TransactionFilterParams,
  CreateTransactionRequestDto,
  UpdateTransactionRequestDto,
} from '../../utilities/models'

// Fetch transactions list
const fetchTransactions = (params?: TransactionFilterParams) => ({
  type: TRANSACTION_ACTION_TYPES.FETCH_TRANSACTIONS + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// Fetch single transaction
const fetchTransaction = (params: { id: string }) => ({
  type: TRANSACTION_ACTION_TYPES.FETCH_TRANSACTION + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// Create transaction
const createTransaction = (payload: CreateTransactionRequestDto) => ({
  type: TRANSACTION_ACTION_TYPES.CREATE_TRANSACTION + COMMON_ACTION_TYPES.REQUEST,
  payload,
})

// Update transaction
const updateTransaction = (payload: { id: string; data: UpdateTransactionRequestDto }) => ({
  type: TRANSACTION_ACTION_TYPES.UPDATE_TRANSACTION + COMMON_ACTION_TYPES.REQUEST,
  payload,
})

// Delete transaction
const deleteTransaction = (params: { id: string }) => ({
  type: TRANSACTION_ACTION_TYPES.DELETE_TRANSACTION + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// Clear current transaction
const clearCurrentTransaction = () => ({
  type: TRANSACTION_ACTION_TYPES.CLEAR_CURRENT_TRANSACTION,
})

export const transactionActions = {
  fetchTransactions,
  fetchTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  clearCurrentTransaction,
}
