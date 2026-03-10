/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeLatest } from 'redux-saga/effects'
import { authService } from '../../services'
import { authActions } from '../actions'
import { AUTH_ACTION_TYPES, COMMON_ACTION_TYPES, TOKEN_KEY, USER_KEY } from '../../utilities/constants'
import { dispatchAlert } from '../../utilities/helpers'
import type {
  LoginRequestDto,
  RegisterRequestDto,
  ApiResponseDto,
  User,
} from '../../utilities/models'
import type { AxiosResponse } from 'axios'

// Login Response Type
interface LoginResponseData {
  token: string
  user: User
}

function* loginSaga(action: { type: string; payload: LoginRequestDto }) {
  try {
    const response: AxiosResponse<ApiResponseDto<LoginResponseData>> = yield call(
      authService.login,
      action.payload
    )

    // Store token in localStorage
    localStorage.setItem(TOKEN_KEY, response.data.data!.token)
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.data!.user))

    yield put(
      authActions.loginSuccess({
        user: response.data.data!.user,
        token: response.data.data!.token,
      })
    )
  } catch (error: any) {
    yield put(authActions.loginError(error))
  }
}

function* registerSaga(action: { type: string; payload: RegisterRequestDto }) {
  try {
    const response: AxiosResponse<ApiResponseDto<User>> = yield call(
      authService.register,
      action.payload
    )

    yield put(
      authActions.registerSuccess({
        user: response.data.data!,
        token: '',
      })
    )
  } catch (error: any) {
    yield put(authActions.registerError(error))
  }
}

function* logoutSaga() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } catch (error) {
    console.error('Logout error:', error)
  }
}

function* fetchProfileSaga() {
  try {
    const response: AxiosResponse<ApiResponseDto<User>> = yield call(authService.getProfile)
    // Update user in localStorage
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.data))
    yield put(authActions.fetchProfileSuccess(response.data.data))
  } catch (error: any) {
    yield put(authActions.fetchProfileError(error))
  }
}

function* updateProfileSaga(action: { type: string; payload: { name: string; email: string } }) {
  try {
    const response: AxiosResponse<ApiResponseDto<User>> = yield call(
      authService.updateProfile,
      action.payload
    )
    // Update user in localStorage
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.data))
    yield put(authActions.updateProfileSuccess(response.data.data))
    yield* dispatchAlert(
      AUTH_ACTION_TYPES.UPDATE_PROFILE,
      response.data.message || 'Profile updated successfully',
      'success'
    )
  } catch (error: any) {
    yield put(authActions.updateProfileError(error))
    yield* dispatchAlert(
      AUTH_ACTION_TYPES.UPDATE_PROFILE,
      error || 'Failed to update profile',
      'error'
    )
  }
}

function* changePasswordSaga(action: {
  type: string
  payload: { currentPassword: string; newPassword: string }
}) {
  try {
    const response: AxiosResponse<ApiResponseDto<null>> = yield call(
      authService.changePassword,
      action.payload
    )
    yield put(authActions.changePasswordSuccess())
    yield* dispatchAlert(
      AUTH_ACTION_TYPES.CHANGE_PASSWORD,
      response.data.message || 'Password changed successfully',
      'success'
    )
  } catch (error: any) {
    yield put(authActions.changePasswordError(error))
    yield* dispatchAlert(
      AUTH_ACTION_TYPES.CHANGE_PASSWORD,
      error || 'Failed to change password',
      'error'
    )
  }
}

export default function* authSaga() {
  yield takeLatest(AUTH_ACTION_TYPES.LOGIN + COMMON_ACTION_TYPES.REQUEST, loginSaga)
  yield takeLatest(AUTH_ACTION_TYPES.REGISTER + COMMON_ACTION_TYPES.REQUEST, registerSaga)
  yield takeLatest(AUTH_ACTION_TYPES.LOGOUT + COMMON_ACTION_TYPES.REQUEST, logoutSaga)
  yield takeLatest(AUTH_ACTION_TYPES.FETCH_PROFILE + COMMON_ACTION_TYPES.REQUEST, fetchProfileSaga)
  yield takeLatest(
    AUTH_ACTION_TYPES.UPDATE_PROFILE + COMMON_ACTION_TYPES.REQUEST,
    updateProfileSaga
  )
  yield takeLatest(
    AUTH_ACTION_TYPES.CHANGE_PASSWORD + COMMON_ACTION_TYPES.REQUEST,
    changePasswordSaga
  )
}
