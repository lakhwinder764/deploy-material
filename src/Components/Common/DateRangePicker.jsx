// React Imports
import { useState, forwardRef } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'

// Third-party Imports
import { format, addDays } from 'date-fns'

// Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

const DateRangePicker = ({ startDate, endDate, handleOnChange, labelText }) => {
  // States

  const CustomInput = forwardRef((props, ref) => {
    const { label, start, end, ...rest } = props

    const startDate = format(start, 'MM/dd/yyyy')
    const endDate = end !== null ? ` - ${format(end, 'MM/dd/yyyy')}` : null

    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return <TextField fullWidth size='small' inputRef={ref} {...rest} label={label} value={value} />
  })

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <AppReactDatepicker
          selectsRange
          endDate={endDate}
          selected={startDate}
          startDate={startDate}
          id='date-range-picker'
          onChange={handleOnChange}
          shouldCloseOnSelect={false}
          customInput={<CustomInput label={labelText} start={startDate} end={endDate} />}
        />
      </Grid>
    </Grid>
  )
}

export default DateRangePicker
