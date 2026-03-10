import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Card, CardContent, Grid, Typography, Alert } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { budgetActions, categoryActions, alertActions } from '../../redux/actions'
import type { RootState } from '../../redux/store'
import type {
  Budget,
  BudgetProgress,
  Category,
  BudgetEntryFormDto,
  BudgetEditFormDto,
  CreateBudgetRequestDto,
  UpdateBudgetRequestDto,
} from '../../utilities/models'
import { INITIAL_BUDGET_FORM_STATE, INITIAL_BUDGET_EDIT_STATE } from '../../utilities/models'
import { PageHeader, LoadingOverlay, ConfirmationDialog } from '../../components/shared'
import {
  ExpandableBudgetCard,
  BudgetFilters,
  BudgetFormDialog,
  type ProcessedBudgetGroup,
} from '../../components/budgets'
import { getYearOptions, TRANSACTION_TYPE } from '../../utilities/constants'
import { validateControlledFormData } from '../../utilities/helpers'
import styles from './Budgets.module.scss'

const Budgets: React.FC = () => {
  const dispatch = useDispatch()

  // Selectors
  const budgetState = useSelector((state: RootState) => state.budget)
  const categoryState = useSelector((state: RootState) => state.category)
  const createAlert = useSelector((state: RootState) => state.alert.createBudgetAlert)
  const updateAlert = useSelector((state: RootState) => state.alert.updateBudgetAlert)
  const deleteAlert = useSelector((state: RootState) => state.alert.deleteBudgetAlert)

  const budgets = budgetState.budgets || []
  const budgetProgress = budgetState.budgetProgress || []
  const categories = categoryState.categories || []
  const isLoading = budgetState.isLoading

  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  // Form states (Athena controlled component pattern)
  const [budgetFormData, setBudgetFormData] = useState<BudgetEntryFormDto>(
    INITIAL_BUDGET_FORM_STATE(currentMonth, currentYear)
  )
  const [editingFormData, setEditingFormData] = useState<BudgetEditFormDto>(
    INITIAL_BUDGET_EDIT_STATE(currentMonth, currentYear)
  )

  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isShowHelperText, setIsShowHelperText] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [monthFilter, setMonthFilter] = useState<number | ''>('')
  const [yearFilter, setYearFilter] = useState<number | ''>('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // Initial fetch of budgets and categories
  useEffect(() => {
    dispatch(budgetActions.fetchBudgets())
    dispatch(categoryActions.fetchCategories())
  }, [dispatch])

  // Fetch budget progress when budgets change
  useEffect(() => {
    if (budgets.length > 0) {
      dispatch(budgetActions.fetchAllBudgetProgress())
    }
  }, [dispatch, budgets.length])

  // Reset form on successful create
  useEffect(() => {
    if (createAlert?.severity === 'success') {
      setBudgetFormData(INITIAL_BUDGET_FORM_STATE(currentMonth, currentYear))
      dispatch(budgetActions.fetchBudgets())
      dispatch(budgetActions.fetchAllBudgetProgress())
    }
  }, [createAlert, currentMonth, currentYear, dispatch])

  // Refresh list on successful update
  useEffect(() => {
    if (updateAlert?.severity === 'success') {
      dispatch(budgetActions.fetchBudgets())
      dispatch(budgetActions.fetchAllBudgetProgress())
    }
  }, [updateAlert, dispatch])

  // Form input handlers
  const handleInputFocus = (property: string) => {
    if (isEditing) {
      setEditingFormData((prev) => ({
        ...prev,
        [property]: {
          ...prev[property as keyof BudgetEditFormDto],
          error: null,
        },
      }))
    } else {
      setBudgetFormData((prev) => ({
        ...prev,
        [property]: {
          ...prev[property as keyof BudgetEntryFormDto],
          error: null,
        },
      }))
    }
  }

  const handleInputChange = (property: string, value: string | number) => {
    if (isEditing) {
      setEditingFormData((prev) => ({
        ...prev,
        [property]: {
          ...prev[property as keyof BudgetEditFormDto],
          value,
        },
      }))
    } else {
      setBudgetFormData((prev) => ({
        ...prev,
        [property]: {
          ...prev[property as keyof BudgetEntryFormDto],
          value,
        },
      }))
    }
  }

  // Open Create dialog
  const handleOpenCreate = () => {
    setIsEditing(false)
    setBudgetFormData(INITIAL_BUDGET_FORM_STATE(currentMonth, currentYear))
    setFormDialogOpen(true)
  }

  // Open Edit dialog
  const handleOpenEdit = (budget: Budget) => {
    setIsEditing(true)
    setEditingFormData({
      budgetId: {
        value: budget.id,
        isRequired: true,
        error: null,
        disable: false,
      },
      categoryId: {
        value: budget.categoryId || '',
        validator: 'select',
        isRequired: false,
        error: null,
        disable: true,
      },
      amount: {
        value: Number(budget.amount),
        validator: 'amount',
        isRequired: true,
        error: null,
        disable: false,
      },
      month: {
        value: budget.month,
        validator: 'select',
        isRequired: false,
        error: null,
        disable: true,
      },
      year: {
        value: budget.year,
        validator: 'select',
        isRequired: false,
        error: null,
        disable: true,
      },
    })
    setFormDialogOpen(true)
  }

  const handleCloseForm = () => {
    setFormDialogOpen(false)
    setIsEditing(false)
  }

  // Delete handlers
  const handleOpenDelete = (id: string) => {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false)
    setDeletingId(null)
  }

  const handleConfirmDelete = () => {
    if (deletingId) {
      dispatch(budgetActions.deleteBudget({ id: deletingId }))
      setTimeout(() => {
        dispatch(budgetActions.fetchBudgets())
        dispatch(budgetActions.fetchAllBudgetProgress())
      }, 500)
    }
    handleCloseDelete()
  }

  // Form submit with validation
  const handleFormSubmit = async () => {
    setIsShowHelperText(true)
    if (isEditing) {
      const [validatedData, isValid] = await validateControlledFormData(editingFormData)
      setEditingFormData(validatedData)

      if (isValid) {
        const updateBudgetParams: UpdateBudgetRequestDto = {
          amount: Number(editingFormData.amount.value),
        }
        dispatch(
          budgetActions.updateBudget({
            id: editingFormData.budgetId.value,
            data: updateBudgetParams,
          })
        )
        handleCloseForm()
      }
    } else {
      const [validatedData, isValid] = await validateControlledFormData(budgetFormData)
      setBudgetFormData(validatedData)

      if (isValid) {
        const createBudgetParams: CreateBudgetRequestDto = {
          categoryId: budgetFormData.categoryId.value,
          amount: Number(budgetFormData.amount.value),
          month: budgetFormData.month.value,
          year: budgetFormData.year.value,
        }
        dispatch(budgetActions.createBudget(createBudgetParams))
        handleCloseForm()
      }
    }
  }

  // Alert handlers
  const handleClearCreateAlert = () => {
    dispatch(alertActions.clearCreateBudgetAlert())
  }

  const handleClearUpdateAlert = () => {
    dispatch(alertActions.clearUpdateBudgetAlert())
  }

  const handleClearDeleteAlert = () => {
    dispatch(alertActions.clearDeleteBudgetAlert())
  }

  // Filter handlers
  const handleResetFilters = () => {
    setSearchQuery('')
    setMonthFilter('')
    setYearFilter('')
    setCategoryFilter('')
  }

  // Derived data
  const expenseCategories = categories.filter((c: Category) => c.type === TRANSACTION_TYPE.EXPENSE)

  const filteredBudgets = useMemo(
    () =>
      budgets.filter((b: Budget) => {
        const matchesSearch =
          !searchQuery || b.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesMonth = monthFilter === '' || b.month === monthFilter
        const matchesYear = yearFilter === '' || b.year === yearFilter
        const matchesCategory = !categoryFilter || b.categoryId === categoryFilter
        return matchesSearch && matchesMonth && matchesYear && matchesCategory
      }),
    [budgets, searchQuery, monthFilter, yearFilter, categoryFilter]
  )

  const getProgressForBudget = (budgetId: string): BudgetProgress | undefined => {
    return budgetProgress.find((p: BudgetProgress) => p.budgetId === budgetId)
  }

  const processedBudgetGroups = useMemo(() => {
    // Group budgets by category
    const groups: Record<string, Budget[]> = {}
    filteredBudgets.forEach((budget: Budget) => {
      const categoryId = budget.categoryId || 'uncategorized'
      if (!groups[categoryId]) {
        groups[categoryId] = []
      }
      groups[categoryId].push(budget)
    })

    // Process each group to compute primary budget, other budgets
    return Object.values(groups).map((budgets): ProcessedBudgetGroup => {
      // Sort budgets by date (year, month)
      const sortedBudgets = [...budgets].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year
        return a.month - b.month
      })

      // Find the primary budget (current month or closest future)
      let primaryBudget = sortedBudgets.find(
        (b) => b.month === currentMonth && b.year === currentYear
      )

      if (!primaryBudget) {
        // Find closest future budget
        const futureBudgets = sortedBudgets.filter(
          (b) => b.year > currentYear || (b.year === currentYear && b.month > currentMonth)
        )
        primaryBudget =
          futureBudgets.length > 0 ? futureBudgets[0] : sortedBudgets[sortedBudgets.length - 1]
      }

      const otherBudgets = sortedBudgets.filter((b) => b.id !== primaryBudget!.id)
      const hasMultiple = budgets.length > 1

      return { primaryBudget: primaryBudget!, otherBudgets, hasMultiple }
    })
  }, [filteredBudgets, currentMonth, currentYear])

  const yearOptions = getYearOptions()

  // Get current form data based on editing state
  const currentFormData = isEditing ? editingFormData : budgetFormData

  return (
    <Box className={styles.budgetsPage}>
      <PageHeader
        title="Budgets"
        subtitle="Set spending limits for your categories"
        actionLabel="Add Budget"
        actionIcon={<AddIcon />}
        onAction={handleOpenCreate}
      />

      {/* Alerts */}
      {createAlert?.message && (
        <Alert
          severity={createAlert.severity || 'info'}
          onClose={handleClearCreateAlert}
          sx={{ mb: 2 }}
        >
          {createAlert.message}
        </Alert>
      )}
      {updateAlert?.message && (
        <Alert
          severity={updateAlert.severity || 'info'}
          onClose={handleClearUpdateAlert}
          sx={{ mb: 2 }}
        >
          {updateAlert.message}
        </Alert>
      )}
      {deleteAlert?.message && (
        <Alert
          severity={deleteAlert.severity || 'info'}
          onClose={handleClearDeleteAlert}
          sx={{ mb: 2 }}
        >
          {deleteAlert.message}
        </Alert>
      )}

      {/* Filters */}
      <BudgetFilters
        searchQuery={searchQuery}
        monthFilter={monthFilter}
        yearFilter={yearFilter}
        categoryFilter={categoryFilter}
        categories={expenseCategories}
        yearOptions={yearOptions}
        onSearchChange={setSearchQuery}
        onMonthChange={setMonthFilter}
        onYearChange={setYearFilter}
        onCategoryChange={setCategoryFilter}
        onReset={handleResetFilters}
      />

      <LoadingOverlay loading={isLoading}>
        {processedBudgetGroups.length === 0 ? (
          <Card>
            <CardContent sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="text.secondary">
                {budgets.length === 0
                  ? 'No budgets yet. Create a budget to start tracking your spending!'
                  : 'No budgets match your filters'}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3} alignItems="flex-start">
            {processedBudgetGroups.map((group) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={group.primaryBudget.categoryId || group.primaryBudget.id}
                className={styles.gridItem}
              >
                <ExpandableBudgetCard
                  processedGroup={group}
                  getProgress={getProgressForBudget}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </LoadingOverlay>

      {/* Create/Edit Dialog */}
      <BudgetFormDialog
        open={formDialogOpen}
        isEditing={isEditing}
        isShowHelperText={isShowHelperText}
        formData={currentFormData}
        categories={expenseCategories}
        yearOptions={yearOptions}
        onInputChange={handleInputChange}
        onInputFocus={handleInputFocus}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        type="budget"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDelete}
      />
    </Box>
  )
}

export default Budgets
