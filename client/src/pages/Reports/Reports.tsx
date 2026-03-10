import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Grid, Typography } from '@mui/material'
import {
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  AccountBalance as BalanceIcon,
  AccountBalanceWallet as BudgetIcon,
} from '@mui/icons-material'

import { transactionActions, budgetActions, categoryActions, exportActions } from '../../redux/actions'
import type { RootState } from '../../redux/store'
import type { Transaction, Budget, BudgetProgress, Category } from '../../utilities/models'
import type { TransactionType } from '../../utilities/constants'
import { PageHeader, LoadingOverlay } from '../../components/shared'
import {
  ReportTypeSelector,
  ReportFilters,
  TransactionReportTable,
  BudgetReportTable,
  ReportStatCard,
  type ReportType,
  type TransactionReportItem,
  type BudgetReportItem,
} from '../../components/reports'
import { TRANSACTION_TYPE, MONTHS } from '../../utilities/constants'
import styles from './Reports.module.scss'

const Reports: React.FC = () => {
  const dispatch = useDispatch()

  const transactionState = useSelector((state: RootState) => state.transaction)
  const budgetState = useSelector((state: RootState) => state.budget)
  const categoryState = useSelector((state: RootState) => state.category)

  const transactions = transactionState.transactions || []
  const budgets = budgetState.budgets || []
  const budgetProgress = budgetState.budgetProgress || []
  const categories = categoryState.categories || []
  const isLoading = transactionState.isLoading || budgetState.isLoading

  // State
  const [reportType, setReportType] = useState<ReportType>(null)
  const [startDate, setStartDate] = useState(() => {
    const date = new Date()
    date.setMonth(date.getMonth() - 11)
    return date.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Effects
  useEffect(() => {
    dispatch(transactionActions.fetchTransactions({ limit: 100 }))
    dispatch(budgetActions.fetchBudgets())
    dispatch(categoryActions.fetchCategories())
  }, [dispatch])

  useEffect(() => {
    if (budgets.length > 0) {
      dispatch(budgetActions.fetchAllBudgetProgress())
    }
  }, [dispatch, budgets])

  // Handlers
  const handleReportTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newType: ReportType
  ) => {
    if (newType !== null) {
      setReportType(newType)
      setPage(0)
    }
  }

  const handleStartDateChange = (value: string) => setStartDate(value)
  const handleEndDateChange = (value: string) => setEndDate(value)
  const handleCategoryChange = (value: string) => setCategoryFilter(value)
  const handleTypeChange = (value: string) => setTypeFilter(value)
  const handlePageChange = (newPage: number) => setPage(newPage)
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage)
    setPage(0)
  }

  // Export handlers
  const handleExportTransactionCsv = () => {
    dispatch(
      exportActions.exportCsv({
        startDate,
        endDate,
        categoryId: categoryFilter || undefined,
        type: typeFilter ? (typeFilter as TransactionType) : undefined,
      })
    )
  }

  const handleExportTransactionJson = () => {
    dispatch(
      exportActions.exportJson({
        startDate,
        endDate,
        categoryId: categoryFilter || undefined,
        type: typeFilter ? (typeFilter as TransactionType) : undefined,
      })
    )
  }

  const handleExportBudgetCsv = () => {
    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)
    dispatch(
      exportActions.exportBudgetCsv({
        startMonth: startDateObj.getMonth() + 1,
        startYear: startDateObj.getFullYear(),
        endMonth: endDateObj.getMonth() + 1,
        endYear: endDateObj.getFullYear(),
        categoryId: categoryFilter || undefined,
      })
    )
  }

  const handleExportBudgetJson = () => {
    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)
    dispatch(
      exportActions.exportBudgetJson({
        startMonth: startDateObj.getMonth() + 1,
        startYear: startDateObj.getFullYear(),
        endMonth: endDateObj.getMonth() + 1,
        endYear: endDateObj.getFullYear(),
        categoryId: categoryFilter || undefined,
      })
    )
  }

  // Computed values
  const filteredCategories =
    reportType === 'budget'
      ? categories.filter((c: Category) => c.type === 'EXPENSE')
      : categories

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t: Transaction) => {
      const txDate = new Date(t.date)
      const start = new Date(startDate)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)

      const matchesDate = txDate >= start && txDate <= end
      const matchesCategory = !categoryFilter || t.categoryId === categoryFilter
      const matchesType = !typeFilter || t.type === typeFilter

      return matchesDate && matchesCategory && matchesType
    })
  }, [transactions, startDate, endDate, categoryFilter, typeFilter])

  const filteredBudgetsWithProgress = useMemo(() => {
    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)
    const startMonth = startDateObj.getMonth() + 1
    const startYear = startDateObj.getFullYear()
    const endMonth = endDateObj.getMonth() + 1
    const endYear = endDateObj.getFullYear()

    return budgets
      .filter((budget: Budget) => {
        const budgetDate = budget.year * 12 + budget.month
        const startDateNum = startYear * 12 + startMonth
        const endDateNum = endYear * 12 + endMonth
        const matchesDate = budgetDate >= startDateNum && budgetDate <= endDateNum
        const matchesCategory = !categoryFilter || budget.categoryId === categoryFilter
        return matchesDate && matchesCategory
      })
      .map((budget: Budget) => {
        const progress = budgetProgress.find((p: BudgetProgress) => p.budgetId === budget.id)
        return {
          ...budget,
          spentAmount: progress ? Number(progress.spentAmount) : 0,
          remaining: progress ? Number(progress.remaining) : Number(budget.amount),
          percentageUsed: progress ? Number(progress.percentageUsed) : 0,
          status: progress?.exceeded
            ? 'Over Budget'
            : progress && progress.percentageUsed >= 80
              ? 'Near Limit'
              : 'On Track',
        }
      })
  }, [budgets, budgetProgress, startDate, endDate, categoryFilter])

  // Transaction table data
  const transactionReportItems: TransactionReportItem[] = useMemo(() => {
    const formatDate = (dateStr: string) =>
      new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })

    return filteredTransactions
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((t: Transaction) => ({
        id: t.id,
        date: formatDate(t.date),
        title: t.title,
        categoryName: t.category?.name || 'Uncategorized',
        type: t.type,
        amount: Number(t.amount),
      }))
  }, [filteredTransactions, page, rowsPerPage])

  // Budget table data
  const budgetReportItems: BudgetReportItem[] = useMemo(() => {
    const getMonthLabel = (month: number) =>
      MONTHS.find((m) => m.value === month)?.label || 'Unknown'

    return filteredBudgetsWithProgress
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((b) => ({
        id: b.id,
        monthYear: `${getMonthLabel(b.month)} ${b.year}`,
        categoryName: b.category?.name || 'Unknown',
        amount: Number(b.amount),
        spentAmount: b.spentAmount,
        remaining: b.remaining,
        percentageUsed: b.percentageUsed,
        status: b.status,
      }))
  }, [filteredBudgetsWithProgress, page, rowsPerPage])

  // Transaction totals
  const transactionIncome = filteredTransactions
    .filter((t: Transaction) => t.type === TRANSACTION_TYPE.INCOME)
    .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0)
  const transactionExpenses = filteredTransactions
    .filter((t: Transaction) => t.type === TRANSACTION_TYPE.EXPENSE)
    .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0)
  const transactionTotals = {
    income: transactionIncome,
    expenses: transactionExpenses,
    net: transactionIncome - transactionExpenses,
  }

  // Budget totals
  const budgetTotal = filteredBudgetsWithProgress.reduce((sum, b) => sum + Number(b.amount), 0)
  const budgetSpent = filteredBudgetsWithProgress.reduce((sum, b) => sum + b.spentAmount, 0)
  const budgetTotals = {
    totalBudget: budgetTotal,
    totalSpent: budgetSpent,
    remaining: budgetTotal - budgetSpent,
  }

  // Summary message
  const summaryMessage = !reportType
    ? ''
    : reportType === 'transaction'
      ? `Showing ${filteredTransactions.length} transactions in the selected date range.`
      : `Showing ${filteredBudgetsWithProgress.length} budgets in the selected date range.`

  return (
    <Box className={styles.reportsPage}>
      <PageHeader title="Reports" subtitle="Export and analyze your financial data" />

      <ReportTypeSelector value={reportType} onChange={handleReportTypeChange} />

      <ReportFilters
        reportType={reportType}
        startDate={startDate}
        endDate={endDate}
        categoryFilter={categoryFilter}
        typeFilter={typeFilter}
        categories={filteredCategories}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onCategoryChange={handleCategoryChange}
        onTypeChange={handleTypeChange}
        onExportCsv={reportType === 'budget' ? handleExportBudgetCsv : handleExportTransactionCsv}
        onExportJson={reportType === 'budget' ? handleExportBudgetJson : handleExportTransactionJson}
      />

      <LoadingOverlay loading={isLoading}>
        {/* Transaction Stats */}
        {reportType === 'transaction' && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <ReportStatCard
                title="Total Income"
                amount={transactionTotals.income}
                icon={<IncomeIcon fontSize="large" />}
                color="#22c55e"
                type="income"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <ReportStatCard
                title="Total Expenses"
                amount={transactionTotals.expenses}
                icon={<ExpenseIcon fontSize="large" />}
                color="#ef4444"
                type="expense"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <ReportStatCard
                title="Net Balance"
                amount={transactionTotals.net}
                icon={<BalanceIcon fontSize="large" />}
                color={transactionTotals.net >= 0 ? '#22c55e' : '#ef4444'}
                type={transactionTotals.net >= 0 ? 'income' : 'expense'}
              />
            </Grid>
          </Grid>
        )}

        {/* Budget Stats */}
        {reportType === 'budget' && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <ReportStatCard
                title="Total Budget"
                amount={budgetTotals.totalBudget}
                icon={<BudgetIcon fontSize="large" />}
                color="#8b5cf6"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <ReportStatCard
                title="Total Spent"
                amount={budgetTotals.totalSpent}
                icon={<ExpenseIcon fontSize="large" />}
                color="#ef4444"
                type="expense"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <ReportStatCard
                title="Remaining"
                amount={budgetTotals.remaining}
                icon={<BalanceIcon fontSize="large" />}
                color={budgetTotals.remaining >= 0 ? '#22c55e' : '#ef4444'}
                type={budgetTotals.remaining >= 0 ? 'income' : 'expense'}
              />
            </Grid>
          </Grid>
        )}

        {/* Summary */}
        {reportType && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {summaryMessage}
          </Typography>
        )}

        {/* Transaction Table */}
        {reportType === 'transaction' && (
          <TransactionReportTable
            transactions={transactionReportItems}
            totalCount={filteredTransactions.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}

        {/* Budget Table */}
        {reportType === 'budget' && (
          <BudgetReportTable
            budgets={budgetReportItems}
            totalCount={filteredBudgetsWithProgress.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}
      </LoadingOverlay>
    </Box>
  )
}

export default Reports
