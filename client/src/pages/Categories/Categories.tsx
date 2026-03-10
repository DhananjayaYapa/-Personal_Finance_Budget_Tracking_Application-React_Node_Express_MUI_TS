import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Card, CardContent, Grid, Typography, Alert } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { categoryActions, alertActions } from '../../redux/actions'
import type { RootState } from '../../redux/store'
import type {
  Category,
  CategoryEntryFormDto,
  CategoryEditFormDto,
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
} from '../../utilities/models'
import type { CategoryType } from '../../utilities/constants'
import { INITIAL_CATEGORY_FORM_STATE, INITIAL_CATEGORY_EDIT_STATE } from '../../utilities/models'
import { PageHeader, LoadingOverlay, ConfirmationDialog } from '../../components/shared'
import { CategoryFilters, CategoryCard, CategoryFormDialog } from '../../components/categories'
import { TRANSACTION_TYPE } from '../../utilities/constants'
import { validateControlledFormData } from '../../utilities/helpers'
import styles from './Categories.module.scss'

const Categories: React.FC = () => {
  const dispatch = useDispatch()

  // Selectors
  const categoryState = useSelector((state: RootState) => state.category)
  const createAlert = useSelector((state: RootState) => state.alert.createCategoryAlert)
  const updateAlert = useSelector((state: RootState) => state.alert.updateCategoryAlert)
  const deleteAlert = useSelector((state: RootState) => state.alert.deleteCategoryAlert)

  const categories = categoryState.categories || []
  const isLoading = categoryState.isLoading

  // Form states (Athena controlled component pattern)
  const [categoryFormData, setCategoryFormData] = useState<CategoryEntryFormDto>(
    INITIAL_CATEGORY_FORM_STATE()
  )
  const [editingFormData, setEditingFormData] = useState<CategoryEditFormDto>(
    INITIAL_CATEGORY_EDIT_STATE()
  )

  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isShowHelperText, setIsShowHelperText] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  // Initial fetch
  useEffect(() => {
    dispatch(categoryActions.fetchCategories())
  }, [dispatch])

  // Reset form on successful create
  useEffect(() => {
    if (createAlert?.severity === 'success') {
      setCategoryFormData(INITIAL_CATEGORY_FORM_STATE())
      dispatch(categoryActions.fetchCategories())
    }
  }, [createAlert, dispatch])

  // Refresh list on successful update
  useEffect(() => {
    if (updateAlert?.severity === 'success') {
      dispatch(categoryActions.fetchCategories())
    }
  }, [updateAlert, dispatch])

  // Form input handlers
  const handleInputFocus = (property: string) => {
    if (isEditing) {
      setEditingFormData((prev) => ({
        ...prev,
        [property]: {
          ...prev[property as keyof CategoryEditFormDto],
          error: null,
        },
      }))
    } else {
      setCategoryFormData((prev) => ({
        ...prev,
        [property]: {
          ...prev[property as keyof CategoryEntryFormDto],
          error: null,
        },
      }))
    }
  }

  const handleInputChange = (property: string, value: string) => {
    if (isEditing) {
      setEditingFormData((prev) => ({
        ...prev,
        [property]: {
          ...prev[property as keyof CategoryEditFormDto],
          value,
        },
      }))
    } else {
      setCategoryFormData((prev) => ({
        ...prev,
        [property]: {
          ...prev[property as keyof CategoryEntryFormDto],
          value,
        },
      }))
    }
  }

  // Filter and group categories
  const filteredCategories = useMemo(
    () =>
      categories.filter((c: Category) => {
        const matchesSearch =
          !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = !typeFilter || c.type === typeFilter
        return matchesSearch && matchesType
      }),
    [categories, searchQuery, typeFilter]
  )

  // Group filtered categories by type
  const incomeCategories = filteredCategories.filter(
    (c: Category) => c.type === TRANSACTION_TYPE.INCOME
  )
  const expenseCategories = filteredCategories.filter(
    (c: Category) => c.type === TRANSACTION_TYPE.EXPENSE
  )

  // Form handlers
  const handleOpenCreate = () => {
    setIsEditing(false)
    setCategoryFormData(INITIAL_CATEGORY_FORM_STATE())
    setFormDialogOpen(true)
  }

  const handleOpenEdit = (category: Category) => {
    setIsEditing(true)
    setEditingFormData({
      categoryId: {
        value: category.id,
        isRequired: true,
        error: null,
        disable: false,
      },
      name: {
        value: category.name,
        validator: 'text',
        isRequired: true,
        error: null,
        disable: false,
      },
      type: {
        value: category.type,
        validator: 'select',
        isRequired: true,
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
      dispatch(categoryActions.deleteCategory({ id: deletingId }))
      setTimeout(() => {
        dispatch(categoryActions.fetchCategories())
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
        const updateCategoryParams: UpdateCategoryRequestDto = {
          name: editingFormData.name.value,
          type: editingFormData.type.value as CategoryType,
        }
        dispatch(
          categoryActions.updateCategory({
            id: editingFormData.categoryId.value,
            data: updateCategoryParams,
          })
        )
        handleCloseForm()
      }
    } else {
      const [validatedData, isValid] = await validateControlledFormData(categoryFormData)
      setCategoryFormData(validatedData)

      if (isValid) {
        const createCategoryParams: CreateCategoryRequestDto = {
          name: categoryFormData.name.value,
          type: categoryFormData.type.value as CategoryType,
        }
        dispatch(categoryActions.createCategory(createCategoryParams))
        handleCloseForm()
      }
    }
  }

  // Alert handlers
  const handleClearCreateAlert = () => {
    dispatch(alertActions.clearCreateCategoryAlert())
  }

  const handleClearUpdateAlert = () => {
    dispatch(alertActions.clearUpdateCategoryAlert())
  }

  const handleClearDeleteAlert = () => {
    dispatch(alertActions.clearDeleteCategoryAlert())
  }

  // Filter handlers
  const handleResetFilters = () => {
    setSearchQuery('')
    setTypeFilter('')
  }

  // Get current form data based on editing state
  const currentFormData = isEditing ? editingFormData : categoryFormData

  return (
    <Box className={styles.categoriesPage}>
      <PageHeader
        title="Categories"
        subtitle="Organize your transactions by category"
        actionLabel="Add Category"
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
      <CategoryFilters
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        onSearchChange={setSearchQuery}
        onTypeChange={setTypeFilter}
        onReset={handleResetFilters}
      />

      <LoadingOverlay loading={isLoading}>
        {/* Income Categories */}
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Income Categories
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {incomeCategories.length === 0 ? (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" align="center">
                    No income categories yet
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            incomeCategories.map((category: Category) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                <CategoryCard
                  category={category}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                />
              </Grid>
            ))
          )}
        </Grid>

        {/* Expense Categories */}
        <Typography variant="h6" gutterBottom>
          Expense Categories
        </Typography>
        <Grid container spacing={2}>
          {expenseCategories.length === 0 ? (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" align="center">
                    No expense categories yet
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            expenseCategories.map((category: Category) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                <CategoryCard
                  category={category}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                />
              </Grid>
            ))
          )}
        </Grid>
      </LoadingOverlay>

      {/* Create/Edit Dialog */}
      <CategoryFormDialog
        open={formDialogOpen}
        isEditing={isEditing}
        isShowHelperText={isShowHelperText}
        formData={currentFormData}
        onInputChange={handleInputChange}
        onInputFocus={handleInputFocus}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        type="category"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDelete}
      />
    </Box>
  )
}

export default Categories
