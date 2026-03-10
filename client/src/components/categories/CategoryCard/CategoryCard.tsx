import React from 'react'
import { Box, Card, CardContent, Typography, IconButton, Chip } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import type { Category } from '../../../utilities/models'
import { TRANSACTION_TYPE } from '../../../utilities/constants'

interface CategoryCardProps {
  category: Category
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit, onDelete }) => {
  const isIncome = category.type === TRANSACTION_TYPE.INCOME

  return (
    <Card
      sx={{
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: isIncome ? '#22c55e' : '#ef4444',
              }}
            />
            <Typography variant="subtitle1" fontWeight={500}>
              {category.name}
            </Typography>
          </Box>
          <Box>
            <IconButton size="small" onClick={() => onEdit(category)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(category.id)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Chip
          label={isIncome ? 'Income' : 'Expense'}
          size="small"
          color={isIncome ? 'success' : 'error'}
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  )
}

export default CategoryCard
