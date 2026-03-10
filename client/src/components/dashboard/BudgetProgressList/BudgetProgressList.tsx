import React from 'react'
import { Box, Card, CardContent, Typography } from '@mui/material'
import BudgetProgress from '../BudgetProgress'

export interface BudgetProgressItem {
  budgetId: string
  categoryName: string
  spentAmount: number
  budgetAmount: number
}

interface BudgetProgressListProps {
  items: BudgetProgressItem[]
  monthName: string
}

const BudgetProgressList: React.FC<BudgetProgressListProps> = ({ items, monthName }) => {
  if (items.length === 0) return null

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Budget Usage ({monthName})
        </Typography>
        <Box
          sx={{
            maxHeight: items.length > 5 ? 300 : 'none',
            overflowY: items.length > 5 ? 'auto' : 'visible',
            pr: items.length > 5 ? 1 : 0,
            '&::-webkit-scrollbar': {
              width: 6,
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 3,
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(34, 197, 94, 0.4)',
              borderRadius: 3,
              '&:hover': {
                background: 'rgba(34, 197, 94, 0.6)',
              },
            },
          }}
        >
          {items.map((item) => (
            <BudgetProgress
              key={item.budgetId}
              name={item.categoryName}
              spent={item.spentAmount}
              limit={item.budgetAmount}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default BudgetProgressList
