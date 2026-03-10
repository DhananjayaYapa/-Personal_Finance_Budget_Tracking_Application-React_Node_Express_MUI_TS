import React from 'react'
import { Box, Card, CardContent, Typography } from '@mui/material'
import { formatCurrency } from '../../../utilities/helpers'

interface StatCardProps {
  title: string
  amount: number | string
  icon: React.ReactNode
  color: string
  type?: 'income' | 'expense' | 'balance'
  isCurrency?: boolean
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  amount,
  icon,
  color,
  type,
  isCurrency = true,
}) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: { xs: 'row', md: 'column', lg: 'row' },
          gap: { xs: 0, md: 1.5, lg: 0 },
        }}
      >
        <Box
          sx={{
            order: { xs: 1, md: 2, lg: 1 },
            textAlign: { xs: 'left', md: 'center', lg: 'left' },
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{
              color: type === 'expense' ? 'error.main' : type === 'income' ? 'success.main' : color,
            }}
          >
            {isCurrency && typeof amount === 'number' ? formatCurrency(amount) : amount}
          </Typography>
        </Box>
        <Box
          sx={{
            order: { xs: 2, md: 1, lg: 2 },
            p: 1.5,
            borderRadius: 2,
            bgcolor: `${color}20`,
            color: color,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
)

export default StatCard
