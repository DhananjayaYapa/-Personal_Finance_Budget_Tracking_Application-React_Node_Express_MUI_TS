import React from 'react'
import { Snackbar, Alert, AlertTitle } from '@mui/material'

interface AlertSnackbarProps {
  open: boolean
  message: string
  severity: 'success' | 'error' | 'warning' | 'info'
  title?: string
  autoHideDuration?: number
  onClose: () => void
}

const AlertSnackbar: React.FC<AlertSnackbarProps> = ({
  open,
  message,
  severity,
  title,
  autoHideDuration = 4000,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  )
}

export default AlertSnackbar
