import React from 'react'
import { Card, CardContent, Grid, Typography, TextField, Button, Divider } from '@mui/material'
import type { PasswordFormDto } from '../../../utilities/models'
import { LoadingOverlay } from '../../shared'

interface PasswordChangeFormProps {
  isShowHelperText: boolean
  formData: PasswordFormDto
  isLoading: boolean
  onInputChange: (property: string, value: string) => void
  onInputFocus: (property: string) => void
  onSubmit: () => void
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
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
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Change Password
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <LoadingOverlay loading={isLoading}>
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Current Password"
                  value={formData.currentPassword.value}
                  onChange={(e) => onInputChange('currentPassword', e.target.value)}
                  onFocus={() => onInputFocus('currentPassword')}
                  error={isShowHelperText && !!formData.currentPassword.error}
                  helperText={isShowHelperText && formData.currentPassword.error ? formData.currentPassword.error : ''}
                  required={formData.currentPassword.isRequired}
                  disabled={formData.currentPassword.disable}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  value={formData.newPassword.value}
                  onChange={(e) => onInputChange('newPassword', e.target.value)}
                  onFocus={() => onInputFocus('newPassword')}
                  error={isShowHelperText && !!formData.newPassword.error}
                  helperText={isShowHelperText && formData.newPassword.error ? formData.newPassword.error : ''}
                  required={formData.newPassword.isRequired}
                  disabled={formData.newPassword.disable}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  value={formData.confirmPassword.value}
                  onChange={(e) => onInputChange('confirmPassword', e.target.value)}
                  onFocus={() => onInputFocus('confirmPassword')}
                  error={isShowHelperText && !!formData.confirmPassword.error}
                  helperText={isShowHelperText && formData.confirmPassword.error ? formData.confirmPassword.error : ''}
                  required={formData.confirmPassword.isRequired}
                  disabled={formData.confirmPassword.disable}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="warning" disabled={isLoading}>
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </form>
        </LoadingOverlay>
      </CardContent>
    </Card>
  )
}

export default PasswordChangeForm
