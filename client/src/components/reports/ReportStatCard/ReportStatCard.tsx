import React from 'react'
import { Box, Card, CardContent, Typography } from '@mui/material'
import { formatCurrency } from '../../../utilities/helpers'

interface ReportStatCardProps {
  title: string
  amount: number
  icon: React.ReactNode
  color: string
  type?: 'income' | 'expense' | 'balance'
}

const ReportStatCard: React.FC<ReportStatCardProps> = ({ title, amount, icon, color, type }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
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
            {formatCurrency(amount)}
          </Typography>
        </Box>
        <Box
          sx={{
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

export default ReportStatCard
