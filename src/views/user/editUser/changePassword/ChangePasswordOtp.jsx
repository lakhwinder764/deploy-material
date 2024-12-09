'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const ChangePasswordOtp = () => {
  // States
  const [isCurrentPasswordShown, setIsCurrentPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [isNewPasswordShown, setIsNewPasswordShown] = useState(false)

  const handleClickShowCurrentPassword = () => {
    setIsCurrentPasswordShown(!isCurrentPasswordShown)
  }

  return (
    <Card sx={{ marginBottom: 10 }} >
      <CardHeader title='Change Password using OTP' className='pbe-6' />




      <CardContent>

             <Button variant='contained' type='submit' color='primary'  style={{ marginBottom: '16px' }}>
                Send OTP
              </Button>

        <form>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='OTP'
                type= 'password'

              />
            </Grid>
          </Grid>
          <Grid container className='mbs-0' spacing={5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='New Password'
                type={isNewPasswordShown ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={() => setIsNewPasswordShown(!isNewPasswordShown)}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={isNewPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Confirm New Password'
                type={isConfirmPasswordShown ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={isConfirmPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} className='flex gap-4 pbs-6'>
              <Button variant='contained'>Save Password</Button>

            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ChangePasswordOtp
