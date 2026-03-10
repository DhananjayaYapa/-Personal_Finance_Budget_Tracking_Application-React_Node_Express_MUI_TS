import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { Visibility, VisibilityOff, AccountBalanceWallet as WalletIcon } from '@mui/icons-material'
import { Loader } from 'react-loaders'
import { authActions } from '../../redux/actions'
import type { RootState } from '../../redux/store'
import type { LoginRequestDto, RegisterRequestDto } from '../../utilities/models'
import { APP_ROUTES, APP_NAME } from '../../utilities/constants'
import styles from './AuthPage.module.scss'

interface RegisterFormData extends RegisterRequestDto {
  confirmPassword: string
}

const AuthPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const { isAuthenticated, isLoading, error, registrationSuccess } = useSelector(
    (state: RootState) => state.auth
  )

  const [rightPanelActive, setRightPanelActive] = useState(
    location.pathname === APP_ROUTES.REGISTER
  )
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Login form
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLoginForm,
    formState: { errors: loginErrors },
  } = useForm<LoginRequestDto>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Register form
  const {
    register: registerSignup,
    handleSubmit: handleSubmitRegister,
    watch,
    reset: resetRegisterForm,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const registerPassword = watch('password')

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(APP_ROUTES.DASHBOARD, { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Handle registration success
  useEffect(() => {
    if (registrationSuccess) {
      setRightPanelActive(false)
      navigate(APP_ROUTES.LOGIN, { replace: true })
    }
  }, [registrationSuccess, navigate])

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(authActions.clearError())
    }
  }, [dispatch])

  // Sync panel state with URL
  useEffect(() => {
    setRightPanelActive(location.pathname === APP_ROUTES.REGISTER)
  }, [location.pathname])

  const handleSwitchPanel = (toRegister: boolean) => {
    dispatch(authActions.clearError())
    // Reset forms when switching panels
    resetLoginForm()
    resetRegisterForm()
    setShowLoginPassword(false)
    setShowRegisterPassword(false)
    setShowConfirmPassword(false)
    setRightPanelActive(toRegister)
    navigate(toRegister ? APP_ROUTES.REGISTER : APP_ROUTES.LOGIN, { replace: true })
  }

  const onLoginSubmit = (data: LoginRequestDto) => {
    dispatch(authActions.loginRequest(data))
  }

  const onRegisterSubmit = (data: RegisterFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword: _, ...registerData } = data
    dispatch(authActions.registerRequest(registerData))
  }

  return (
    <Box className={styles.authPageWrapper}>
      <Box className={`${styles.container} ${rightPanelActive ? styles.rightPanelActive : ''}`}>
        {/* Sign Up Form Container */}
        <Box className={`${styles.formContainer} ${styles.signUpContainer}`}>
          <form onSubmit={handleSubmitRegister(onRegisterSubmit)} noValidate>
            <Box className={styles.logoContainer}>
              <WalletIcon className={styles.logo} />
            </Box>
            <Typography variant="h4" className={styles.title}>
              Create Account
            </Typography>

            {error && rightPanelActive && (
              <Alert severity="error" className={styles.alert}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              size="small"
              error={!!registerErrors.name}
              helperText={registerErrors.name?.message}
              disabled={isLoading}
              {...registerSignup('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              size="small"
              error={!!registerErrors.email}
              helperText={registerErrors.email?.message}
              disabled={isLoading}
              {...registerSignup('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <TextField
              fullWidth
              label="Password"
              type={showRegisterPassword ? 'text' : 'password'}
              margin="normal"
              size="small"
              error={!!registerErrors.password}
              helperText={registerErrors.password?.message}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      edge="end"
                      size="small"
                      disabled={isLoading}
                    >
                      {showRegisterPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...registerSignup('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              margin="normal"
              size="small"
              error={!!registerErrors.confirmPassword}
              helperText={registerErrors.confirmPassword?.message}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      size="small"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...registerSignup('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === registerPassword || 'Passwords do not match',
              })}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading && rightPanelActive ? (
                <Box className="pacman-sm">
                  <Loader type="pacman" active />
                </Box>
              ) : (
                'Sign Up'
              )}
            </Button>

            <Typography className={styles.mobileToggle}>
              Already have an account? <span onClick={() => handleSwitchPanel(false)}>Sign In</span>
            </Typography>
          </form>
        </Box>

        {/* Sign In Form Container */}
        <Box className={`${styles.formContainer} ${styles.signInContainer}`}>
          <form onSubmit={handleSubmitLogin(onLoginSubmit)} noValidate>
            <Box className={styles.logoContainer}>
              <WalletIcon className={styles.logo} />
            </Box>
            <Typography variant="h4" className={styles.title}>
              Sign In
            </Typography>

            {error && !rightPanelActive && (
              <Alert severity="error" className={styles.alert}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              size="small"
              error={!!loginErrors.email}
              helperText={loginErrors.email?.message}
              disabled={isLoading}
              {...registerLogin('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <TextField
              fullWidth
              label="Password"
              type={showLoginPassword ? 'text' : 'password'}
              margin="normal"
              size="small"
              error={!!loginErrors.password}
              helperText={loginErrors.password?.message}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      edge="end"
                      size="small"
                      disabled={isLoading}
                    >
                      {showLoginPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...registerLogin('password', {
                required: 'Password is required',
              })}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading && !rightPanelActive ? (
                <Box className="pacman-sm">
                  <Loader type="pacman" active />
                </Box>
              ) : (
                'Sign In'
              )}
            </Button>

            <Typography className={styles.mobileToggle}>
              Don't have an account? <span onClick={() => handleSwitchPanel(true)}>Sign Up</span>
            </Typography>
          </form>
        </Box>

        {/* Overlay Container */}
        <Box className={styles.overlayContainer}>
          <Box className={styles.overlay}>
            <Box className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <WalletIcon className={styles.overlayLogo} />
              <Typography variant="h4" className={styles.overlayTitle}>
                Welcome Back!
              </Typography>
              <Typography className={styles.overlayText}>
                Sign in with your credentials to access {APP_NAME} and manage your finances
              </Typography>
              <Button
                variant="outlined"
                className={styles.ghostButton}
                onClick={() => handleSwitchPanel(false)}
              >
                Sign In
              </Button>
            </Box>

            <Box className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <WalletIcon className={styles.overlayLogo} />
              <Typography variant="h4" className={styles.overlayTitle}>
                Hello, Friend!
              </Typography>
              <Typography className={styles.overlayText}>
                Create an account to start your journey with {APP_NAME} and take control of your
                finances
              </Typography>
              <Button
                variant="outlined"
                className={styles.ghostButton}
                onClick={() => handleSwitchPanel(true)}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default AuthPage
