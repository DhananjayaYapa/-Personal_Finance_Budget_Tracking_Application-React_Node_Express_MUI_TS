import type { ActionState } from './core.model'
import type { CategoryType } from '../constants/finance.constants'

// Category Model
export interface Category {
  id: string
  name: string
  type: CategoryType
  createdAt: string
  updatedAt: string
}

// Create Category Request
export interface CreateCategoryRequestDto {
  name: string
  type: CategoryType
}

// Update Category Request
export interface UpdateCategoryRequestDto {
  name?: string
  type?: CategoryType
}

// Category Filter Params
export interface CategoryFilterParams {
  type?: CategoryType
  search?: string
}

// Category State for Redux
export interface CategoryStateDto extends ActionState {
  categories: Category[]
  selectedCategory: Category | null
}

export const initialCategoryState: CategoryStateDto = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  categories: [],
  selectedCategory: null,
}

// ============================================
// CONTROLLED FORM DTOs (Athena Pattern)
// ============================================

// Category Entry Form DTO (for Create)
export interface CategoryEntryFormDto {
  name: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  type: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
}

// Category Edit Form DTO (for Update)
export interface CategoryEditFormDto {
  categoryId: {
    value: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  name: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  type: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
}

// Initial states for Category forms
export const INITIAL_CATEGORY_FORM_STATE = (): CategoryEntryFormDto => ({
  name: {
    value: '',
    validator: 'text',
    isRequired: true,
    error: null,
    disable: false,
  },
  type: {
    value: 'EXPENSE',
    validator: 'select',
    isRequired: true,
    error: null,
    disable: false,
  },
})

export const INITIAL_CATEGORY_EDIT_STATE = (): CategoryEditFormDto => ({
  categoryId: {
    value: '',
    isRequired: true,
    error: null,
    disable: false,
  },
  name: {
    value: '',
    validator: 'text',
    isRequired: true,
    error: null,
    disable: false,
  },
  type: {
    value: 'EXPENSE',
    validator: 'select',
    isRequired: true,
    error: null,
    disable: false,
  },
})
