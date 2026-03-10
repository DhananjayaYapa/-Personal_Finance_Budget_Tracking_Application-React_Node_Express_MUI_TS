import React from 'react'
import { Box, Typography } from '@mui/material'
import { Loader } from 'react-loaders'

interface LoadingOverlayProps {
  loading: boolean
  message?: string
  minHeight?: number | string
  children?: React.ReactNode
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  message,
  minHeight = 200,
  children,
}) => {
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight,
          gap: 2,
        }}
      >
        <Loader type="pacman" active />
        {message && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Box>
    )
  }

  return <>{children}</>
}

export default LoadingOverlay
