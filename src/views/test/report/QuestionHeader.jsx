'use client'

import { useEffect, useState } from 'react'

import { Typography, Box, Divider, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const QuestionHeader = ({
  timeLeft,
  currentQuestionNumber,
  totalQuestions,
  negativeMarking,
  questionMarks,
  attemptQuestions,
  notAnsweredQuestions,
  wrongQuestions,
  correctQuestions
}) => {
  const theme = useTheme()

  const reportQuestionsData = [
    {
      label: 'Attempt',
      value: '5',
      bgcolor: 'warning.main',
      divider: true
    },
    {
      label: 'Not Answered',
      value: '4',
      bgcolor: 'common.white',
      divider: true
    },
    {
      label: 'Wrong',
      value: '2',
      bgcolor: 'error.main',
      divider: true
    },
    {
      label: 'Correct',
      value: '3',
      bgcolor: 'customColors.darkgreen',
      divider: false
    }
  ]

  // Helper function to format time as mm:ss
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            padding: '8px',
            height: 32,
            borderRadius: 1,
            bgcolor: '#FFDBDB',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {mins.toString().padStart(2, '0')}
        </Box>
        :
        <Box
          sx={{
            padding: '8px',
            height: 32,
            borderRadius: 1,
            bgcolor: '#FFDBDB',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {secs.toString().padStart(2, '0')}
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Grid container p={4} xs={12} display='flex' alignItems='center' bgcolor='var(--mui-palette-common-white)'>
        {reportQuestionsData?.map(item => (
          <Grid item xs={item?.label === 'Not Answered' ? 2 : 1.5} key={item}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='body1'>{item?.label} : </Typography>
              <Box
                mx={2}
                p={3}
                height={28}
                width='30%'
                borderRadius={1}
                bgcolor={item?.bgcolor}
                border={`${item?.label === 'Not Answered' && `1px solid ${theme?.palette?.common?.black}`}`}
                display='flex'
                alignItems='center'
                justifyContent='center'
                color={item?.label === 'Not Answered' ? 'common.black' : 'common.white'}
              >
                {item?.value}
              </Box>
              {item?.divider && (
                <Box display='flex' height='3vh' mx={1}>
                  <Divider
                    orientation='vertical'
                    flexItem
                    sx={{ backgroundColor: theme => theme?.palette?.common?.black }}
                  />
                </Box>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Divider />
    </>
  )
}

export default QuestionHeader
