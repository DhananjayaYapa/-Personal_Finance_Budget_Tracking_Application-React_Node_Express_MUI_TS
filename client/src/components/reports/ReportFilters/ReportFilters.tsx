import React from 'react'
import { Card, CardContent, Grid, TextField, MenuItem, Button } from '@mui/material'
import { Download as DownloadIcon } from '@mui/icons-material'
import type { Category } from '../../../utilities/models'
import { TRANSACTION_TYPE } from '../../../utilities/constants'
import type { ReportType } from '../ReportTypeSelector/ReportTypeSelector'

interface ReportFiltersProps {
  reportType: ReportType
  startDate: string
  endDate: string
  categoryFilter: string
  typeFilter: string
  categories: Category[]
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onTypeChange: (value: string) => void
  onExportCsv: () => void
  onExportJson: () => void
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  reportType,
  startDate,
  endDate,
  categoryFilter,
  typeFilter,
  categories,
  onStartDateChange,
  onEndDateChange,
  onCategoryChange,
  onTypeChange,
  onExportCsv,
  onExportJson,
}) => {
  const isFiltersDisabled = reportType === null

  return (
    <Card sx={{ mb: 3, opacity: isFiltersDisabled ? 0.5 : 1 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              disabled={isFiltersDisabled}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              disabled={isFiltersDisabled}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              select
              size="small"
              label="Category"
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              disabled={isFiltersDisabled}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category: Category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Transaction-specific Type filter */}
          {reportType === 'transaction' && (
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                select
                size="small"
                label="Type"
                value={typeFilter}
                onChange={(e) => onTypeChange(e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value={TRANSACTION_TYPE.INCOME}>Income</MenuItem>
                <MenuItem value={TRANSACTION_TYPE.EXPENSE}>Expense</MenuItem>
              </TextField>
            </Grid>
          )}

          {/* Export Buttons */}
          <Grid item xs={12} sm={6} md={reportType === 'transaction' ? 2 : 3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={onExportCsv}
              disabled={isFiltersDisabled}
            >
              Export CSV
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={reportType === 'transaction' ? 2 : 3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={onExportJson}
              disabled={isFiltersDisabled}
            >
              Export JSON
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ReportFilters
