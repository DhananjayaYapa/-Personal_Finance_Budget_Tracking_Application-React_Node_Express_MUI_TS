import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
} from '@mui/material'
import type {
  Category,
  TransactionEntryFormDto,
  TransactionEditFormDto,
} from '../../../utilities/models'
import { TRANSACTION_TYPE_OPTIONS } from '../../../utilities/constants'

interface TransactionFormDialogProps {
  open: boolean
  isEditing: boolean
  isShowHelperText: boolean
  formData: TransactionEntryFormDto | TransactionEditFormDto
  categories: Category[]
  onInputChange: (property: string, value: string | number) => void
  onInputFocus: (property: string) => void
  onClose: () => void
  onSubmit: () => void
}

const TransactionFormDialog: React.FC<TransactionFormDialogProps> = ({
  open,
  isEditing,
  isShowHelperText,
  formData,
  categories,
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
        <DialogTitle>{isEditing ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title.value}
                onChange={(e) => onInputChange('title', e.target.value)}
                onFocus={() => onInputFocus('title')}
                error={isShowHelperText && !!formData.title.error}
                helperText={isShowHelperText && formData.title.error ? formData.title.error : ''}
                required={formData.title.isRequired}
                disabled={formData.title.disable}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Type"
                value={formData.type.value}
                onChange={(e) => onInputChange('type', e.target.value)}
                onFocus={() => onInputFocus('type')}
                error={isShowHelperText && !!formData.type.error}
                helperText={isShowHelperText && formData.type.error ? formData.type.error : ''}
                required={formData.type.isRequired}
                disabled={formData.type.disable}
              >
                {TRANSACTION_TYPE_OPTIONS.map((type: { value: string; label: string }) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Amount"
                value={formData.amount.value}
                onChange={(e) => onInputChange('amount', e.target.value)}
                onFocus={() => onInputFocus('amount')}
                error={isShowHelperText && !!formData.amount.error}
                helperText={isShowHelperText && formData.amount.error ? formData.amount.error : ''}
                required={formData.amount.isRequired}
                disabled={formData.amount.disable}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                InputLabelProps={{ shrink: true }}
                value={formData.date.value}
                onChange={(e) => onInputChange('date', e.target.value)}
                onFocus={() => onInputFocus('date')}
                error={isShowHelperText && !!formData.date.error}
                helperText={isShowHelperText && formData.date.error ? formData.date.error : ''}
                required={formData.date.isRequired}
                disabled={formData.date.disable}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Note (Optional)"
                multiline
                rows={2}
                value={formData.note.value}
                onChange={(e) => onInputChange('note', e.target.value)}
                onFocus={() => onInputFocus('note')}
                error={isShowHelperText && !!formData.note.error}
                helperText={isShowHelperText && formData.note.error ? formData.note.error : ''}
                disabled={formData.note.disable}
              />
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

export default TransactionFormDialog
