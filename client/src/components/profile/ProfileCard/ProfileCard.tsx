import React from 'react'
import { Card, CardContent, Typography, Avatar } from '@mui/material'
import { Person as PersonIcon } from '@mui/icons-material'

interface ProfileCardProps {
  name: string
  email: string
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, email }) => (
  <Card>
    <CardContent sx={{ textAlign: 'center', py: 4 }}>
      <Avatar
        sx={{
          width: 100,
          height: 100,
          mx: 'auto',
          mb: 2,
          bgcolor: 'primary.main',
          fontSize: '2.5rem',
        }}
      >
        {name?.[0]?.toUpperCase() || <PersonIcon sx={{ fontSize: 48 }} />}
      </Avatar>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {name || 'User'}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {email || ''}
      </Typography>
    </CardContent>
  </Card>
)

export default ProfileCard
