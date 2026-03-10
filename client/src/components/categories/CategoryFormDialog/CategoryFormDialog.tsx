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
} from '@mui/material'
import type { CategoryEntryFormDto, CategoryEditFormDto } from '../../../utilities/models'
import { TRANSACTION_TYPE_OPTIONS } from '../../../utilities/constants'

interface CategoryFormDialogProps {
  open: boolean
  isEditing: boolean
  isShowHelperText: boolean
  formData: CategoryEntryFormDto | CategoryEditFormDto
  onInputChange: (property: string, value: string) => void
  onInputFocus: (property: string) => void
  onClose: () => void
  onSubmit: () => void
}

const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
  open,
  isEditing,
  isShowHelperText,
  formData,
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
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>{isEditing ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category Name"
                value={formData.name.value}
                onChange={(e) => onInputChange('name', e.target.value)}
                onFocus={() => onInputFocus('name')}
                error={isShowHelperText && !!formData.name.error}
                helperText={isShowHelperText && formData.name.error ? formData.name.error : ''}
                required={formData.name.isRequired}
                disabled={formData.name.disable}
              />
            </Grid>
            <Grid item xs={12}>
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
                {TRANSACTION_TYPE_OPTIONS.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
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

export default CategoryFormDialog
