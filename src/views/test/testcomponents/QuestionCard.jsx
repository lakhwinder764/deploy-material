import React from 'react'

import {
  Card,
  CardContent,
  Divider,
  Typography,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox
} from '@mui/material'

const QuestionCard = ({
  questionText,
  description,
  options,
  selectedOption,
  onOptionChange,
  onMarkForReviewChange,
  totalQuestions,
  currentQuestionIndex
}) => {
  const handleOptionChange = event => {
    onOptionChange(event.target.value)
  }

  const handleResetChoices = () => {
    onOptionChange('reset')
  }

  const handleMarkForReviewChange = event => {
    onMarkForReviewChange(event.target.checked)
  }

  return (
    <Card sx={{ minHeight: '550px', boxShadow: 'none', border: 'none' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Typography variant='body2'>
          {currentQuestionIndex + 1} of {totalQuestions}
        </Typography>
        <Typography variant='h6'>{questionText}</Typography>
        <Typography variant='body1'>{description}</Typography>

        <Divider />

        <Box>
          <FormControl>
            <RadioGroup value={selectedOption} onChange={handleOptionChange}>
              {options?.map((option, index) => (
                <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
              ))}
              <FormControlLabel
                value='reset'
                control={<Radio />}
                label='Leave Unattended'
                onClick={handleResetChoices}
              />
            </RadioGroup>

            <FormControlLabel
              control={<Checkbox size='small' onChange={handleMarkForReviewChange} />}
              sx={{ paddingLeft: 1 }}
              label='Mark for Review'
            />
          </FormControl>
        </Box>
      </CardContent>
    </Card>
  )
}

export default QuestionCard
