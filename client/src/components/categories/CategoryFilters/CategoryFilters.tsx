import React from 'react'
import { Card, CardContent, Grid, TextField, MenuItem, Button, InputAdornment } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { TRANSACTION_TYPE_OPTIONS } from '../../../utilities/constants'

interface CategoryFiltersProps {
  searchQuery: string
  typeFilter: string
  onSearchChange: (value: string) => void
  onTypeChange: (value: string) => void
  onReset: () => void
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  searchQuery,
  typeFilter,
  onSearchChange,
  onTypeChange,
  onReset,
}) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search categories..."
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
        <Grid item xs={6} sm={4}>
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
        <Grid item xs={6} sm={3}>
          <Button fullWidth variant="outlined" onClick={onReset}>
            Reset
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
)

export default CategoryFilters
