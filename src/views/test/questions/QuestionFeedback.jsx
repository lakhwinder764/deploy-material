import { Box, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'

import { Controller } from 'react-hook-form'

import TextEditor from '@/components/Common/TextEditor'
import Reactquill from '@/libs/styles/Reactquill'

const QuestionFeedback = ({ control }) => {
  return (
    <Grid item xs={12} py={4}>
      <Card>
        <CardContent>
          <Grid container item xs={12}>
            <Grid item xs={12}>
              <Typography fontWeight='bold' pb={3}>
                Feedback For Student
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='answer_feedback'
                control={control}
                render={({ field }) => (
                  <TextEditor
                    {...field}
                    onChange={content => field.onChange(content)} // update the form state
                    value={field.value || ''}
                    autoFocus
                    fullWidth
                    quilleditor
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} pt={6}>
            <Grid item xs={12}>
              <Typography fontWeight='bold' pb={3}>
                Answer Feedback (For Instructor Only)
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='feedback_for_instructor'
                control={control}
                render={({ field }) => (
                  <TextEditor
                    {...field}
                    onChange={content => field.onChange(content)} // update the form state
                    value={field.value || ''}
                    autoFocus
                    fullWidth
                    quilleditor
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default QuestionFeedback
