import React from 'react'
import { Card, CardContent, Grid, TextField, MenuItem, Button, InputAdornment } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import type { Category } from '../../../utilities/models'
import { TRANSACTION_TYPE_OPTIONS } from '../../../utilities/constants'

interface TransactionFiltersProps {
  searchQuery: string
  typeFilter: string
  categoryFilter: string
  startDate: string
  endDate: string
  categories: Category[]
  onSearchChange: (value: string) => void
  onTypeChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onReset: () => void
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  searchQuery,
  typeFilter,
  categoryFilter,
  startDate,
  endDate,
  categories,
  onSearchChange,
  onTypeChange,
  onCategoryChange,
  onStartDateChange,
  onEndDateChange,
  onReset,
}) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search transactions..."
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
        <Grid item xs={6} sm={3} md={2}>
          <TextField
            fullWidth
            size="small"
            select
            label="Type"
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            <MenuItem value="">All Types</MenuItem>
            {TRANSACTION_TYPE_OPTIONS.map((type: { value: string; label: string }) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
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
        <Grid item xs={6} sm={3} md={2}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={1}>
          <Button fullWidth variant="outlined" onClick={onReset}>
            Reset
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
)

export default TransactionFilters
