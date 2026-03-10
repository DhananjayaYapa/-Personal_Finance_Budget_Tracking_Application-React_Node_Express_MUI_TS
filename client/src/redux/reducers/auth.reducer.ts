import { 
  AUTH_ACTION_TYPES, 
  COMMON_ACTION_TYPES, 
  TOKEN_KEY, 
  USER_KEY } from '../../utilities/constants'
import type { User } from '../../utilities/models'

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  registrationSuccess: boolean
}

// Helper to safely get user from localStorage
const getUserFromStorage = (): User | null => {
  try {
    const userStr = localStorage.getItem(USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}

const INITIAL_STATE: AuthState = {
  user: getUserFromStorage(),
  token: localStorage.getItem(TOKEN_KEY),
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
  isLoading: false,
  error: null,
  registrationSuccess: false,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authReducer = (state = INITIAL_STATE, action: any): AuthState => {
  switch (action.type) {
    // Login
    case AUTH_ACTION_TYPES.LOGIN + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case AUTH_ACTION_TYPES.LOGIN + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.data.user,
        token: action.data.token,
        error: null,
      }
    case AUTH_ACTION_TYPES.LOGIN + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.error,
      }

    // Register
    case AUTH_ACTION_TYPES.REGISTER + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
        registrationSuccess: false,
      }
    case AUTH_ACTION_TYPES.REGISTER + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
        registrationSuccess: true,
      }
    case AUTH_ACTION_TYPES.REGISTER + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.error,
      }

    // Logout
    case AUTH_ACTION_TYPES.LOGOUT + COMMON_ACTION_TYPES.REQUEST:
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      return {
        ...INITIAL_STATE,
        token: null,
        isAuthenticated: false,
      }

    // Fetch Profile
    case AUTH_ACTION_TYPES.FETCH_PROFILE + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case AUTH_ACTION_TYPES.FETCH_PROFILE + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.data,
        error: null,
      }
    case AUTH_ACTION_TYPES.FETCH_PROFILE + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Update Profile
    case AUTH_ACTION_TYPES.UPDATE_PROFILE + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case AUTH_ACTION_TYPES.UPDATE_PROFILE + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.data,
        error: null,
      }
    case AUTH_ACTION_TYPES.UPDATE_PROFILE + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Change Password
    case AUTH_ACTION_TYPES.CHANGE_PASSWORD + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case AUTH_ACTION_TYPES.CHANGE_PASSWORD + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      }
    case AUTH_ACTION_TYPES.CHANGE_PASSWORD + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Clear Error
    case AUTH_ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

export default authReducer
