// React Imports
import { useState } from 'react'
// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'

import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

import { useForm, Controller } from 'react-hook-form'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import moment from 'moment/moment'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import ReactQuillLimited from './ReactQuillLimited'
// Vars
const initialData = {
  company: '',
  country: '',
  contact: ''
}
const AddTestDrawer = props => {
  // Props
  const { open, handleClose, userData, addUserData } = props
  const [categories, setCategories] = useState([{ parent: null, children: userData }])
  // States
  const [formData, setFormData] = useState(initialData)
  const [description, setDescription] = useState('')
  const [value, setValue] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const findCategoryByGuid = (guid, data) => {
    for (const category of data) {
      if (category.guid === guid) return category
      if (category.children?.length) {
        const found = findCategoryByGuid(guid, category.children)
        if (found) return found
      }
    }
    return null
  }

  const handleCategoryChange = (level, selectedGuid) => {
    const updatedSelectedCategories = [...selectedCategories]
    updatedSelectedCategories[level] = selectedGuid
    updatedSelectedCategories.splice(level + 1) // Remove selections for deeper levels
    setSelectedCategories(updatedSelectedCategories)

    const selectedCategory = findCategoryByGuid(selectedGuid, userData)

    if (selectedCategory?.children?.length) {
      setCategories(prev =>
        prev.slice(0, level + 1).concat({
          parent: selectedGuid,
          children: selectedCategory.children
        })
      )
    } else {
      // Remove deeper levels if no children exist
      setCategories(prev => prev.slice(0, level + 1))
    }
  }
  console.log(selectedCategories[selectedCategories.length - 1], 'selectedcategories')
  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      // type: '',
      parent: ''
    }
  })

  const CustomQuill = styled(ReactQuill)`
    .ql-container {
      border-bottom-left-radius: 12px !important;
      border-bottom-right-radius: 12px !important;
    }
    .ql-toolbar {
      border-bottom: none !important;
      border-top-left-radius: 12px !important;
      border-top-right-radius: 12px !important;
    }
  `
  const onSubmit = data => {
    const newUser = {
      id: (userData?.length && userData?.length + 1) || 1,

      // avatar: `/images/avatars/${Math.floor(Math.random() * 8) + 1}.png`,
      title: data.title,
      description: description,
      type: data.type,
      parent: selectedCategories[selectedCategories.length - 1],
      created_on: moment().format('YYYY-MM-DD HH:mm:ss'),

      // optional parameters
      created_by: 'ADJ20',
      status: '0'
    }

    addUserData(newUser)
    handleClose()
    setDescription(null)
    setFormData(initialData)
    resetForm({ title: '', description: '', type: '', parent: '' })
  }

  const handleReset = () => {
    handleClose()
    setFormData(initialData)
    setDescription('')
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
        <Typography variant='h5'>Add Category</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-5'>
          <Box
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
            style={{
              height: '100vh'
            }}
          >
            <Box display='flex' flexDirection='column' justifyContent='space-around'>
              <Controller
                name='title'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Title *'
                    placeholder='John Doe'
                    {...(errors.title && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
              <Box pt={9} pb={7}>
                <ReactQuillLimited
                  value={description} // Pass description as value
                  onChange={setDescription} // Pass setDescription as onChange />
                />
              </Box>
              {categories.map((category, index) => (
                <FormControl key={index} fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel id={`category-${index}`} error={!selectedCategories[index]} style={{ color: 'silver' }}>
                    {index === 0 ? 'Parent Category' : `Subcategory Level ${index}`}
                  </InputLabel>
                  <Select
                    labelId={`category-${index}`}
                    value={selectedCategories[index] || ''}
                    onChange={e => handleCategoryChange(index, e.target.value)}
                  >
                    {category.children.map(child => (
                      <MenuItem key={child.guid} value={child.guid}>
                        {child.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
            </Box>
            <Box>
              <div className='flex items-center gap-4'>
                <Button variant='contained' type='submit'>
                  Create
                </Button>
                <Button variant='outlined' color='error' type='reset' onClick={() => handleReset()}>
                  Cancel
                </Button>
              </div>
            </Box>
          </Box>
        </form>
      </div>
    </Drawer>
  )
}

export default AddTestDrawer
