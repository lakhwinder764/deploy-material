'use client'

import { AppBar, Toolbar, Button } from '@mui/material'
import React from 'react'

const QuestionFooter = ({ handleNext, handlePrevious, disablePrevious, disableNext }) => {
  return (
    <AppBar
      position='fixed'
      color='primary'
      sx={{ top: 'auto', bottom: 0, backgroundColor: '#F5F5F7', justifyContent: 'space-between' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', height: '76px' }}>
        <Button variant='outlined' onClick={handlePrevious} disabled={disablePrevious}>
          Previous
        </Button>
        <Button variant='contained' color='primary' onClick={handleNext} disabled={disableNext}>
          Next
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default QuestionFooter
