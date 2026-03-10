import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Grid, Alert } from '@mui/material'
import { authActions, alertActions } from '../../redux/actions'
import type { RootState } from '../../redux/store'
import type {
  ProfileFormDto,
  PasswordFormDto,
  UpdateProfileRequestDto,
  ChangePasswordRequestDto,
} from '../../utilities/models'
import { INITIAL_PROFILE_FORM_STATE, INITIAL_PASSWORD_FORM_STATE } from '../../utilities/models'
import { PageHeader } from '../../components/shared'
import { ProfileCard, ProfileForm, PasswordChangeForm } from '../../components/profile'
import { validateControlledFormData } from '../../utilities/helpers'
import styles from './Profile.module.scss'

const Profile: React.FC = () => {
  const dispatch = useDispatch()

  const user = useSelector((state: RootState) => state.auth.user)
  const isLoading = useSelector((state: RootState) => state.auth.isLoading)
  const updateProfileAlert = useSelector((state: RootState) => state.alert.updateProfileAlert)
  const changePasswordAlert = useSelector((state: RootState) => state.alert.changePasswordAlert)

  const [passwordSubmitted, setPasswordSubmitted] = useState(false)

  // Form states (Athena controlled component pattern)
  const [profileFormData, setProfileFormData] = useState<ProfileFormDto>(
    INITIAL_PROFILE_FORM_STATE()
  )
  const [passwordFormData, setPasswordFormData] = useState<PasswordFormDto>(
    INITIAL_PASSWORD_FORM_STATE()
  )

  // Helper text states
  const [isShowProfileHelperText, setIsShowProfileHelperText] = useState(true)
  const [isShowPasswordHelperText, setIsShowPasswordHelperText] = useState(true)

  // Initialize profile form with user data
  useEffect(() => {
    if (user) {
      setProfileFormData(INITIAL_PROFILE_FORM_STATE(user.name || '', user.email || ''))
    }
  }, [user])

  // Profile form handlers
  const handleProfileInputFocus = (property: string) => {
    setProfileFormData((prev) => ({
      ...prev,
      [property]: {
        ...prev[property as keyof ProfileFormDto],
        error: null,
      },
    }))
  }

  const handleProfileInputChange = (property: string, value: string) => {
    setProfileFormData((prev) => ({
      ...prev,
      [property]: {
        ...prev[property as keyof ProfileFormDto],
        value,
      },
    }))
  }

  // Password form handlers
  const handlePasswordInputFocus = (property: string) => {
    setPasswordFormData((prev) => ({
      ...prev,
      [property]: {
        ...prev[property as keyof PasswordFormDto],
        error: null,
      },
    }))
  }

  const handlePasswordInputChange = (property: string, value: string) => {
    setPasswordFormData((prev) => ({
      ...prev,
      [property]: {
        ...prev[property as keyof PasswordFormDto],
        value,
      },
    }))
  }

  // Profile submit with validation
  const handleProfileSubmit = async () => {
    setIsShowProfileHelperText(true)
    const [validatedData, isValid] = await validateControlledFormData(profileFormData)
    setProfileFormData(validatedData)

    if (isValid) {
      const updateProfileParams: UpdateProfileRequestDto = {
        name: profileFormData.name.value,
        email: profileFormData.email.value,
      }
      dispatch(authActions.updateProfileRequest(updateProfileParams))
    }
  }

  // Password submit with validation
  const handlePasswordSubmit = async () => {
    setIsShowPasswordHelperText(true)
    const [validatedData, isValid] = await validateControlledFormData(passwordFormData)
    setPasswordFormData(validatedData)

    if (isValid) {
      const changePasswordParams: ChangePasswordRequestDto = {
        currentPassword: passwordFormData.currentPassword.value,
        newPassword: passwordFormData.newPassword.value,
      }
      dispatch(authActions.changePasswordRequest(changePasswordParams))
      setPasswordFormData(INITIAL_PASSWORD_FORM_STATE())
      setPasswordSubmitted(true)
    }
  }

  const handleClearUpdateProfileAlert = () => {
    dispatch(alertActions.clearUpdateProfileAlert())
  }

  const handleClearChangePasswordAlert = () => {
    dispatch(alertActions.clearChangePasswordAlert())
    setPasswordSubmitted(false)
  }

  // Computed values
  const userName = user?.name || 'User'
  const userEmail = user?.email || ''

  return (
    <Box className={styles.profilePage}>
      <PageHeader title="My Profile" subtitle="Manage your account settings" />

      {/* Alerts */}
      {updateProfileAlert?.message && (
        <Alert
          severity={updateProfileAlert.severity || 'info'}
          onClose={handleClearUpdateProfileAlert}
          sx={{ mb: 2 }}
        >
          {updateProfileAlert.message}
        </Alert>
      )}
      {changePasswordAlert?.message && (
        <Alert
          severity={changePasswordAlert.severity || 'info'}
          onClose={handleClearChangePasswordAlert}
          sx={{ mb: 2 }}
        >
          {changePasswordAlert.message}
        </Alert>
      )}
      {passwordSubmitted && !changePasswordAlert?.message && (
        <Alert severity="success" onClose={handleClearChangePasswordAlert} sx={{ mb: 2 }}>
          Password change request submitted
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <ProfileCard name={userName} email={userEmail} />
        </Grid>

        {/* Forms */}
        <Grid item xs={12} md={8}>
          <ProfileForm
            isShowHelperText={isShowProfileHelperText}
            formData={profileFormData}
            isLoading={isLoading}
            onInputChange={handleProfileInputChange}
            onInputFocus={handleProfileInputFocus}
            onSubmit={handleProfileSubmit}
          />

          <PasswordChangeForm
            isShowHelperText={isShowPasswordHelperText}
            formData={passwordFormData}
            isLoading={isLoading}
            onInputChange={handlePasswordInputChange}
            onInputFocus={handlePasswordInputFocus}
            onSubmit={handlePasswordSubmit}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Profile
