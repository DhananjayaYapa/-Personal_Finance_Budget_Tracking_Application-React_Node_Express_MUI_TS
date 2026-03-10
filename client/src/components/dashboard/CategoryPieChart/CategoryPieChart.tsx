import React from 'react'
import { Box, Card, CardContent, Typography } from '@mui/material'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../../../utilities/helpers'
import { CHART_COLORS } from '../../../utilities/constants'

export interface CategoryDataPoint {
  name: string
  value: number
}

interface CategoryPieChartProps {
  data: CategoryDataPoint[]
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Expense by Category
      </Typography>
      {data.length === 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 250 }}>
          <Typography color="text.secondary">No expense data</Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={{ stroke: 'rgba(255,255,255,0.3)' }}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS.palette[index % CHART_COLORS.palette.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: '#1a1445',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </CardContent>
  </Card>
)

export default CategoryPieChart
