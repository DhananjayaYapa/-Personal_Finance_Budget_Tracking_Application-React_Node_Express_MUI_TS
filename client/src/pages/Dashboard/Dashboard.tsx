import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Grid } from '@mui/material'
import {
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  AccountBalance as BalanceIcon,
  AccountBalanceWallet as BudgetIcon,
} from '@mui/icons-material'
import { transactionActions, budgetActions } from '../../redux/actions'
import type { RootState } from '../../redux/store'
import type { Transaction, BudgetProgress as BudgetProgressType } from '../../utilities/models'
import { LoadingOverlay } from '../../components/shared'
import {
  StatCard,
  WelcomeMessage,
  MonthlyBarChart,
  CategoryPieChart,
  BudgetProgressList,
  RecentTransactions,
} from '../../components/dashboard'
import type {
  MonthlyDataPoint,
  CategoryDataPoint,
  BudgetProgressItem,
  RecentTransactionItem,
} from '../../components/dashboard'
import { TRANSACTION_TYPE, MONTHS } from '../../utilities/constants'
import styles from './Dashboard.module.scss'

const Dashboard: React.FC = () => {
  const dispatch = useDispatch()

  // Selectors
  const user = useSelector((state: RootState) => state.auth.user)
  const transactionState = useSelector((state: RootState) => state.transaction)
  const budgetState = useSelector((state: RootState) => state.budget)

  const transactions = transactionState.transactions || []
  const allBudgetProgress = budgetState.budgetProgress || []
  const isLoading = transactionState.isLoading || budgetState.isLoading

  // Current date info
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  const currentMonthName = MONTHS.find((m) => m.value === currentMonth)?.label || ''

  // State
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const yearOptions = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1]

  // Fetch data on mount
  useEffect(() => {
    dispatch(transactionActions.fetchTransactions({ limit: 100 }))
    dispatch(budgetActions.fetchBudgetProgress({ month: currentMonth, year: currentYear }))
  }, [dispatch, currentMonth, currentYear])

  // Filter budget progress for current month only
  const budgetProgress = allBudgetProgress.filter(
    (bp: BudgetProgressType) => bp.month === currentMonth && bp.year === currentYear
  )

  // Filter transactions for current month only
  const currentMonthTransactions = useMemo(
    () =>
      transactions.filter((t: Transaction) => {
        const txDate = new Date(t.date)
        return txDate.getMonth() + 1 === currentMonth && txDate.getFullYear() === currentYear
      }),
    [transactions, currentMonth, currentYear]
  )

  // Calculate totals for current month
  const { totalIncome, totalExpenses, netBalance } = useMemo(() => {
    const income = currentMonthTransactions
      .filter((t: Transaction) => t.type === TRANSACTION_TYPE.INCOME)
      .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0)

    const expenses = currentMonthTransactions
      .filter((t: Transaction) => t.type === TRANSACTION_TYPE.EXPENSE)
      .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0)

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: income - expenses,
    }
  }, [currentMonthTransactions])

  // Monthly data for bar chart
  const monthlyData = useMemo((): MonthlyDataPoint[] => {
    const yearTransactions = transactions.filter((t: Transaction) => {
      const txDate = new Date(t.date)
      return txDate.getFullYear() === selectedYear
    })

    return MONTHS.map((month) => {
      const monthTransactions = yearTransactions.filter((t: Transaction) => {
        const txDate = new Date(t.date)
        return txDate.getMonth() + 1 === month.value
      })

      const income = monthTransactions
        .filter((t: Transaction) => t.type === TRANSACTION_TYPE.INCOME)
        .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0)

      const expense = monthTransactions
        .filter((t: Transaction) => t.type === TRANSACTION_TYPE.EXPENSE)
        .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0)

      return {
        name: month.label.substring(0, 3),
        income,
        expense,
      }
    })
  }, [transactions, selectedYear])

  // Category breakdown for pie chart (current month only)
  const categoryData = useMemo((): CategoryDataPoint[] => {
    const expenseTransactions = currentMonthTransactions.filter(
      (t: Transaction) => t.type === TRANSACTION_TYPE.EXPENSE
    )

    const categoryTotals: Record<string, number> = {}

    expenseTransactions.forEach((t: Transaction) => {
      const categoryName = t.category?.name || 'Uncategorized'
      categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + Number(t.amount)
    })

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8) // Top 8 categories
  }, [currentMonthTransactions])

  // Budget progress items for the list component
  const budgetProgressItems: BudgetProgressItem[] = budgetProgress.map(
    (bp: BudgetProgressType) => ({
      budgetId: bp.budgetId,
      categoryName: bp.category?.name || 'Budget',
      spentAmount: Number(bp.spentAmount),
      budgetAmount: Number(bp.budgetAmount),
    })
  )

  // Recent transactions for the list component
  const recentTransactions: RecentTransactionItem[] = transactions
    .slice(0, 5)
    .map((t: Transaction) => ({
      id: t.id,
      title: t.title,
      categoryName: t.category?.name || 'Uncategorized',
      date: new Date(t.date)
        .toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
        .replace(',', ''),
      type: t.type,
      amount: Number(t.amount),
    }))

  // Stats data for cards
  const stats = [
    {
      title: `${currentMonthName} Income`,
      amount: totalIncome,
      icon: <IncomeIcon fontSize="large" />,
      color: '#22c55e',
      type: 'income' as const,
    },
    {
      title: `${currentMonthName} Expenses`,
      amount: totalExpenses,
      icon: <ExpenseIcon fontSize="large" />,
      color: '#ef4444',
      type: 'expense' as const,
    },
    {
      title: `${currentMonthName} Balance`,
      amount: netBalance,
      icon: <BalanceIcon fontSize="large" />,
      color: '#3b82f6',
      type: 'balance' as const,
    },
    {
      title: `${currentMonthName} Budgets`,
      amount: `${budgetProgress.length} Active`,
      icon: <BudgetIcon fontSize="large" />,
      color: '#8b5cf6',
      isCurrency: false,
    },
  ]

  // Handlers
  const handleYearChange = (year: number) => {
    setSelectedYear(year)
  }

  // User name
  const userName = user?.name || 'User'

  return (
    <Box className={styles.dashboard}>
      {/* Welcome Message */}
      <WelcomeMessage userName={userName} />

      <LoadingOverlay loading={isLoading} minHeight={200}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>

        {/* Charts Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Monthly Bar Chart */}
          <Grid item xs={12} lg={8}>
            <MonthlyBarChart
              data={monthlyData}
              selectedYear={selectedYear}
              yearOptions={yearOptions}
              onYearChange={handleYearChange}
            />
          </Grid>

          {/* Category Pie Chart */}
          <Grid item xs={12} lg={4}>
            <CategoryPieChart data={categoryData} />
          </Grid>
        </Grid>

        {/* Budget Progress Section */}
        <BudgetProgressList items={budgetProgressItems} monthName={currentMonthName} />

        {/* Recent Transactions */}
        <RecentTransactions transactions={recentTransactions} />
      </LoadingOverlay>
    </Box>
  )
}

export default Dashboard
