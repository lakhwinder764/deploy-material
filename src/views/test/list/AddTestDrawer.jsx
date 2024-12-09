// React Imports
import { use, useEffect, useState } from 'react'

// eslint-disable-next-line import/no-unresolved
// import * as yup from 'yup'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import moment from 'moment/moment'
import ReactQuill from 'react-quill'

import 'react-quill/dist/quill.snow.css'

// import { yupResolver } from '@hookform/resolvers/yup'

import TextEditor from '@/components/Common/TextEditor'

// Vars
const initialData = {
  company: '',
  country: '',
  contact: ''
}

const AddTestDrawer = props => {
  // Props
  const { open, handleClose, userData, addUserData, categoriesTableData } = props

  // States
  const [formData, setFormData] = useState(initialData)
  const [categories, setCategories] = useState([{ parent: null, children: categoriesTableData }])

  console.info(categoriesTableData, 'tableData')
  const [description, setDescription] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])

  console.info(selectedCategories, 'selected_new')
  const [value, setValue] = useState('')

  // useEffect(() => {
  //   setCategories([
  //     {
  //       parent: null,
  //       children: categoriesTableData
  //     }
  //   ])
  // }, [categoriesTableData])

  // const schema = yup.object().shape({
  //   title: yup.string().required().min(3),
  //   type: yup.string().required(),
  //   details: yup.string(),
  //   category: yup.string()
  // })

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      title: '',
      details: '',
      type: '',
      category: ''
    }

    // resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    const newUser = {
      id: (userData?.length && userData?.length + 1) || 1,

      // avatar: `/images/avatars/${Math.floor(Math.random() * 8) + 1}.png`,
      title: data?.title,
      description: data?.details,
      type: data?.type,
      category: data?.category,
      created_on: moment().format('YYYY-MM-DD HH:mm:ss'),
      category: selectedCategories[selectedCategories.length - 1],

      // optional parameters
      created_by: 'ADJ20',
      status: '0'
    }

    addUserData(newUser)

    // return getNewUserData()

    // return res.json()

    // setData([...(userData ?? []), newUser])
    handleClose()
    setFormData(initialData)
    resetForm({ title: '', details: '', type: '', category: '' })
  }

  const handleReset = () => {
    handleClose()
    setFormData(initialData)
  }

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
    console.info(level, 'level')
    const updatedSelectedCategories = [...selectedCategories]

    updatedSelectedCategories[level] = selectedGuid
    updatedSelectedCategories.splice(level + 1) // Remove selections for deeper levels
    setSelectedCategories(updatedSelectedCategories)

    const selectedCategory = findCategoryByGuid(selectedGuid, categoriesTableData)

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
        <Typography variant='h5'>Add Test</Typography>
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
              <Box pt={5} pb={7}>
                {/* <TextEditor setTextValue={setDescription} /> */}
                <Controller
                  name='details'
                  control={control}
                  render={({ field }) => (
                    <TextEditor
                      {...field}
                      onChange={content => field.onChange(content)} // update the form state
                      value={field.value || ''}
                      autoFocus
                      fullWidth
                      width='22vw'
                      quilleditor
                      simpleeditor
                    />
                  )}
                />
              </Box>
              {/* {categories.map((category, index) => (
                <FormControl key={index} fullWidth sx={{ marginBottom: 5 }}>
                  <InputLabel
                    id={`category-label-${index}`}
                    error={!selectedCategories[index]}
                    style={{ color: 'silver' }}
                  >
                    {index === 0 ? 'Parent Category' : `Subcategory Level ${index}`}
                  </InputLabel>
                  <Select
                    labelId={`category-label-${index}`}
                    value={selectedCategories[index] || ''}
                    onChange={e => handleCategoryChange(index, e.target.value)}
                    label={index === 0 ? 'Parent Category' : `Subcategory Level ${index}`} // Add the label prop
                  >
                    {category.children.map(child => (
                      <MenuItem key={child.guid} value={child.guid}>
                        {child.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))} */}
              {/* <FormControl
                fullWidth
                sx={{
                  paddingBottom: 5
                }}
              >
                <InputLabel id='country' error={Boolean(errors.type)}>
                  Select Type *
                </InputLabel>
                <Controller
                  name='type'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select label='Select Type' {...field} error={Boolean(errors.type)}>
                      <MenuItem value='evaluated'>Evaluated</MenuItem>
                      <MenuItem value='practice'>Practice</MenuItem>
                      <MenuItem value='quiz'>Quiz</MenuItem>
                    </Select>
                  )}
                />
                {errors.type && <FormHelperText error>This field is required.</FormHelperText>}
              </FormControl> */}
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
