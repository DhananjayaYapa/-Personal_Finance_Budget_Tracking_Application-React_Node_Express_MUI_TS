import React from 'react'
import { Card, CardContent, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { Receipt as TransactionIcon, AccountBalanceWallet as BudgetIcon } from '@mui/icons-material'

export type ReportType = 'transaction' | 'budget' | null

interface ReportTypeSelectorProps {
  value: ReportType
  onChange: (event: React.MouseEvent<HTMLElement>, newType: ReportType) => void
}

const ReportTypeSelector: React.FC<ReportTypeSelectorProps> = ({ value, onChange }) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Typography variant="subtitle1" fontWeight={500} gutterBottom>
        Select Report Type
      </Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={onChange}
        sx={{
          mb: 2,
          width: { xs: '100%', sm: 'auto' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1.5, sm: 0 },
          '& .MuiToggleButtonGroup-grouped': {
            '&:not(:last-of-type)': {
              borderRadius: { xs: 1, sm: 0 },
              border: { xs: '1px solid rgba(255, 255, 255, 0.12)', sm: 'inherit' },
            },
            '&:last-of-type': {
              borderRadius: { xs: 1, sm: 0 },
              borderTopLeftRadius: { sm: 0 },
              borderBottomLeftRadius: { sm: 0 },
            },
            '&:first-of-type': {
              borderRadius: { xs: 1, sm: 0 },
              borderTopRightRadius: { sm: 0 },
              borderBottomRightRadius: { sm: 0 },
            },
          },
        }}
      >
        <ToggleButton
          value="transaction"
          sx={{
            px: 4,
            width: { xs: '100%', sm: 'auto' },
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            },
          }}
        >
          <TransactionIcon sx={{ mr: 1 }} />
          Transaction Details
        </ToggleButton>
        <ToggleButton
          value="budget"
          sx={{
            px: 4,
            width: { xs: '100%', sm: 'auto' },
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            },
          }}
        >
          <BudgetIcon sx={{ mr: 1 }} />
          Budget Details
        </ToggleButton>
      </ToggleButtonGroup>

      {!value && (
        <Typography variant="body2" color="text.secondary">
          Please select a report type to enable filters and export options.
        </Typography>
      )}
    </CardContent>
  </Card>
)

export default ReportTypeSelector
