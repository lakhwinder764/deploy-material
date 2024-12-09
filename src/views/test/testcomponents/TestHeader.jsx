import React from 'react'

import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material'

const TestHeader = ({ title, subtitle, timeLeft, buttons, setCollapseCard, collapseCard }) => {
  // Format time as hh:mm:ss
  const formatTime = seconds => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
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
          {hrs?.toString()?.padStart(2, '0')}
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
    <AppBar position='static' component='nav' sx={{ backgroundColor: '#F5F5F7', boxShadow: 'none', border: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between', alignContent: 'center', height: '91px' }}>
        {/* Left section with title and subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '30px' }}>
          <Typography variant='h5' component='div'>
            {title}
          </Typography>
          <Typography variant='body2' component='div'>
            {subtitle}
          </Typography>
        </div>

        {/* Right section with timer and buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          <Typography variant='h6' component='div'>
            Test Timer:
          </Typography>
          <Typography variant='body1' component='div' sx={{ marginRight: '16px' }}>
            {formatTime(timeLeft)} {/* Display formatted time */}
          </Typography>
          {buttons} {/* Render the buttons passed as prop */}
          <IconButton
            size='large'
            edge='start'
            aria-label='menu'
            sx={{ mr: 3 }}
            onClick={() => setCollapseCard(!collapseCard)}
          >
            <i className='ri-menu-fill' />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default TestHeader
