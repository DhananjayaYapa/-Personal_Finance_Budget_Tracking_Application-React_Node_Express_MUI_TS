import React from 'react'
import { Box, Typography, LinearProgress } from '@mui/material'
import { formatCurrency } from '../../../utilities/helpers'

interface BudgetProgressProps {
  name: string
  spent: number
  limit: number
  color?: string
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({
  name,
  spent,
  limit,
  color = '#22c55e',
}) => {
  const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
  const isOverBudget = spent > limit

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2">{name}</Typography>
        <Typography variant="body2" color={isOverBudget ? 'error.main' : 'text.secondary'}>
          {formatCurrency(spent)} / {formatCurrency(limit)}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: 'rgba(255,255,255,0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            bgcolor: isOverBudget ? 'error.main' : color,
          },
        }}
      />
    </Box>
  )
}

export default BudgetProgress
