import React from 'react'
import { Card, CardContent, Grid, TextField, Button, MenuItem, InputAdornment } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import type { Category } from '../../../utilities/models'
import { MONTHS } from '../../../utilities/constants'

interface MonthOption {
  value: number
  label: string
}

interface YearOption {
  value: number
  label: string
}

interface BudgetFiltersProps {
  searchQuery: string
  monthFilter: number | ''
  yearFilter: number | ''
  categoryFilter: string
  categories: Category[]
  yearOptions: YearOption[]
  onSearchChange: (value: string) => void
  onMonthChange: (value: number | '') => void
  onYearChange: (value: number | '') => void
  onCategoryChange: (value: string) => void
  onReset: () => void
}

const BudgetFilters: React.FC<BudgetFiltersProps> = ({
  searchQuery,
  monthFilter,
  yearFilter,
  categoryFilter,
  categories,
  yearOptions,
  onSearchChange,
  onMonthChange,
  onYearChange,
  onCategoryChange,
  onReset,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by category..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              label="Month"
              value={monthFilter}
              onChange={(e) => onMonthChange(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <MenuItem value="">All Months</MenuItem>
              {MONTHS.map((month: MonthOption) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              label="Year"
              value={yearFilter}
              onChange={(e) => onYearChange(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <MenuItem value="">All Years</MenuItem>
              {yearOptions.map((year: YearOption) => (
                <MenuItem key={year.value} value={year.value}>
                  {year.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              select
              label="Category"
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((cat: Category) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button fullWidth variant="outlined" onClick={onReset}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default BudgetFilters
