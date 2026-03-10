import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material'

export type ConfirmationDialogType = 'transaction' | 'budget' | 'category'

interface ConfirmationDialogProps {
  open: boolean
  type: ConfirmationDialogType
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

const DIALOG_CONFIG: Record<
  ConfirmationDialogType,
  { title: string; message: string; confirmLabel: string }
> = {
  transaction: {
    title: 'Delete Transaction',
    message: 'Are you sure you want to delete this transaction? This action cannot be undone.',
    confirmLabel: 'Delete',
  },
  budget: {
    title: 'Delete Budget',
    message: 'Are you sure you want to delete this budget? This action cannot be undone.',
    confirmLabel: 'Delete',
  },
  category: {
    title: 'Delete Category',
    message:
      'Are you sure you want to delete this category? Transactions using this category will become uncategorized.',
    confirmLabel: 'Delete',
  },
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  type,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const config = DIALOG_CONFIG[type]

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{config.title}</DialogTitle>
      <DialogContent>
        <Typography>{config.message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={isLoading}>
          {config.confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
