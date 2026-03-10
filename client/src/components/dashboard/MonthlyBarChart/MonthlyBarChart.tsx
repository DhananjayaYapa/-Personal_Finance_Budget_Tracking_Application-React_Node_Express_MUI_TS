import React from 'react'
import { Box, Card, CardContent, Typography, TextField, MenuItem } from '@mui/material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '../../../utilities/helpers'
import { CHART_COLORS } from '../../../utilities/constants'

export interface MonthlyDataPoint {
  name: string
  income: number
  expense: number
}

interface MonthlyBarChartProps {
  data: MonthlyDataPoint[]
  selectedYear: number
  yearOptions: number[]
  onYearChange: (year: number) => void
}

const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({
  data,
  selectedYear,
  yearOptions,
  onYearChange,
}) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Monthly Overview</Typography>
        <TextField
          select
          size="small"
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          sx={{ minWidth: 100 }}
        >
          {yearOptions.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" tickFormatter={(value) => `$${value}`} />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: '#1a1445',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
            }}
          />
          <Legend />
          <Bar dataKey="income" name="Income" fill={CHART_COLORS.income} radius={[4, 4, 0, 0]} />
          <Bar
            dataKey="expense"
            name="Expenses"
            fill={CHART_COLORS.expense}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)

export default MonthlyBarChart
