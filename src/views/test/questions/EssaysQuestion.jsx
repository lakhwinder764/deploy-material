import React, { useState } from 'react'

import { Card, CardHeader, CardContent, Grid, Radio, TextField, Typography, FormHelperText } from '@mui/material'

import { Controller } from 'react-hook-form'

import TextEditor from '@/components/Common/TextEditor'
import Reactquill from '@/libs/styles/Reactquill'

const EssaysQuestion = ({ control, errors }) => {
  const [editedText, setEditedText] = useState('')

  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Essays' />

          <CardContent>
            <Grid container item xs={12} pt={4}>
              <Grid item xs={1}>
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 500
                  }}
                  pl={1}
                >
                  Sample Answer
                </Typography>
              </Grid>
              <Grid item xs={11}>
                {/* <TextEditor /> */}
                <Controller
                  name='answer'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextEditor
                      {...field}
                      onChange={content => field.onChange(content)} // update the form state
                      value={field.value || ''} // set the value from the form state
                      autoFocus
                      fullWidth
                      width='70vw'
                      quilleditor
                    />
                  )}
                />
                {errors.answer && <FormHelperText error>This field is required.</FormHelperText>}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default EssaysQuestion
