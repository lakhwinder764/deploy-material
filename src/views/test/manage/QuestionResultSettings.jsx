import { forwardRef, useState } from 'react'

import {
  Card,
  CardContent,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  TextField,
  Box,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

import moment from 'moment'

import QuestionGeneralSettingsTimingSection from './QuestionGeneralSettingsTimerSection'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import Reactquill from '@/libs/styles/Reactquill'

const QuestionResultSettings = ({ testSettings, guid, formState, setFormState }) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
    getValues,
    setValue
  } = useForm()

  console.info(formState)
  const formValues = watch()

  const [date, setDate] = useState(new Date())
  const [dateData, setDateData] = useState(false)

  const handleNewSubmit = data => {
    testSettings(guid, data)
  }

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

  return (
    <form onSubmit={handleSubmit(handleNewSubmit)}>
      <Grid container spacing={5} xs={12}>
        <Grid item xs={12}>
          <Card
            sx={{
              marginTop: 3
            }}
          >
            <CardContent>
              <QuestionGeneralSettingsTimingSection control={control} heading='Show Result'>
                <Controller
                  name='show_result'
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      <FormControlLabel
                        value='immediately'
                        control={<Radio />}
                        label='Immediately after test submissions'
                        onChange={() => setDateData(false)}
                      />
                      <FormControlLabel
                        value='manually'
                        control={<Radio />}
                        label='Manually at a later date'
                        onChange={() => setDateData(false)}
                      />
                      <FormControlLabel
                        value='all_users_sub'
                        control={<Radio />}
                        label='All users have submitted'
                        onChange={() => setDateData(false)}
                      />
                      <Box display='flex' alignItems='center'>
                        <FormControlLabel
                          value='on_date'
                          control={<Radio />}
                          label='On date'
                          onChange={() => setDateData(true)}
                        />
                        <AppReactDatepicker
                          disabled={!dateData}
                          selectsStart
                          id='event-start-date'
                          endDate={moment().format('YYYY-MM-dd')}
                          showTimeSelect
                          dateFormat='dd-MM-yyyy hh:mm:ss'
                          selected={date}
                          customInput={<PickersComponent label='' registername='startDate' size='small' />}
                          onChange={date => {
                            if (date !== null) {
                              setDate(new Date(date))
                              setValue('on_date', moment(date)?.format('DD-MM-YYYY hh:mm:ss'))
                            }
                          }}
                        />
                      </Box>
                    </RadioGroup>
                  )}
                />
              </QuestionGeneralSettingsTimingSection>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card
            sx={{
              marginTop: 3
            }}
          >
            <CardContent>
              <QuestionGeneralSettingsTimingSection control={control} heading='Attempts Settings'>
                <Controller
                  name='attempt_type'
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      <FormControlLabel value='best_marks' control={<Radio />} label='Best of the marks' />
                      <FormControlLabel value='average_marks' control={<Radio />} label='Average of the marks' />
                      <FormControlLabel value='lowest_marks' control={<Radio />} label='Lowest of the marks' />
                      <FormControlLabel value='first_attempt' control={<Radio />} label='First attempt' />
                      <FormControlLabel value='last_attempt' control={<Radio />} label='Last attempt' />
                      <Box display='flex' alignItems='center' width='100%'>
                        <Box>
                          <FormControlLabel value='attempt_number' control={<Radio />} label='Attempt number' />
                        </Box>
                        {formValues?.attempt_type === 'attempt_number' && (
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
                            <Controller
                              name='no_of_attempts'
                              control={control}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  size='small'
                                  fullWidth
                                  inputProps={{ placeholder: 'Attempts Number' }}
                                >
                                  <MenuItem value='one'>1</MenuItem>
                                  <MenuItem value='two'>2</MenuItem>
                                  <MenuItem value='three'>3</MenuItem>
                                </Select>
                              )}
                            />
                          </FormControl>
                        )}
                      </Box>
                    </RadioGroup>
                  )}
                />
              </QuestionGeneralSettingsTimingSection>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }} py={3}>
          <Button size='small' type='submit' variant='contained'>
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default QuestionResultSettings
