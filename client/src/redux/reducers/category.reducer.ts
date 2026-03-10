import { CATEGORY_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import type { Category } from '../../utilities/models'

export interface CategoryState {
  categories: Category[]
  currentCategory: Category | null
  isLoading: boolean
  error: string | null
}

const INITIAL_STATE: CategoryState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const categoryReducer = (state = INITIAL_STATE, action: any): CategoryState => {
  switch (action.type) {
    // Fetch Categories
    case CATEGORY_ACTION_TYPES.FETCH_CATEGORIES + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case CATEGORY_ACTION_TYPES.FETCH_CATEGORIES + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        categories: action.data,
        error: null,
      }
    case CATEGORY_ACTION_TYPES.FETCH_CATEGORIES + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Fetch Single Category
    case CATEGORY_ACTION_TYPES.FETCH_CATEGORY + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case CATEGORY_ACTION_TYPES.FETCH_CATEGORY + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentCategory: action.data,
        error: null,
      }
    case CATEGORY_ACTION_TYPES.FETCH_CATEGORY + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Create Category
    case CATEGORY_ACTION_TYPES.CREATE_CATEGORY + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case CATEGORY_ACTION_TYPES.CREATE_CATEGORY + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        categories: [...state.categories, action.data],
        error: null,
      }
    case CATEGORY_ACTION_TYPES.CREATE_CATEGORY + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Update Category
    case CATEGORY_ACTION_TYPES.UPDATE_CATEGORY + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case CATEGORY_ACTION_TYPES.UPDATE_CATEGORY + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        categories: state.categories.map((cat) =>
          cat.id === action.data.id ? action.data : cat
        ),
        error: null,
      }
    case CATEGORY_ACTION_TYPES.UPDATE_CATEGORY + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Delete Category
    case CATEGORY_ACTION_TYPES.DELETE_CATEGORY + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case CATEGORY_ACTION_TYPES.DELETE_CATEGORY + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        categories: state.categories.filter((cat) => cat.id !== action.data.id),
        error: null,
      }
    case CATEGORY_ACTION_TYPES.DELETE_CATEGORY + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Clear Current Category
    case CATEGORY_ACTION_TYPES.CLEAR_CURRENT_CATEGORY:
      return {
        ...state,
        currentCategory: null,
      }

    // Clear Error
    case CATEGORY_ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

export default categoryReducer
