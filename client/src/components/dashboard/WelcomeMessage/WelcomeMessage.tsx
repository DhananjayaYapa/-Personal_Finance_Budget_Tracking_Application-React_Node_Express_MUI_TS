import React from 'react'
import { Box, Typography } from '@mui/material'

interface WelcomeMessageProps {
  userName: string
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ userName }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h4" fontWeight={600}>
      Welcome back, {userName}!
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Here's your financial overview
    </Typography>
  </Box>
)

export default WelcomeMessage
