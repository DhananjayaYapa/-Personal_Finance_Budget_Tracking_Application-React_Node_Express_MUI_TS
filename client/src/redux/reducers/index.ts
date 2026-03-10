import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './auth.reducer'
import categoryReducer from './category.reducer'
import transactionReducer from './transaction.reducer'
import budgetReducer from './budget.reducer'
import alertReducer from './alert.reducer'

const rootReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
  transaction: transactionReducer,
  budget: budgetReducer,
  alert: alertReducer,
})

export default rootReducer
