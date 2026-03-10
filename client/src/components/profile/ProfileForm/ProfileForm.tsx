import React from 'react'
import { Card, CardContent, Grid, Typography, TextField, Button, Divider } from '@mui/material'
import type { ProfileFormDto } from '../../../utilities/models'

interface ProfileFormProps {
  isShowHelperText: boolean
  formData: ProfileFormDto
  isLoading: boolean
  onInputChange: (property: string, value: string) => void
  onInputFocus: (property: string) => void
  onSubmit: () => void
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  isShowHelperText,
  formData,
  isLoading,
  onInputChange,
  onInputFocus,
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Profile Information
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name.value}
                onChange={(e) => onInputChange('name', e.target.value)}
                onFocus={() => onInputFocus('name')}
                error={isShowHelperText && !!formData.name.error}
                helperText={isShowHelperText && formData.name.error ? formData.name.error : ''}
                required={formData.name.isRequired}
                disabled={formData.name.disable}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                value={formData.email.value}
                onChange={(e) => onInputChange('email', e.target.value)}
                onFocus={() => onInputFocus('email')}
                error={isShowHelperText && !!formData.email.error}
                helperText="Email cannot be changed"
                disabled={formData.email.disable}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" disabled={isLoading}>
                Update Profile
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ProfileForm
