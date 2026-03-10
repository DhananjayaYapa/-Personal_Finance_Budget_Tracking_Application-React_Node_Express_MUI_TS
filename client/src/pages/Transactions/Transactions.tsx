import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Alert } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { transactionActions, categoryActions, alertActions } from '../../redux/actions'
import type { RootState } from '../../redux/store'
import type {
  Transaction,
  Category,
  TransactionEntryFormDto,
  TransactionEditFormDto,
  CreateTransactionRequestDto,
  UpdateTransactionRequestDto,
} from '../../utilities/models'
import {
  INITIAL_TRANSACTION_FORM_STATE,
  INITIAL_TRANSACTION_EDIT_STATE,
} from '../../utilities/models'
import { PageHeader, LoadingOverlay, ConfirmationDialog } from '../../components/shared'
import {
  TransactionFilters,
  TransactionTable,
  TransactionFormDialog,
} from '../../components/transactions'
import { TRANSACTION_TYPE } from '../../utilities/constants'
import { validateControlledFormData } from '../../utilities/helpers'
import styles from './Transactions.module.scss'

const Transactions: React.FC = () => {
  const dispatch = useDispatch()

  // Selectors
  const transactionState = useSelector((state: RootState) => state.transaction)
  const categoryState = useSelector((state: RootState) => state.category)
  const createAlert = useSelector((state: RootState) => state.alert.createTransactionAlert)
  const updateAlert = useSelector((state: RootState) => state.alert.updateTransactionAlert)
  const deleteAlert = useSelector((state: RootState) => state.alert.deleteTransactionAlert)

  const transactions = transactionState.transactions || []
  const categories = categoryState.categories || []
  const isLoading = transactionState.isLoading

  // Form states (Athena controlled component pattern)
  const [transactionFormData, setTransactionFormData] = useState<TransactionEntryFormDto>(
    INITIAL_TRANSACTION_FORM_STATE()
  )
  const [editingFormData, setEditingFormData] = useState<TransactionEditFormDto>(
    INITIAL_TRANSACTION_EDIT_STATE()
  )

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isShowHelperText, setIsShowHelperText] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Initial fetch
  useEffect(() => {
    dispatch(transactionActions.fetchTransactions({ limit: 100 }))
    dispatch(categoryActions.fetchCategories())
  }, [dispatch])

  // Reset form on successful create
  useEffect(() => {
    if (createAlert?.severity === 'success') {
      setTransactionFormData(INITIAL_TRANSACTION_FORM_STATE())
      dispatch(transactionActions.fetchTransactions({ limit: 100 }))
    }
  }, [createAlert, dispatch])

  // Refresh list on successful update
  useEffect(() => {
    if (updateAlert?.severity === 'success') {
      dispatch(transactionActions.fetchTransactions({ limit: 100 }))
    }
  }, [updateAlert, dispatch])

  // Form input handlers
  const handleInputFocus = (property: string) => {
    if (isEditing) {
      setEditingFormData((prev) => ({
        ...prev,
        [property]: {
          ...prev[property as keyof TransactionEditFormDto],
          error: null,
        },
      }))
    } else {
      setTransactionFormData((prev) => ({
        ...prev,
        [property]: {
          ...prev[property as keyof TransactionEntryFormDto],
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
          ...prev[property as keyof TransactionEditFormDto],
          value,
        },
      }))
    } else {
      setTransactionFormData((prev) => ({
        ...prev,
        [property]: {
          ...prev[property as keyof TransactionEntryFormDto],
          value,
        },
      }))
    }
  }

  // Filtered transactions
  const filteredTransactions = useMemo(
    () =>
      transactions.filter((t: Transaction) => {
        const matchesSearch =
          !searchQuery ||
          t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = !typeFilter || t.type === typeFilter
        const matchesCategory = !categoryFilter || t.categoryId === categoryFilter

        // Date range filter
        const transactionDate = t.date ? new Date(t.date) : null
        const start = startDate ? new Date(startDate) : null
        const end = endDate ? new Date(endDate) : null

        const matchesDateRange =
          (!start || (transactionDate && transactionDate >= start)) &&
          (!end || (transactionDate && transactionDate <= new Date(end.getTime() + 86400000 - 1)))

        return matchesSearch && matchesType && matchesCategory && matchesDateRange
      }),
    [transactions, searchQuery, typeFilter, categoryFilter, startDate, endDate]
  )

  // Paginated transactions
  const paginatedTransactions = useMemo(
    () => filteredTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredTransactions, page, rowsPerPage]
  )

  // Open Create dialog
  const handleOpenCreate = () => {
    setIsEditing(false)
    setTransactionFormData(INITIAL_TRANSACTION_FORM_STATE())
    setFormDialogOpen(true)
  }

  // Open Edit dialog
  const handleOpenEdit = (transaction: Transaction) => {
    setIsEditing(true)
    setEditingFormData({
      transactionId: {
        value: transaction.id,
        isRequired: true,
        error: null,
        disable: false,
      },
      title: {
        value: transaction.title || '',
        validator: 'text',
        isRequired: true,
        error: null,
        disable: false,
      },
      amount: {
        value: Number(transaction.amount),
        validator: 'amount',
        isRequired: true,
        error: null,
        disable: false,
      },
      type: {
        value: transaction.type,
        validator: 'select',
        isRequired: true,
        error: null,
        disable: false,
      },
      categoryId: {
        value: transaction.categoryId || '',
        validator: 'select',
        isRequired: true,
        error: null,
        disable: false,
      },
      date: {
        value: transaction.date?.split('T')[0] || new Date().toISOString().split('T')[0],
        validator: 'date',
        isRequired: true,
        error: null,
        disable: false,
      },
      note: {
        value: transaction.note || '',
        validator: 'text',
        isRequired: false,
        error: null,
        disable: false,
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
      dispatch(transactionActions.deleteTransaction({ id: deletingId }))
      setTimeout(() => {
        dispatch(transactionActions.fetchTransactions({ limit: 100 }))
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
        const updateTransactionParams: UpdateTransactionRequestDto = {
          title: editingFormData.title.value,
          amount: Number(editingFormData.amount.value),
          type: editingFormData.type.value,
          categoryId: editingFormData.categoryId.value,
          date: editingFormData.date.value,
          note: editingFormData.note.value || undefined,
        }
        dispatch(
          transactionActions.updateTransaction({
            id: editingFormData.transactionId.value,
            data: updateTransactionParams,
          })
        )
        handleCloseForm()
      }
    } else {
      const [validatedData, isValid] = await validateControlledFormData(transactionFormData)
      setTransactionFormData(validatedData)

      if (isValid) {
        const createTransactionParams: CreateTransactionRequestDto = {
          title: transactionFormData.title.value,
          amount: Number(transactionFormData.amount.value),
          type: transactionFormData.type.value,
          categoryId: transactionFormData.categoryId.value,
          date: transactionFormData.date.value,
          note: transactionFormData.note.value || undefined,
        }
        dispatch(transactionActions.createTransaction(createTransactionParams))
        handleCloseForm()
      }
    }
  }

  // Alert handlers
  const handleClearCreateAlert = () => {
    dispatch(alertActions.clearCreateTransactionAlert())
  }

  const handleClearUpdateAlert = () => {
    dispatch(alertActions.clearUpdateTransactionAlert())
  }

  const handleClearDeleteAlert = () => {
    dispatch(alertActions.clearDeleteTransactionAlert())
  }

  // Filter handlers
  const handleResetFilters = () => {
    setSearchQuery('')
    setTypeFilter('')
    setCategoryFilter('')
    setStartDate('')
    setEndDate('')
  }

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage)
    setPage(0)
  }

  // Get current form data based on editing state
  const currentFormData = isEditing ? editingFormData : transactionFormData

  // Filter categories based on selected type
  const getFilteredCategories = () => {
    const selectedType = currentFormData.type.value
    if (selectedType === TRANSACTION_TYPE.INCOME) {
      return categories.filter((c: Category) => c.type === TRANSACTION_TYPE.INCOME)
    } else if (selectedType === TRANSACTION_TYPE.EXPENSE) {
      return categories.filter((c: Category) => c.type === TRANSACTION_TYPE.EXPENSE)
    }
    return categories
  }

  return (
    <Box className={styles.transactionsPage}>
      <PageHeader
        title="Transactions"
        subtitle="Manage your income and expenses"
        actionLabel="Add Transaction"
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
      <TransactionFilters
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        categoryFilter={categoryFilter}
        startDate={startDate}
        endDate={endDate}
        categories={categories}
        onSearchChange={setSearchQuery}
        onTypeChange={setTypeFilter}
        onCategoryChange={setCategoryFilter}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onReset={handleResetFilters}
      />

      {/* Transactions Table */}
      <LoadingOverlay loading={isLoading}>
        <TransactionTable
          transactions={paginatedTransactions}
          totalCount={filteredTransactions.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      </LoadingOverlay>

      {/* Create/Edit Dialog */}
      <TransactionFormDialog
        open={formDialogOpen}
        isEditing={isEditing}
        isShowHelperText={isShowHelperText}
        formData={currentFormData}
        categories={getFilteredCategories()}
        onInputChange={handleInputChange}
        onInputFocus={handleInputFocus}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        type="transaction"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDelete}
      />
    </Box>
  )
}

export default Transactions
