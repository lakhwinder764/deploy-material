import React from 'react'

import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Checkbox,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Grid,
  CardContent,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material'
import { Controller } from 'react-hook-form'

import useDifficultiesApi from '@/api/useDifficultiesApi'

const QuestionSettings = ({ control, errors }) => {
  const { data } = useDifficultiesApi()

  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Grid container spacing={5} xs={12}>
          <Grid item xs={12} sm={4}>
            <Controller
              name='marks'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type='number'
                  fullWidth
                  label='Marks Per Question *'
                  size='small'
                  placeholder='Marks Per Question'
                  {...(errors.marks && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name='neg_marks'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type='number'
                  fullWidth
                  size='small'
                  label='Negative Marks *'
                  placeholder='Negative Marks'
                  {...(errors.neg_marks && { error: true, helperText: 'This field is required.' })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name='time'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant='outlined'
                  type='number'
                  size='small'
                  {...(errors.time && { error: true, helperText: 'This field is required.' })}
                  placeholder='Time Allowed * '
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position='start'

                        // sx={{
                        //   background: '#fafaf9'
                        // }}
                      >
                        <FormControl
                          sx={{
                            border: 'none'

                            // paddingLeft: 0

                            // background: '#fafaf9'
                          }}
                        >
                          <Controller
                            name='timeValue'
                            control={control}
                            render={({ field }) => (
                              <Select
                                size='small'
                                {...field}
                                sx={{
                                  '& fieldset': {
                                    borderTop: 'none',
                                    borderBottom: 'none',
                                    borderRight: 'none',
                                    borderRadius: 0
                                  } // Removes border from Select
                                  // paddingLeft: 0
                                }}
                              >
                                <MenuItem value='second'>Second</MenuItem>
                                <MenuItem value='minute'>Minute</MenuItem>
                              </Select>
                            )}
                          />
                        </FormControl>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
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
              <InputLabel id='country' error={Boolean(errors.difficulty)}>
                Select difficulty level *
              </InputLabel>
              <Controller
                name='difficulty'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select label='Select difficulty level *' {...field} error={Boolean(errors.difficulty)}>
                    <MenuItem value='high'>High</MenuItem>
                    <MenuItem value='medium'>Medium</MenuItem>
                    <MenuItem value='low'>Low</MenuItem>
                  </Select>
                )}
              />
              {errors.difficulty && <FormHelperText error>This field is required.</FormHelperText>}
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
              <InputLabel id='country' error={Boolean(errors.importance)}>
                Select importance *
              </InputLabel>
              <Controller
                name='importance'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select label='Select importance *' {...field} error={Boolean(errors.importance)}>
                    <MenuItem value='high'>High</MenuItem>
                    <MenuItem value='medium'>Medium</MenuItem>
                    <MenuItem value='low'>Low</MenuItem>
                  </Select>
                )}
              />
              {errors.importance && <FormHelperText error>This field is required.</FormHelperText>}
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
              <Controller
                name='template'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    {...field}
                    size='small'
                    error={Boolean(errors.template)}
                    fullWidth
                    inputProps={{ placeholder: 'Select Template' }}
                  >
                    <MenuItem value='template_1'>Template 1</MenuItem>
                    <MenuItem value='template_2'>Template 2</MenuItem>
                    <MenuItem value='template_3'>Template 3</MenuItem>
                  </Select>
                )}
              />
              {errors.template && <FormHelperText error>This field is required.</FormHelperText>}
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default QuestionSettings
