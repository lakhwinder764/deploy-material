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
import { IconButton } from '@mui/material'
// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import Reactquill from './Reactquill'

// Vars
const initialData = {
  company: '',
  country: '',
  contact: ''
}

const AddUserDrawer = props => {
  const { open, handleClose, userData, setData, edit, updateUserData, addUserData, settings, onSaveSettings } = props
  const [localSettings, setLocalSettings] = useState(settings)
  const [formData, setFormData] = useState(initialData)

  // Handle input change
  const handleChange = event => {
    const { name, value } = event.target
    setLocalSettings(prevSettings => ({
      ...prevSettings,
      [name]: value
    }))
  }

  const handleSave = () => {
    onSaveSettings(localSettings) // Call the function to update parent state
    handleClose()
  }
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
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      role: data.role,
      currentPlan: data.plan,
      status: data.status,
      company: formData.company,
      country: formData.country,
      contact: formData.contact
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
        <Typography variant='h5'>{edit ? 'Edit Section' : 'Question Setting'}</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        {' '}
        <FormControl fullWidth margin='dense' size='small'>
          <InputLabel>Question Type</InputLabel>
          <Select name='questionType' value={localSettings.questionType} onChange={handleChange}>
            <MenuItem value='MCQ'>MCQ</MenuItem>
            <MenuItem value='True/False'>True/False</MenuItem>
            <MenuItem value='Short Answer'>Short Answer</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label='Marks Per Question'
          name='marksPerQuestion'
          type='number'
          value={localSettings.marksPerQuestion}
          onChange={handleChange}
          fullWidth
          margin='dense'
          size='small'
          sx={{ mt: 4 }}
        />
        <TextField
          sx={{ mt: 4 }}
          label='Negative Marks Per Question'
          name='negativeMarks'
          type='number'
          value={localSettings.negativeMarks}
          onChange={handleChange}
          fullWidth
          margin='dense'
          size='small'
        />
        <FormControl fullWidth margin='dense' size='small' sx={{ mt: 4 }}>
          <Box display='flex' alignItems='center'>
            <TextField
              label='Time Allowed Per Question'
              name='timeAllowed'
              type='number'
              value={localSettings.timeAllowed}
              onChange={handleChange}
              style={{ flex: 2, marginRight: '10px' }} // Adjusts input width
              size='small'
            />
            <Select
              name='timeUnit'
              value={localSettings.timeUnit}
              onChange={handleChange}
              style={{ flex: 1 }} // Dropdown size
            >
              <MenuItem value='Second'>Second</MenuItem>
              <MenuItem value='Minute'>Minute</MenuItem>
            </Select>
          </Box>
        </FormControl>
        <FormControl fullWidth margin='dense' size='small' sx={{ mt: 4 }}>
          <InputLabel>Select Difficulty Level</InputLabel>
          <Select name='difficultyLevel' value={localSettings.difficultyLevel} onChange={handleChange}>
            <MenuItem value='Low'>Low</MenuItem>
            <MenuItem value='Medium'>Medium</MenuItem>
            <MenuItem value='High'>High</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin='dense' size='small' sx={{ mt: 4 }}>
          <InputLabel>Select Importance</InputLabel>
          <Select name='importance' value={localSettings.importance} onChange={handleChange}>
            <MenuItem value='Low'>Low</MenuItem>
            <MenuItem value='Medium'>Medium</MenuItem>
            <MenuItem value='High'>High</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={handleSave} variant='contained' color='primary' sx={{ mt: 8 }}>
          Save
        </Button>
        <Button onClick={handleClose} color='secondary' sx={{ mt: 8 }}>
          Cancel
        </Button>
      </div>
    </Drawer>
  )
}

export default AddUserDrawer
