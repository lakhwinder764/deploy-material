import React from 'react'

import { Box, Card, Grid, Typography } from '@mui/material'
import borderColor from 'tailwindcss-logical/plugins/borderColor'

const ProgressCard = ({ totalQuestions, currentQuestionIndex, selectedOptions, markForReview }) => {
  // Define reusable box style
  const boxStyle = {
    width: '38px',
    height: '34px',
    border: '1px solid #7D808E',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1,
    color: '#7D808E'
  }

  // Box component with dynamic styles
  const StatusBox = ({ color, number, label }) => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ ...boxStyle, backgroundColor: color }}>
        <Typography>{number}</Typography>
      </Box>
      <Typography sx={{ marginLeft: 2 }}>{label}</Typography>
    </Box>
  )

  // Calculate status counts
  const answeredCount = Object.values(selectedOptions)?.filter(option => option && option !== 'reset')?.length
  const unattendedCount = Object.values(selectedOptions)?.filter(option => option === 'reset')?.length
  const reviewCount = Object.values(markForReview)?.filter(isMarked => isMarked)?.length
  const notVisitedCount = totalQuestions - Object.keys(selectedOptions)?.length

  return (
    <Card
      sx={{
        minHeight: '620px',
        boxShadow: 'none',
        border: 'none',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {/* Content at the top */}
      <Box>
        <Box sx={{ marginBottom: 5 }}>
          <Typography variant='h6'>Test Progress</Typography>
        </Box>

        {/* Grid for questions */}
        <Grid container spacing={2}>
          {Array.from({ length: totalQuestions })?.map((_, index) => {
            let bgColor = 'none' // Default

            if (selectedOptions?.[index] === 'reset') {
              bgColor = '#FF4D49' // Unattended
            } else if (markForReview?.[index]) {
              bgColor = '#FDC453' // Mark for Review
            } else if (selectedOptions?.[index]) {
              bgColor = '#72E128' // Answered
            }

            return (
              <Grid item xs={2} key={index}>
                <Box
                  sx={{
                    ...boxStyle,
                    backgroundColor: bgColor,
                    borderColor: index === currentQuestionIndex ? 'blue' : 'black',
                    color: index === currentQuestionIndex ? 'white' : 'black'
                  }}
                >
                  <Typography>{index + 1}</Typography>
                </Box>
              </Grid>
            )
          })}
        </Grid>
      </Box>

      {/* Status boxes at the bottom */}
      <Grid container spacing={4} sx={{ marginTop: 1, marginBottom: 10 }}>
        <Grid item xs={6}>
          <StatusBox color='#72E128' number={answeredCount} label='Answered' />
        </Grid>

        <Grid item xs={6}>
          <StatusBox color='#FF4D49' number={unattendedCount} label='Unattended' />
        </Grid>

        <Grid item xs={6}>
          <StatusBox color='#FDC453' number={reviewCount} label='Review' />
        </Grid>

        <Grid item xs={6}>
          <StatusBox color='transparent' number={notVisitedCount} label='Not Visited' />
        </Grid>
      </Grid>
    </Card>
  )
}

export default ProgressCard
