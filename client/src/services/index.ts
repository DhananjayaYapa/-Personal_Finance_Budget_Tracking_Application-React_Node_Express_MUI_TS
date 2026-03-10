import axios from 'axios'
import { exceptionHandler } from '../core'
import { TOKEN_KEY } from '../utilities/constants'

// Default base URL
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

// Public Axios Instance For unauthenticated requests
export const axiosPublicInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Private Axios Instance For authenticated requests (requires JWT token)
export const axiosPrivateInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Private instance - Add Authorization header
axiosPrivateInstance.interceptors.request.use(
  async (request) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token && request.headers) {
      request.headers.Authorization = `Bearer ${token}`
    }
    return request
  },
  (error) => {
    console.error('Request Interceptor Error:', error)
    return Promise.reject(error)
  }
)

// Response Interceptors
axiosPrivateInstance.interceptors.response.use(
  async (response) => {
    return response
  },
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      // Use replace to avoid adding to history and prevent loops
      window.location.replace('/login')
    }
    return Promise.reject(await exceptionHandler(error.response))
  }
)

axiosPublicInstance.interceptors.response.use(
  async (response) => {
    return response
  },
  async (error) => {
    return Promise.reject(await exceptionHandler(error.response))
  }
)

export * from './auth.service'
export * from './category.service'
export * from './transaction.service'
export * from './budget.service'
