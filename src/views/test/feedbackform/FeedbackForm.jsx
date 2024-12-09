'use client'
import React, { useState } from 'react'

import {
  Grid,
  Typography,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Box,
  Rating,
  Alert,
  Card
} from '@mui/material'

const FeedbackForm = () => {
  const [rating, setRating] = useState(2) // State for star rating

  const [formData, setFormData] = useState({
    consent: '',
    overallSatisfaction: '',
    instructionsSatisfaction: '',
    preparation: '',
    technicalIssues: '',
    technicalIssueDetails: '',
    examProcess: '',
    examMonitoring: '',
    comfortHandling: '',
    stressLevel: '',
    satisfactionProcess: '',
    otherIssues: '',
    experience: ''
  })

  const handleChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = () => {
    // Submit form data logic
    console.log('Submitted data:', formData)
  }

  return (
    <Box sx={{ p: 10 }}>
      {/* Success Message */}
      <Alert severity='success' sx={{ mb: 10 }}>
        Congratulations John !! Your test has been submitted
      </Alert>

      {/* Form Header */}

      <Card sx={{ padding: 10 }}>
        <Typography variant='h4' sx={{ mb: 5 }}>
          Feedback Form
        </Typography>
        <Grid container spacing={5}>
          {/* Consent Question */}
          <Grid item xs={12}>
            <FormControl component='fieldset'>
              <FormLabel>1. Do you consent to participate in this survey?</FormLabel>
              <RadioGroup row name='consent' value={formData.consent} onChange={handleChange}>
                <FormControlLabel value='yes' control={<Radio />} label='Yes' />
                <FormControlLabel value='no' control={<Radio />} label='No' />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Overall Satisfaction */}
          <Grid item xs={12}>
            <FormControl component='fieldset'>
              <FormLabel>2. Are you satisfied with the overall environment of Online Examination?</FormLabel>
              <RadioGroup row name='overallSatisfaction' value={formData.overallSatisfaction} onChange={handleChange}>
                {[1, 2, 3, 4, 5].map(value => (
                  <FormControlLabel
                    key={value}
                    value={value?.toString()}
                    control={<Radio />}
                    label={value?.toString()}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Instructions Satisfaction */}
          <Grid item xs={12}>
            <FormControl component='fieldset'>
              <FormLabel>3. Are you satisfied with the instructions given by the Exam team?</FormLabel>
              <RadioGroup
                row
                name='instructionsSatisfaction'
                value={formData.instructionsSatisfaction}
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5].map(value => (
                  <FormControlLabel
                    key={value}
                    value={value?.toString()}
                    control={<Radio />}
                    label={value?.toString()}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Preparation Satisfaction */}
          <Grid item xs={12}>
            <FormControl component='fieldset'>
              <FormLabel>4. I was adequately prepared to participate in this Online exam?</FormLabel>
              <RadioGroup row name='preparation' value={formData.preparation} onChange={handleChange}>
                {[1, 2, 3, 4, 5].map(value => (
                  <FormControlLabel
                    key={value}
                    value={value?.toString()}
                    control={<Radio />}
                    label={value?.toString()}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Technical Issues */}
          <Grid item xs={12}>
            <FormControl component='fieldset'>
              <FormLabel>5. Did you face any technical issues in the exam?</FormLabel>
              <RadioGroup row name='technicalIssues' value={formData.technicalIssues} onChange={handleChange}>
                <FormControlLabel value='yes' control={<Radio />} label='Yes' />
                <FormControlLabel value='no' control={<Radio />} label='No' />
              </RadioGroup>
              {formData.technicalIssues === 'yes' && (
                <TextField
                  fullWidth
                  label='If yes, please specify'
                  name='technicalIssueDetails'
                  value={formData.technicalIssueDetails || ''}
                  onChange={handleChange}
                  sx={{ mt: 2 }}
                />
              )}
            </FormControl>
          </Grid>

          {/* Exam Process */}
          <Grid item xs={12}>
            <FormControl component='fieldset'>
              <FormLabel>
                6. The process of this Online examination was ideal for conducting this nature of Exam
              </FormLabel>
              <RadioGroup row name='examProcess' value={formData.examProcess} onChange={handleChange}>
                {[1, 2, 3, 4, 5].map(value => (
                  <FormControlLabel key={value} value={value.toString()} control={<Radio />} label={value.toString()} />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Exam Monitoring */}
          <Grid item xs={12}>
            <FormControl component='fieldset'>
              <FormLabel>7. This Online exam is very effective in monitoring student activities?</FormLabel>
              <RadioGroup row name='examMonitoring' value={formData.examMonitoring} onChange={handleChange}>
                {[1, 2, 3, 4, 5].map(value => (
                  <FormControlLabel key={value} value={value.toString()} control={<Radio />} label={value.toString()} />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Comfort Handling */}
          <Grid item xs={12}>
            <FormControl component='fieldset'>
              <FormLabel>
                8. I was very comfortable in handling the technology and device during this examination?
              </FormLabel>
              <RadioGroup row name='comfortHandling' value={formData.comfortHandling} onChange={handleChange}>
                {[1, 2, 3, 4, 5].map(value => (
                  <FormControlLabel key={value} value={value.toString()} control={<Radio />} label={value.toString()} />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Stress Level */}
          <Grid item xs={12}>
            <FormControl component='fieldset'>
              <FormLabel>9. Participation in this online exam was very stressful?</FormLabel>
              <RadioGroup row name='stressLevel' value={formData.stressLevel} onChange={handleChange}>
                {[1, 2, 3, 4, 5].map(value => (
                  <FormControlLabel key={value} value={value.toString()} control={<Radio />} label={value.toString()} />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Satisfaction with Process */}
          <Grid item xs={12}>
            <FormControl component='fieldset'>
              <FormLabel>10. I am very satisfied with this Online examination process?</FormLabel>
              <RadioGroup row name='satisfactionProcess' value={formData.satisfactionProcess} onChange={handleChange}>
                {[1, 2, 3, 4, 5].map(value => (
                  <FormControlLabel key={value} value={value.toString()} control={<Radio />} label={value.toString()} />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Other Issues */}
          <Grid item xs={12}>
            <FormLabel>11. Other Issues, if any?</FormLabel>
            <TextField
              fullWidth
              label='Kindly decribe here'
              multiline
              rows={3}
              name='otherIssues'
              value={formData.otherIssues}
              onChange={handleChange}
            />
          </Grid>

          {/* Star Rating */}
          <Grid item xs={12}>
            <Typography variant='body1'>12. Your experience in this Online examination</Typography>
            <Rating name='experience' value={rating} onChange={(event, newValue) => setRating(newValue)} />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button variant='contained' color='primary' onClick={handleSubmit}>
              Submit Feedback
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Box>
  )
}

export default FeedbackForm
