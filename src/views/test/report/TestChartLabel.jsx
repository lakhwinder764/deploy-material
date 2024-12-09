import { Box, Typography } from '@mui/material'

const TestChartLabel = () => {
  return (
    <div className='flex justify-center flex-wrap gap-6'>
      <Box className='flex items-center gap-1.5' sx={{ '& i': { color: '#ff716d' } }}>
        <i className='ri-circle-fill text-xs' />
        <Typography variant='body2'>Incorrect Answered</Typography>
      </Box>
      <Box className='flex items-center gap-1.5' sx={{ '& i': { color: '#8ee753' } }}>
        <i className='ri-circle-fill text-xs' />
        <Typography variant='body2'>Correct Answered</Typography>
      </Box>
      <Box className='flex items-center gap-1.5' sx={{ '& i': { color: '#fdc453' } }}>
        <i className='ri-circle-fill text-xs' />
        <Typography variant='body2'>*Unanswered</Typography>
      </Box>
    </div>
  )
}

export default TestChartLabel
