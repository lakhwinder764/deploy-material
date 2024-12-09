'use client'

import { Typography, Box, Divider } from '@mui/material'

const QuestionHeader = ({ timeLeft, currentQuestionNumber, totalQuestions, negativeMarking, questionMarks }) => {
  // Helper function to format time as mm:ss
  const formatTime = seconds => {
    if (seconds === null || seconds === undefined || isNaN(seconds)) {
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
            {'00'}
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
            {'00'}
          </Box>
        </Box>
      )
    }

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
          {mins?.toString()?.padStart(2, '0')}
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
          {secs?.toString()?.padStart(2, '0')}
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '30px 30px',
          backgroundColor: '#fff',
          width: '100%'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant='body1'>Question Timer:</Typography>
          {formatTime(timeLeft)}
        </Box>

        <Divider orientation='vertical' flexItem sx={{ margin: '0 16px' }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant='body1'>Negative Marking</Typography>
          <Box
            sx={{
              padding: '10px',
              height: 28,
              borderRadius: 1,
              bgcolor: '#FF4D49',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}
          >
            {negativeMarking}
          </Box>
        </Box>

        <Divider orientation='vertical' flexItem sx={{ margin: '0 16px' }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant='body1'>Question Marks</Typography>
          <Box
            sx={{
              padding: '10px',
              height: 28,
              borderRadius: 1,
              bgcolor: theme => theme?.palette?.customColors?.darkgreen,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {questionMarks}
          </Box>
        </Box>
      </Box>

      <Divider />
    </>
  )
}

export default QuestionHeader
