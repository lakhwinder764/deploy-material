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
import DateRangePicker from '@/components/Common/DateRangePicker'
import SortingEnrollments from './SortingEnrollments'

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

const EnrollmentTestFilters = ({
  setData,
  tableData,
  globalFilter,
  setGlobalFilter,
  type,
  testSubmissions,
  group,
  setSearchKeyword,
  localSearch,
  setLocalSearch,
  searchKeyword,
  currentPage,
  rowsPerPage,
  mainStartDate,
  setMainStartDate,
  mainEndDate,
  setMainEndDate,
  setMainDueDate,
  mainDueDate,
  enrollmentStatus,
  setEnrollmentStatus,
  usersData,
  setUsersData
}) => {
  // States

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchKeyword(localSearch) // Only set search keyword after delay
    }, 500) // 500ms delay

    return () => clearTimeout(delayDebounceFn) // Cleanup the timeout
  }, [localSearch, setSearchKeyword])

  const handleEnrollmentChange = event => {
    const {
      target: { value }
    } = event

    setEnrollmentStatus(typeof value === 'string' ? value.split(',') : value)
  }

  const handleUsersChange = event => {
    const {
      target: { value }
    } = event

    setUsersData(typeof value === 'string' ? value.split(',') : value)
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
                  setEnrollmentStatus([])
                  setUsersData([])
                  setMainStartDate(new Date())
                  setMainEndDate(new Date())
                  setMainDueDate(new Date())
                  setLocalSearch('')
                }}
              >
                Reset Filter
              </a>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <TextField
                size='small'
                sx={{
                  '& .MuiInputBase-root': {
                    height: '40px',
                    minHeight: 'auto',
                    width: '70%'
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
          <Grid item xs={12} sm={2.1}>
            <AppReactDatepicker
              selectsStart
              id='event-start-date'
              endDate={moment().format('YYYY-MM-dd')}
              showTimeSelect
              dateFormat='dd-MM-yyyy hh:mm:ss'
              selected={mainStartDate}
              customInput={<PickersComponent label='Start Date' registername='mainStartDate' size='small' />}
              onChange={date => {
                if (date !== null) {
                  setMainStartDate(new Date(date))
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2.1}>
            <AppReactDatepicker
              selectsStart
              id='event-start-date'
              endDate={moment().format('YYYY-MM-dd')}
              showTimeSelect
              dateFormat='dd-MM-yyyy hh:mm:ss'
              selected={mainDueDate}
              customInput={<PickersComponent label='Due Date' registername='mainDueDate' size='small' />}
              onChange={date => {
                if (date !== null) {
                  setMainDueDate(new Date(date))
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2.2}>
            <AppReactDatepicker
              selectsStart
              id='event-start-date'
              mainEndDate={moment().format('YYYY-MM-dd')}
              showTimeSelect
              dateFormat='dd-MM-yyyy hh:mm:ss'
              selected={mainEndDate}
              customInput={<PickersComponent label='End Date' registername='mainEndDate' size='small' />}
              onChange={date => {
                if (date !== null) {
                  setMainEndDate(new Date(date))
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={1.3}>
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
                value={enrollmentStatus}
                labelId='status-select'
                multiple
                onChange={handleEnrollmentChange}
                renderValue={selected => selected?.join(', ')}

                // inputProps={{ placeholder: 'Select Status' }}
              >
                <MenuItem key='Enroll' value='Enroll'>
                  <Checkbox checked={enrollmentStatus?.indexOf('Enroll') > -1} />
                  <ListItemText primary='Enroll' /> {/* Capitalize first letter */}
                </MenuItem>
                <MenuItem key='Unenroll' value='Unenroll'>
                  <Checkbox checked={enrollmentStatus?.indexOf('Unenroll') > -1} />
                  <ListItemText primary='Unenroll' /> {/* Capitalize first letter */}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={1.3}>
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
              <InputLabel id='status-select'>User</InputLabel>
              <Select
                fullWidth
                id='select-status'
                label='Status'
                size='small'
                value={usersData}
                labelId='status-select'
                multiple
                onChange={handleUsersChange}
                renderValue={selected => selected?.join(', ')}
              >
                <MenuItem key='Special Needs' value='Special Needs'>
                  <Checkbox checked={usersData?.indexOf('Special Needs') > -1} />
                  <ListItemText primary='Special Needs' /> {/* Capitalize first letter */}
                </MenuItem>
                <MenuItem key='No Special Needs' value='No Special Needs'>
                  <Checkbox checked={usersData?.indexOf('No Special Needs') > -1} />
                  <ListItemText primary='No Special Needs' /> {/* Capitalize first letter */}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={12} display='flex' justifyContent='flex-end' py={2}>
          <SortingEnrollments />
        </Grid>
      </CardContent>
    </>
  )
}

export default EnrollmentTestFilters
