import type { ActionState, PaginationParams } from './core.model'
import type { Category } from './category.model'
import type { TransactionType } from '../constants/finance.constants'
import { TRANSACTION_TYPE } from '../constants/finance.constants'

// Transaction Model
export interface Transaction {
  id: string
  title: string
  amount: number
  type: TransactionType
  date: string
  note?: string | null
  categoryId: string
  category: Category
  createdAt: string
  updatedAt: string
}

// Create Transaction Request
export interface CreateTransactionRequestDto {
  title: string
  amount: number
  type: TransactionType
  date: string
  note?: string
  categoryId: string
}

// Update Transaction Request
export interface UpdateTransactionRequestDto {
  title?: string
  amount?: number
  type?: TransactionType
  date?: string
  note?: string
  categoryId?: string
}

// Transaction Filter Params
export interface TransactionFilterParams extends PaginationParams {
  type?: TransactionType
  categoryId?: string
  startDate?: string
  endDate?: string
  search?: string
}

// Transaction Pagination Response
export interface TransactionPaginationDto {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Transaction List Response
export interface TransactionListResponseDto {
  transactions: Transaction[]
  pagination: TransactionPaginationDto
}

// ============================================
// CONTROLLED FORM DTOs (Athena Pattern)
// ============================================

// Transaction Entry Form DTO (for Create)
export interface TransactionEntryFormDto {
  title: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  amount: {
    value: number | string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  type: {
    value: TransactionType
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  categoryId: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  date: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  note: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
}

// Transaction Edit Form DTO (for Update)
export interface TransactionEditFormDto {
  transactionId: {
    value: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  title: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  amount: {
    value: number | string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  type: {
    value: TransactionType
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  categoryId: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  date: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  note: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
}

// Initial state for Transaction form (Create)
export const INITIAL_TRANSACTION_FORM_STATE = (): TransactionEntryFormDto => ({
  title: {
    value: '',
    validator: 'text',
    isRequired: true,
    error: null,
    disable: false,
  },
  amount: {
    value: '',
    validator: 'amount',
    isRequired: true,
    error: null,
    disable: false,
  },
  type: {
    value: TRANSACTION_TYPE.EXPENSE,
    validator: 'select',
    isRequired: true,
    error: null,
    disable: false,
  },
  categoryId: {
    value: '',
    validator: 'select',
    isRequired: true,
    error: null,
    disable: false,
  },
  date: {
    value: new Date().toISOString().split('T')[0],
    validator: 'date',
    isRequired: true,
    error: null,
    disable: false,
  },
  note: {
    value: '',
    validator: 'text',
    isRequired: false,
    error: null,
    disable: false,
  },
})

// Initial state for Transaction edit form
export const INITIAL_TRANSACTION_EDIT_STATE = (): TransactionEditFormDto => ({
  transactionId: {
    value: '',
    isRequired: true,
    error: null,
    disable: false,
  },
  title: {
    value: '',
    validator: 'text',
    isRequired: true,
    error: null,
    disable: false,
  },
  amount: {
    value: '',
    validator: 'amount',
    isRequired: true,
    error: null,
    disable: false,
  },
  type: {
    value: TRANSACTION_TYPE.EXPENSE,
    validator: 'select',
    isRequired: true,
    error: null,
    disable: false,
  },
  categoryId: {
    value: '',
    validator: 'select',
    isRequired: true,
    error: null,
    disable: false,
  },
  date: {
    value: new Date().toISOString().split('T')[0],
    validator: 'date',
    isRequired: true,
    error: null,
    disable: false,
  },
  note: {
    value: '',
    validator: 'text',
    isRequired: false,
    error: null,
    disable: false,
  },
})

// Transaction State for Redux
export interface TransactionStateDto extends ActionState {
  transactions: Transaction[]
  selectedTransaction: Transaction | null
  pagination: TransactionPaginationDto
  filters: TransactionFilterParams
}

export const initialTransactionState: TransactionStateDto = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  transactions: [],
  selectedTransaction: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {},
}
