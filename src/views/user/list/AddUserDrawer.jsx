// React Imports
import { useState } from 'react'

import { Box } from '@mui/material'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Vars
const initialData = {
  company: '',
  country: '',
  contact: ''
}

const AddUserDrawer = props => {
  const { open, handleClose, userData, setData, edit, updateUserData, addUserData } = props

  const [formData, setFormData] = useState(initialData)

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fullName: edit ? userData?.fullName : '',
      username: edit ? userData?.username : '',
      email: edit ? userData?.email : '',
      role: edit ? userData?.role : '',
      plan: edit ? userData?.plan : '',
      status: edit ? userData?.status : ''
    }
  })

  const onSubmit = data => {
    const newUser = {
      id: (userData?.length && userData?.length + 1) || 1,
      avatar: `/images/avatars/${Math.floor(Math.random() * 8) + 1}.png`,
      fullName: data?.fullName,
      username: data?.username,
      email: data?.email,
      role: data?.role,
      currentPlan: data?.plan,
      status: data?.status,
      company: formData?.company,
      country: formData?.country,
      contact: formData?.contact
    }

    if (edit) {
      updateUserData(userData?.id, newUser)
    } else {
      addUserData(newUser)
    }

    handleClose()
    setFormData(initialData)
    resetForm({ fullName: '', username: '', email: '', role: '', plan: '', status: '' })
  }

  const handleReset = () => {
    handleClose()
    setFormData(initialData)
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>{edit ? 'Edit User' : 'Add New User'}</Typography>
        {/* <IconButton size='small' onClick={handleReset}> */}
        <i className='ri-close-line text-2xl' />
        {/* </IconButton> */}
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-5'>
          <Controller
            name='firstname'
            control={control}
            rules={{ required: 'The first name is invalid' }}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel shrink error={Boolean(errors.firstname)} style={{ color: 'black' }}>
                  {/* First Name */}
                </InputLabel>
                <TextField
                  {...field}
                  fullWidth
                  placeholder='First Name'
                  error={Boolean(errors.firstname)}

                  //  sx={{ mt: 5 }}
                />
                {errors.firstname && <FormHelperText error>{errors.firstname.message}</FormHelperText>}
              </FormControl>
            )}
          />

          <Controller
            name='lastname'
            control={control}
            rules={{ required: 'The last name is invalid' }}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel shrink error={Boolean(errors.lastname)} style={{ color: 'black' }}>
                  {/* Last Name */}
                </InputLabel>
                <TextField
                  {...field}
                  fullWidth
                  placeholder='Last Name'
                  error={Boolean(errors.lastname)}

                  // sx={{ mt: 5 }}
                />
                {errors.lastname && <FormHelperText error>{errors.lastname.message}</FormHelperText>}
              </FormControl>
            )}
          />

          <Controller
            name='email'
            control={control}
            rules={{ required: 'The email address is invalid' }}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel shrink error={Boolean(errors.email)} style={{ color: 'black' }}>
                  {/* Email */}
                </InputLabel>
                <TextField
                  {...field}
                  fullWidth
                  type='email'
                  placeholder='johndoe@gmail.com'
                  error={Boolean(errors.email)}

                  // sx={{ mt: 5 }}
                />
                {errors.email && <FormHelperText error>{errors.email.message}</FormHelperText>}
              </FormControl>
            )}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ flex: '0 0 30%' }}>
              <InputLabel shrink error={Boolean(errors.countryCode)} style={{ color: 'black' }}>
                {/* Phone Number */}
              </InputLabel>
              <Controller
                name='countryCode'
                control={control}
                rules={{ required: 'The phone number is invalid' }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    type='text'
                    value={value}
                    placeholder='+91'
                    onChange={onChange}
                    error={Boolean(errors.countryCode)}

                    // sx={{ mt: 5 }}
                  />
                )}
              />
              {errors.countryCode && <FormHelperText error>{errors.countryCode.message}</FormHelperText>}
            </FormControl>

            <FormControl sx={{ flex: '1 1 70%' }}>
              {/* <InputLabel shrink error={Boolean(errors.phoneNumber)} style={{ color: 'black' }}>
                Phone Number
              </InputLabel> */}
              <Controller
                name='phoneNumber'
                control={control}
                rules={{ required: 'The phone number is invalid' }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    type='text'
                    value={value}
                    placeholder='1234567890'
                    onChange={onChange}
                    error={Boolean(errors.phoneNumber)}

                    // sx={{ mt: 5 }}
                  />
                )}
              />
              {errors.phoneNumber && <FormHelperText error>{errors.phoneNumber.message}</FormHelperText>}
            </FormControl>
          </Box>

          <FormControl fullWidth>
            <InputLabel shrink error={Boolean(errors.country)} style={{ color: 'black' }}>
              {/* Country */}
            </InputLabel>
            <Select
              fullWidth
              id='country'
              value={formData.country}
              placeholder='ROle'
              onChange={e => setFormData({ ...formData, country: e.target.value })}
              error={Boolean(errors.country)}

              // sx={{ mt: 5 }}
            >
              <MenuItem disabled value=''>
                <em>Select Country</em> {/* Placeholder */}
              </MenuItem>
              <MenuItem value='India'>India</MenuItem>
              <MenuItem value='USA'>USA</MenuItem>
              <MenuItem value='Australia'>Australia</MenuItem>
              <MenuItem value='Germany'>Germany</MenuItem>
            </Select>
            {errors.country && <FormHelperText error>{errors.country.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth>
            <InputLabel shrink error={Boolean(errors.role)} style={{ color: 'black' }}>
              {/* Role */}
            </InputLabel>
            <Controller
              name='role'
              control={control}
              rules={{ required: 'Please select role' }}
              render={({ field }) => (
                <Select fullWidth {...field} error={Boolean(errors.role)} sx={{}}>
                  <MenuItem disabled value=''>
                    <em>Select Role</em> {/* Placeholder */}
                  </MenuItem>
                  <MenuItem value='admin'>Admin</MenuItem>
                  <MenuItem value='student'>Student</MenuItem>
                  <MenuItem value='teacher'>Teacher</MenuItem>
                </Select>
              )}
            />
            {errors.role && <FormHelperText error>{errors.role.message}</FormHelperText>}
          </FormControl>

          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Create
            </Button>
            <Button variant='outlined' color='error' type='reset' onClick={() => handleReset()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddUserDrawer
