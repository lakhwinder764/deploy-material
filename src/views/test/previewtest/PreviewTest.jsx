'use client'

import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import Footer from '@/@layouts/components/horizontal/Footer'
import Header from '@/@layouts/components/horizontal/Header'
import QuestionContainer from './QuestionContainer'
import TestHeader from '../testcomponents/TestHeader'

const PreviewTest = () => {
  const initialTime = 100 // Set timer manually
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [openDialog, setOpenDialog] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1
        } else {
          clearInterval(timerInterval)
          setOpenDialog(true)
          return 0
        }
      })
    }, 1000)

    return () => clearInterval(timerInterval)
  }, [])

  const handleDialogClose = () => {
    setOpenDialog(false)
    router.push('/test/submit')
  }

  // Buttons passed to CustomAppBar
  const buttons = (
    <>
      <Button variant='contained' color='primary' onClick={() => router.push('/test/manage')}>
        Cancel Preview
      </Button>
    </>
  )

  return (
    <>
      <Header>
        <TestHeader
          title='Preview Test'
          subtitle='Mathematics Test'
          timeLeft={timeLeft} // Passing timeLeft as a prop
          buttons={buttons} // Passing buttons as a prop
        />
      </Header>

      <QuestionContainer />

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby='time-up-dialog-title'
        aria-describedby='time-up-dialog-description'
      >
        <DialogTitle id='time-up-dialog-title'>Time is Up!</DialogTitle>
        <DialogContent>
          <DialogContentText id='time-up-dialog-description'>
            Your test time is over. Please submit the test.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant='contained' color='primary'>
            Submit Test
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PreviewTest
