import { all, fork } from 'redux-saga/effects'
import authSaga from './auth.saga'
import categorySaga from './category.saga'
import transactionSaga from './transaction.saga'
import budgetSaga from './budget.saga'
import exportSaga from './export.saga'
import alertSaga from './alert.saga'

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(categorySaga),
    fork(transactionSaga),
    fork(budgetSaga),
    fork(exportSaga),
    fork(alertSaga),
  ])
}
