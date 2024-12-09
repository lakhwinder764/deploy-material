import { useState, useEffect } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import {
  Typography,
  Chip,
  Divider,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'

import useUserApi from '@/api/useUserApi' // Adjust the import path based on your structure

const EditForm = ({ isAdmin }) => {
  const { fetchUserById, updateUser } = useUserApi()
  const searchParams = useSearchParams()
  const guid = searchParams.get('guid') // Fetch GUID from URL
  const router = useRouter()

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    status: '',
    role: ''
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [openDialog, setOpenDialog] = useState(false) // For controlling dialog visibility

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (guid) {
          const userData = await fetchUserById(guid)

          if (userData) {
            setFormData(prevData => {
              if (prevData?.first_name === '' && prevData?.last_name === '' && prevData?.email === '') {
                return {
                  first_name: userData?.first_name || '',
                  last_name: userData?.last_name || '',
                  email: userData?.email || '',
                  mobile: userData?.mobile || '',
                  status: mapStatusFromPayload(userData?.status), // Map status from payload
                  role: userData?.role || ''
                }
              }

              return prevData // Keep existing data if user has already interacted with the form
            })
          }
        }
      } catch (error) {
        setError('Failed to fetch user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [guid, fetchUserById])

  // Map status from payload values to form values
  const mapStatusFromPayload = status => {
    switch (status) {
      case '1':
        return 'active'
      case '0':
        return 'inactive'
      case '':
        return 'pending'
      default:
        return 'pending' // Default to pending if the value is unknown
    }
  }

  // Map status from form values to payload values
  const mapStatusToPayload = status => {
    switch (status) {
      case 'active':
        return '1'
      case 'inactive':
        return '0'
      case 'pending':
        return ''
      default:
        return '' // Default to empty string for pending
    }
  }

  const handleChange = e => {
    const { name, value } = e.target

    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Basic validation
    if (!formData?.first_name || !formData?.last_name || !formData?.email) {
      setError('First Name, Last Name, and Email are required.')

      return
    }

    // Create a new FormData instance
    const formDataObj = new FormData()

    // Append form data values
    formDataObj.append('first_name', formData?.first_name)
    formDataObj.append('last_name', formData?.last_name)
    formDataObj.append('email', formData?.email)
    formDataObj.append('mobile', formData?.mobile)
    formDataObj.append('status', mapStatusToPayload(formData?.status)) // Map status to payload format
    formDataObj.append('role', formData?.role)

    try {
      // Call updateUser with FormData
      await updateUser(guid, formDataObj)

      // Set success message
      setOpenDialog(true) // Open the dialog for confirmation
    } catch (error) {
      setError('Failed to update user data')
    }
  }

  // Handle dialog close
  const handleDialogClose = () => {
    setOpenDialog(false)
    window.location.reload() // Refresh the page after confirmation
  }

  // Handle form reset
  const handleReset = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      mobile: '',
      status: '',
      role: ''
    })
  }

  if (loading)
    return (
      <Card>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <Skeleton variant='rounded' width='100%' height={56} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Skeleton variant='rounded' width='100%' height={56} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Skeleton variant='rounded' width='100%' height={56} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Skeleton variant='rectangular' width='100%' height={56} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )

  return (
    <>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={5}>
              {error && <Typography color='error'>{error}</Typography>}
              {success && <Typography color='success'>{success}</Typography>}
              {/* First Name Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='First Name'
                  value={formData?.first_name}
                  placeholder='John'
                  onChange={handleChange}
                  name='first_name'
                />
              </Grid>
              {/* Last Name Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Last Name'
                  value={formData?.last_name}
                  placeholder='Doe'
                  onChange={handleChange}
                  name='last_name'
                />
              </Grid>
              {/* Email Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Email'
                  value={formData?.email}
                  placeholder='john.doe@gmail.com'
                  onChange={handleChange}
                  name='email'
                />
              </Grid>
              {/* Phone Number Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Phone Number'
                  value={formData?.mobile}
                  placeholder='+1 (234) 567-8901'
                  onChange={handleChange}
                  name='mobile'
                />
              </Grid>
              {/* Role Field */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={isAdmin}>
                  <InputLabel>Role</InputLabel>
                  <Select label='Role' value={formData?.role} name='role' onChange={handleChange}>
                    <MenuItem value='student'>Student</MenuItem>
                    <MenuItem value='teacher'>Teacher</MenuItem>
                    <MenuItem value='admin'>Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* Status Field */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={isAdmin}>
                  <InputLabel>Status</InputLabel>
                  <Select label='Status' value={formData?.status} name='status' onChange={handleChange}>
                    <MenuItem value='active'>Active</MenuItem>
                    <MenuItem value='inactive'>Inactive</MenuItem>
                    <MenuItem value='pending'>Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* Submit and Reset Buttons */}
              <Grid item xs={12} className='flex gap-4 flex-wrap'>
                <Button variant='contained' type='submit'>
                  Save Changes
                </Button>
                <Button variant='outlined' type='reset' color='secondary' onClick={handleReset}>
                  Reset
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>User Update</DialogTitle>
        <DialogContent>
          <DialogContentText>User updated successfully.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color='primary'>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EditForm
