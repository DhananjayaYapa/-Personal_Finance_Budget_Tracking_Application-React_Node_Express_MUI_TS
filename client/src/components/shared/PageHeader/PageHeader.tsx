import React from 'react'
import { Box, Typography, Button } from '@mui/material'

interface PageHeaderProps {
  title?: string
  subtitle?: string
  actionLabel?: string
  actionIcon?: React.ReactNode
  onAction?: () => void
  actionDisabled?: boolean
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  onAction,
  actionDisabled,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 },
        mb: 3,
      }}
    >
      <Box>
        {title && (
          <Typography variant="h4" fontWeight={600}>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {actionLabel && onAction && (
        <Button
          variant="contained"
          startIcon={actionIcon}
          onClick={onAction}
          disabled={actionDisabled}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  )
}

export default PageHeader
