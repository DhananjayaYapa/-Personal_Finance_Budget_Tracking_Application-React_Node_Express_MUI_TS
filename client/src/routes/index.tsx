import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../redux/store'
import { APP_ROUTES } from '../utilities/constants'
import PrivateRoute from './PrivateRoute'

// Page imports
import AuthPage from '../pages/AuthPage/AuthPage'
import Dashboard from '../pages/Dashboard/Dashboard'
import Transactions from '../pages/Transactions/Transactions'
import Categories from '../pages/Categories/Categories'
import Budgets from '../pages/Budgets/Budgets'
import Reports from '../pages/Reports/Reports'
import Profile from '../pages/Profile/Profile'

function AppRoutes() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  return (
    <Routes>
      {/* Public Routes - Combined Auth Page */}
      <Route
        path={APP_ROUTES.LOGIN}
        element={isAuthenticated ? <Navigate to={APP_ROUTES.DASHBOARD} replace /> : <AuthPage />}
      />
      <Route
        path={APP_ROUTES.REGISTER}
        element={
          isAuthenticated ? <Navigate to={APP_ROUTES.DASHBOARD} replace /> : <AuthPage />
        }
      />

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path={APP_ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={APP_ROUTES.TRANSACTIONS} element={<Transactions />} />
        <Route path={APP_ROUTES.CATEGORIES} element={<Categories />} />
        <Route path={APP_ROUTES.BUDGETS} element={<Budgets />} />
        <Route path={APP_ROUTES.REPORTS} element={<Reports />} />
        <Route path={APP_ROUTES.PROFILE} element={<Profile />} />
      </Route>

      {/* Catch all - redirect to dashboard or login */}
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? APP_ROUTES.DASHBOARD : APP_ROUTES.LOGIN} replace />
        }
      />
    </Routes>
  )
}

export default AppRoutes
