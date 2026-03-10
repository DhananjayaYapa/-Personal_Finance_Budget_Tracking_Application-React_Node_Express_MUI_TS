import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
} from '@mui/material'
import type { Category, BudgetEntryFormDto, BudgetEditFormDto } from '../../../utilities/models'
import { MONTHS } from '../../../utilities/constants'

interface YearOption {
  value: number
  label: string
}

interface BudgetFormDialogProps {
  open: boolean
  isEditing: boolean
  isShowHelperText: boolean
  formData: BudgetEntryFormDto | BudgetEditFormDto
  categories: Category[]
  yearOptions: YearOption[]
  onInputChange: (property: string, value: string | number) => void
  onInputFocus: (property: string) => void
  onClose: () => void
  onSubmit: () => void
}

const BudgetFormDialog: React.FC<BudgetFormDialogProps> = ({
  open,
  isEditing,
  isShowHelperText,
  formData,
  categories,
  yearOptions,
  onInputChange,
  onInputFocus,
  onClose,
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>{isEditing ? 'Edit Budget' : 'Add Budget'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Category"
                value={formData.categoryId.value}
                onChange={(e) => onInputChange('categoryId', e.target.value)}
                onFocus={() => onInputFocus('categoryId')}
                error={isShowHelperText && !!formData.categoryId.error}
                helperText={isShowHelperText && formData.categoryId.error ? formData.categoryId.error : ''}
                required={formData.categoryId.isRequired}
                disabled={formData.categoryId.disable}
              >
                {categories.map((cat: Category) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Budget Amount"
                value={formData.amount.value}
                onChange={(e) => onInputChange('amount', e.target.value)}
                onFocus={() => onInputFocus('amount')}
                error={isShowHelperText && !!formData.amount.error}
                helperText={isShowHelperText && formData.amount.error ? formData.amount.error : ''}
                required={formData.amount.isRequired}
                disabled={formData.amount.disable}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Month"
                value={formData.month.value}
                onChange={(e) => onInputChange('month', Number(e.target.value))}
                onFocus={() => onInputFocus('month')}
                error={isShowHelperText && !!formData.month.error}
                helperText={isShowHelperText && formData.month.error ? formData.month.error : ''}
                required={formData.month.isRequired}
                disabled={formData.month.disable}
              >
                {MONTHS.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Year"
                value={formData.year.value}
                onChange={(e) => onInputChange('year', Number(e.target.value))}
                onFocus={() => onInputFocus('year')}
                error={isShowHelperText && !!formData.year.error}
                helperText={isShowHelperText && formData.year.error ? formData.year.error : ''}
                required={formData.year.isRequired}
                disabled={formData.year.disable}
              >
                {yearOptions.map((year) => (
                  <MenuItem key={year.value} value={year.value}>
                    {year.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default BudgetFormDialog
