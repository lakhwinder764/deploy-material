// React Imports
import { useState, useEffect, forwardRef } from 'react'

// MUI Imports
import { useSearchParams } from 'next/navigation'

import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { format, addDays, sub, endOfMonth } from 'date-fns'
import { Checkbox, InputAdornment, ListItemText, TextField, Typography, IconButton, CardActions } from '@mui/material'

import moment from 'moment'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DateRangePicker from '@/Components/Common/DateRangePicker'
import AddEditEnrollmentDialog from '../../AddEditEnrollmentDialog'

const PickersComponent = forwardRef(({ ...props }, ref) => {
  return (
    <TextField
      inputRef={ref}
      fullWidth
      {...props}
      label={props.label || ''}
      className='is-full'
      error={props.error}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton size='small'>
              <i class='ri-calendar-fill'></i>
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  )
})

const EnrollUsersFilters = ({
  setSearchKeyword = () => {},
  localSearch,
  setLocalSearch,
  searchKeyword,
  currentPage,
  rowsPerPage,
  enrollUsersInTest,
  selectedUsers,
  setRowSelection,
  batch,
  setBatch
}) => {
  // States
  const [open, setOpen] = useState(false)

  const searchParams = useSearchParams()
  const guid = searchParams?.get('guid')

  const [startDate, setStartDate] = useState(new Date())
  const [dueDate, setDueDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [screenReader, setScreenReader] = useState(false)
  const [extraTimeField, setExtraTimeField] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleBatchChange = event => {
    const {
      target: { value }
    } = event

    setBatch(typeof value === 'string' ? value.split(',') : value)
  }

  // Format the date to YYYY-MM-DD hh:mm:ss
  const formattedDate = date =>
    date.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0') +
    ' ' +
    String(date.getHours()).padStart(2, '0') +
    ':' +
    String(date.getMinutes()).padStart(2, '0') +
    ':' +
    String(date.getSeconds()).padStart(2, '0')

  const addEnrollments = () => {
    enrollUsersInTest(guid, {
      end_date: formattedDate(new Date(endDate)),
      start_date: formattedDate(new Date(startDate)),
      due_date: formattedDate(new Date(dueDate)),
      users: selectedUsers,
      screen_reader: screenReader,
      extra_time: extraTimeField
    })?.then(() => setOpen(false))
  }

  const handleOpen = () => {
    setOpen(true)
    setRowSelection({})
  }

  //

  //
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchKeyword(localSearch) // Only set search keyword after delay
    }, 500) // 500ms delay

    return () => clearTimeout(delayDebounceFn) // Cleanup the timeout
  }, [localSearch, setSearchKeyword])

  return (
    <>
      <CardContent>
        <Grid container spacing={5} xs={12} display='flex' alignItems='center' pr={0}>
          <Grid item container xs={12} display='flex' justifyContent='space-between'>
            <Grid item xs={3}>
              <Typography fontWeight='bold' fontSize={18}>
                Filter
              </Typography>
            </Grid>
            <Grid item xs={9} display='flex' justifyContent='flex-end'>
              <a
                style={{
                  cursor: 'pointer',
                  color: '#FF4D49',
                  textDecoration: 'underline',
                  fontWeight: 500,
                  fontSize: 15,
                  textUnderlineOffset: 3
                }}
                onClick={() => {
                  setBatch([])
                  setLocalSearch('')
                }}
              >
                Reset Filter
              </a>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <TextField
                size='small'
                sx={{
                  '& .MuiInputBase-root': {
                    height: '40px',
                    minHeight: 'auto'
                  },
                  '& .MuiInputLabel-root': {
                    top: '-7px'
                  }
                }}
                placeholder='Search User'
                fullWidth
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <i
                      class='ri-search-line'
                      style={{
                        color: '#B3B5BD'
                      }}
                    ></i>
                  )
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl
              fullWidth
              sx={{
                '& .MuiInputBase-root': {
                  height: '40px',
                  minHeight: 'auto'
                },
                '& .MuiInputLabel-root': {
                  top: '-7px'
                }
              }}
            >
              <InputLabel id='batch-select'>Batch Selection</InputLabel>
              <Select
                fullWidth
                id='select-batch'
                label='Status'
                size='small'
                value={batch}
                labelId='batch-select'
                multiple
                onChange={handleBatchChange}
                renderValue={selected => selected?.join(', ')}

                // inputProps={{ placeholder: 'Select Status' }}
              >
                <MenuItem key='Batch 1' value='Batch 1'>
                  <Checkbox checked={batch?.indexOf('Batch 1') > -1} />
                  <ListItemText primary='Batch 1' /> {/* Capitalize first letter */}
                </MenuItem>
                <MenuItem key='Batch 2' value='Batch 2'>
                  <Checkbox checked={batch?.indexOf('Batch 2') > -1} />
                  <ListItemText primary='Batch 2' /> {/* Capitalize first letter */}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'flex-start'
        }}
      >
        <Button
          variant='contained'
          color='primary'
          type='submit'
          size='medium'
          sx={{
            width: '10%'
          }}
          onClick={() => {
            setOpen(true)
          }}
        >
          Enroll
        </Button>
      </CardActions>
      <AddEditEnrollmentDialog
        mode='add'
        open={open}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        dueDate={dueDate}
        setDueDate={setDueDate}
        screenReader={screenReader}
        setScreenReader={setScreenReader}
        extraTimeField={extraTimeField}
        setExtraTimeField={setExtraTimeField}
        addEnrollments={addEnrollments}
        handleCancel={handleClose}
        handleConfirm={handleOpen}
      />
    </>
  )
}

export default EnrollUsersFilters
