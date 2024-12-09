import { forwardRef, useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  Grid,
  FormControlLabel,
  Typography,
  Checkbox,
  Box,
  TextField,
  IconButton,
  InputAdornment
} from '@mui/material'

import { endOfMonth, format } from 'date-fns'

import moment from 'moment'

import { DatePicker } from '@mui/lab'

import DateRangePicker from '@/Components/Common/DateRangePicker'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

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

const AddEditEnrollmentDialog = ({
  mode = 'add',
  open = true,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  dueDate,
  setDueDate,
  addEnrollments = () => {},
  handleCancel = () => {},
  handleConfirm = () => {},
  screenReader,
  setScreenReader,
  extraTimeField,
  setExtraTimeField
}) => {
  console.info(startDate, 'start')
  const [extraTime, setExtraTime] = useState(false)

  // const [screenReader, setScreenReader] = useState(false)
  // const [extraTimeField, setExtraTimeField] = useState(false)

  console.info(
    moment(new Date('Fri Dec 27 2024 17:02:47 GMT+0530 (India Standard Time)')).format('DD-MM-YYYY HH:MM:SS'),
    'moment'
  )

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      sx={{ '& .MuiDialog-paper': { width: '750px', maxWidth: '750px', height: '500px' } }} // Setting the width and maxWidth
    >
      <DialogTitle id='alert-dialog-title'>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography fontSize={20} fontWeight='bold'>
            {mode === 'add' ? 'Add Enrollment' : 'Edit Enrollment'}
          </Typography>
          <IconButton onClick={handleCancel}>
            <i className='ri-close-line text-actionActive cursor-pointer' />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container xs={12} pt={6}>
          <Grid item container xs={12}>
            <Grid item xs={12} sm={4}>
              <AppReactDatepicker
                selectsStart
                id='event-start-date'
                endDate={moment().format('YYYY-MM-dd')}
                showTimeSelect
                dateFormat='dd-MM-yyyy hh:mm:ss'
                selected={startDate}
                customInput={<PickersComponent label='Start Date' registername='startDate' size='small' />}
                onChange={date => {
                  if (date !== null) {
                    setStartDate(new Date(date))
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} px={2}>
              <AppReactDatepicker
                selectsStart
                endDate={moment().format('YYYY-MM-dd')}
                showTimeSelect
                dateFormat='dd-MM-yyyy hh:mm:ss'
                id='event-start-date'
                selected={dueDate}
                customInput={<PickersComponent label='Due Date' registername='dueDate' size='small' />}
                onChange={date => {
                  if (date !== null) {
                    setDueDate(new Date(date))
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <AppReactDatepicker
                selectsStart
                id='event-start-date'
                endDate={moment().format('YYYY-MM-dd')}
                showTimeSelect
                dateFormat='dd-MM-yyyy hh:mm:ss'
                selected={endDate}
                customInput={<PickersComponent label='End Date' registername='dueDate' size='small' />}
                onChange={date => {
                  if (date !== null) {
                    setEndDate(new Date(date))
                  }
                }}
              />
            </Grid>
          </Grid>
          <Grid item container xs={12}>
            <Box display='flex' flexDirection='column' justifyContent='center' py={6}>
              <Typography fontSize={18} fontWeight='bold'>
                Special Needs
              </Typography>
              <Box display='flex' flexDirection='column' justifyContent='center' py={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={extraTime}
                      onChange={e => {
                        setExtraTime(e?.target?.checked)
                      }}
                    />
                  }
                  label='Extra Time'
                />
                {extraTime && (
                  <Box display='flex' alignItems='center' pt={3}>
                    <TextField
                      value={extraTimeField}
                      onChange={e => setExtraTimeField(e?.target?.value)}
                      placeholder='Extra Time'
                      type='number'
                      size='small'
                      sx={{
                        paddingRight: 2,
                        paddingLeft: 6,
                        width: '55%'
                      }}
                    />
                    <Typography>Min</Typography>
                  </Box>
                )}
              </Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={screenReader}
                    onChange={e => {
                      setScreenReader(e?.target?.checked ? 1 : 0)
                    }}
                  />
                }
                label='Screen Reader'
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCancel}
          style={{ border: '1px solid black', color: 'black', height: '38px', width: '94px' }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleConfirm()
            addEnrollments()
          }}
          variant='contained'
          style={{ height: '38px', width: '94px' }}
          autoFocus
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEditEnrollmentDialog
