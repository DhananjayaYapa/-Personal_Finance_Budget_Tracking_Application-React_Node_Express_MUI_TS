import { TRANSACTION_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import type { Transaction, TransactionPaginationDto } from '../../utilities/models'

export interface TransactionState {
  transactions: Transaction[]
  currentTransaction: Transaction | null
  pagination: TransactionPaginationDto
  isLoading: boolean
  error: string | null
}

const INITIAL_STATE: TransactionState = {
  transactions: [],
  currentTransaction: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transactionReducer = (state = INITIAL_STATE, action: any): TransactionState => {
  switch (action.type) {
    // Fetch Transactions
    case TRANSACTION_ACTION_TYPES.FETCH_TRANSACTIONS + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case TRANSACTION_ACTION_TYPES.FETCH_TRANSACTIONS + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        transactions: action.data.transactions,
        pagination: action.data.pagination,
        error: null,
      }
    case TRANSACTION_ACTION_TYPES.FETCH_TRANSACTIONS + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Fetch Single Transaction
    case TRANSACTION_ACTION_TYPES.FETCH_TRANSACTION + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case TRANSACTION_ACTION_TYPES.FETCH_TRANSACTION + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentTransaction: action.data,
        error: null,
      }
    case TRANSACTION_ACTION_TYPES.FETCH_TRANSACTION + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Create Transaction
    case TRANSACTION_ACTION_TYPES.CREATE_TRANSACTION + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case TRANSACTION_ACTION_TYPES.CREATE_TRANSACTION + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        transactions: [action.data, ...state.transactions],
        error: null,
      }
    case TRANSACTION_ACTION_TYPES.CREATE_TRANSACTION + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Update Transaction
    case TRANSACTION_ACTION_TYPES.UPDATE_TRANSACTION + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case TRANSACTION_ACTION_TYPES.UPDATE_TRANSACTION + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        transactions: state.transactions.map((txn) =>
          txn.id === action.data.id ? action.data : txn
        ),
        error: null,
      }
    case TRANSACTION_ACTION_TYPES.UPDATE_TRANSACTION + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Delete Transaction
    case TRANSACTION_ACTION_TYPES.DELETE_TRANSACTION + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case TRANSACTION_ACTION_TYPES.DELETE_TRANSACTION + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        transactions: state.transactions.filter((txn) => txn.id !== action.data.id),
        error: null,
      }
    case TRANSACTION_ACTION_TYPES.DELETE_TRANSACTION + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Clear Current Transaction
    case TRANSACTION_ACTION_TYPES.CLEAR_CURRENT_TRANSACTION:
      return {
        ...state,
        currentTransaction: null,
      }

    // Clear Error
    case TRANSACTION_ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

export default transactionReducer
