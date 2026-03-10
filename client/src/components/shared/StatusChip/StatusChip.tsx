import React from 'react'
import { Chip } from '@mui/material'

type StatusType = 'income' | 'expense' | 'active' | 'inactive' | 'warning' | 'default'

interface StatusChipProps {
  status: StatusType
  label?: string
  size?: 'small' | 'medium'
}

const getStatusConfig = (status: StatusType) => {
  switch (status) {
    case 'income':
      return { color: 'success' as const, label: 'Income' }
    case 'expense':
      return { color: 'error' as const, label: 'Expense' }
    case 'active':
      return { color: 'success' as const, label: 'Active' }
    case 'inactive':
      return { color: 'default' as const, label: 'Inactive' }
    case 'warning':
      return { color: 'warning' as const, label: 'Warning' }
    default:
      return { color: 'default' as const, label: 'Unknown' }
  }
}

const StatusChip: React.FC<StatusChipProps> = ({ status, label, size = 'small' }) => {
  const config = getStatusConfig(status)

  return (
    <Chip
      label={label || config.label}
      color={config.color}
      size={size}
      sx={{ fontWeight: 500 }}
    />
  )
}

export default StatusChip
