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

import { data } from 'autoprefixer'

import TextEditor from '@/Components/Common/TextEditor'
import ReactQuillLimited from '@/views/categories/list/ReactQuillLimited'

// Vars
const initialData = {
  company: '',
  country: '',
  contact: ''
}

const AddDifficultiesDrawer = props => {
  // Props
  const { open, handleClose, difficultiesData, addDifficultyData } = props

  // States
  const [formData, setFormData] = useState(initialData)
  const [description, setDescription] = useState('')

  const [value, setValue] = useState('')

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
      category: ''
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
      id: (difficultiesData?.length && difficultiesData?.length + 1) || 1,

      // avatar: `/images/avatars/${Math.floor(Math.random() * 8) + 1}.png`,
      title: data?.title,
      description: data?.description,
      type: data?.type,
      category: data?.category,
      created_on: moment().format('YYYY-MM-DD HH:mm:ss'),

      // optional parameters
      created_by: 'ADJ20',
      status: '0'
    }

    addDifficultyData(newUser)

    // return getNewUserData()

    // return res.json()

    // setDifficultiesData([...(difficultiesData ?? []), newUser])
    handleClose()
    setFormData(initialData)
    resetForm({ title: '', description: '', type: '', category: '' })
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
        <Typography variant='h5'>Add Difficulty</Typography>
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
                <Controller
                  name='description'
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
              {/* <FormControl fullWidth>
                <InputLabel id='category' error={Boolean(errors.category)}>
                  Parent Category
                </InputLabel>
                <Controller
                  name='category'
                  control={control}
                  // rules={{ required: true }}
                  render={({ field }) => (
                    <Select label='Parent Category' {...field} error={Boolean(errors.category)}>
                      {difficultiesData
                        ?.filter(item => !item?.parent_guid) // Filter out only the parent categories
                        ?.map(parentCategory => (
                          <MenuItem key={parentCategory?.guid} value={parentCategory?.guid}>
                            {parentCategory?.title}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
                {errors.category && <FormHelperText error>This field is required.</FormHelperText>}
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

export default AddDifficultiesDrawer
