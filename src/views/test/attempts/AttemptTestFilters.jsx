// React Imports
import { useState, useEffect, forwardRef } from 'react'

// MUI Imports
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

const AttemptTestFilters = ({ setData, tableData, globalFilter, setGlobalFilter, type, testSubmissions, group }) => {
  // States
  const [types, setTypes] = useState([])
  const [status, setStatus] = useState([])
  const [dueDate, setDueDate] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  //date states

  //attempted date states
  const now = new Date()
  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1))
  const [endDate, setEndDate] = useState(endOfMonth(new Date()))

  //

  // submission date states

  const [submissionStartDate, setSubmissionStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1))
  const [submissionEndDate, setSubmissionEndDate] = useState(endOfMonth(new Date()))

  console.info(endDate)

  //

  //

  useEffect(() => {
    // testSubmissions(guid)
    const data = {
      guid: 'MAT3',
      startDate,
      endDate,
      submissionStartDate,
      submissionEndDate
    }

    testSubmissions(data)
  }, [startDate, endDate, submissionStartDate, submissionEndDate])

  // date function handlers

  const handleOnChange = dates => {
    const [start, end] = dates

    setStartDate(start)
    setEndDate(end)
  }

  const handleSubmissionDateRange = dates => {
    const [start, end] = dates

    setSubmissionStartDate(start)
    setSubmissionEndDate(end)
  }

  //

  const handleSearch = event => {
    const value = event.target.value

    setSearchTerm(value)

    const filtered = tableData?.filter(item => {
      const fullName = `${item?.first_name} ${item?.last_name}`

      return fullName?.toLowerCase()?.includes(value?.toLowerCase())
    })

    setData(filtered)
  }

  useEffect(() => {
    const filteredData = tableData?.filter(user => {
      if (user?.status === 'Expired' && status?.length) {
        if (status?.length && !status?.includes('Expired')) return false
      }

      if (user?.status === 'Submitted' && status?.length) {
        if (status?.length && !status?.includes('Submitted')) return false
      }

      if (user?.status === 'NotStarted' && status?.length) {
        if (status?.length && !status?.includes('NotStarted')) return false
      }

      if (user?.status === 'InProgress' && status?.length) {
        if (status?.length && !status?.includes('InProgress')) return false
      }

      // if (types?.length > 0 && !types?.includes(user?.type)) return false
      // const attemptedDate = new Date(user?.start_time)
      // const submittedDate = new Date(user?.submit_time)

      // if (startDate || endDate) {
      //   const start = new Date(startDate)
      //   const end = new Date(endDate)
      //   const submissionStart = new Date(submissionStartDate)
      //   const submissionEnd = new Date(submissionEndDate)

      //   return (
      //     (!startDate || attemptedDate >= start) &&
      //     (!endDate || attemptedDate <= end) &&
      //     (!submissionStartDate || submittedDate >= submissionStart) &&
      //     (!submissionEndDate || submittedDate <= submissionEnd)
      //   )
      // }

      // if (submissionStartDate || submissionEndDate) {
      //   const submissionStart = new Date(submissionStartDate)
      //   const submissionEnd = new Date(submissionEndDate)

      //   return (
      //     (!submissionStartDate || submittedDate >= submissionStart) &&
      //     (!submissionEndDate || submittedDate <= submissionEnd)
      //   )
      // }

      // }

      return true
    })

    setData(filteredData || [])
  }, [type, status, tableData, setData, types, startDate, endDate, submissionStartDate, submissionEndDate])

  const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
    // States
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])
    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return (
      <TextField
        {...props}
        size='small'
        value={value}
        onChange={e => setValue(e.target.value)}
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
    )
  }

  const handleTypeChange = event => {
    const {
      target: { value }
    } = event

    setTypes(typeof value === 'string' ? value.split(',') : value)
  }

  const handleStartDate = date => {
    if (date && date > endDate) {
      setDueDate(new Date(date))
      setEndDate(new Date(date))
    }
  }

  const handleStatusChange = event => {
    const {
      target: { value }
    } = event

    setStatus(typeof value === 'string' ? value.split(',') : value)
  }

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
                  setStatus([])
                  setGlobalFilter('')
                  setTypes([])
                  setStartDate(new Date(now.getFullYear(), now.getMonth(), 1))
                  setEndDate(endOfMonth(new Date()))
                  setSubmissionStartDate(new Date(now.getFullYear(), now.getMonth(), 1))
                  setSubmissionEndDate(endOfMonth(new Date()))
                }}
              >
                Reset Filter
              </a>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={3}>
            {/* <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search User'
              className='max-sm:is-full'
            /> */}
            <FormControl fullWidth>
              <TextField
                size='small'
                value={searchTerm}
                onChange={handleSearch}
                placeholder='Search User'
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
            {/* </> */}
          </Grid>
          <Grid item xs={12} sm={3}>
            {/* <AppReactDatepicker
            selects
            id='event-attempt-date'
            endDate={endDate}
            selected={dueDate}
            startDate={dueDate}
            showTimeSelect
            dateFormat='yyyy-MM-dd'
            customInput={<PickersComponent label='Attempt Date' registername='startDate' size='small' />}
            onChange={date => date !== null && setDueDate(new Date(date))}
            onSelect={handleStartDate}
          /> */}
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              handleOnChange={handleOnChange}
              labelText='Attempt Date'
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            {/* <AppReactDatepicker
            selectsEnd
            id='event-submission-date'
            endDate={endDate}
            selected={endDate}
            minDate={dueDate}
            startDate={dueDate}
            showTimeSelect
            dateFormat='yyyy-MM-dd hh:mm:ss'
            customInput={<PickersComponent label='Submission Date' registername='endDate' size='small' />}
            onChange={date => date !== null && setEndDate(new Date(date))}
          /> */}
            <DateRangePicker
              startDate={submissionStartDate}
              endDate={submissionEndDate}
              handleOnChange={handleSubmissionDateRange}
              labelText='Submission Date'
            />
          </Grid>
          <Grid item xs={12} sm={3}>
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
              <InputLabel id='status-select'>Status</InputLabel>
              <Select
                fullWidth
                id='select-status'
                label='Status'
                size='small'
                value={status}
                labelId='status-select'
                multiple
                onChange={handleStatusChange}
                renderValue={selected => selected?.join(', ')}

                // inputProps={{ placeholder: 'Select Status' }}
              >
                <MenuItem key='Submitted' value='Submitted'>
                  <Checkbox checked={status?.indexOf('Submitted') > -1} />
                  <ListItemText primary='Submitted' /> {/* Capitalize first letter */}
                </MenuItem>
                <MenuItem key='Expired' value='Expired'>
                  <Checkbox checked={status?.indexOf('Expired') > -1} />
                  <ListItemText primary='Expired' /> {/* Capitalize first letter */}
                </MenuItem>
                <MenuItem key='NotStarted' value='NotStarted'>
                  <Checkbox checked={status?.indexOf('NotStarted') > -1} />
                  <ListItemText primary='Not Started' /> {/* Capitalize first letter */}
                </MenuItem>
                <MenuItem key='InProgress' value='InProgress'>
                  <Checkbox checked={status?.indexOf('InProgress') > -1} />
                  <ListItemText primary='In Progress' /> {/* Capitalize first letter */}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
      {!group && (
        <CardActions
          sx={{
            display: 'flex',
            justifyContent: 'flex-start'
          }}
        >
          <Button variant='contained' color='primary' type='submit' size='medium' onClick={() => {}}>
            Send Email
          </Button>
        </CardActions>
      )}
    </>
  )
}

export default AttemptTestFilters
