import React, { useState } from 'react'

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material'

function MyDialog() {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = () => {
    // Handle the submit action here
    console.log('Submitted value:', inputValue)
    handleClose()
  }

  return (
    <div>
      <Button variant='outlined' onClick={handleClickOpen}>
        Open Dialog
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Enter Your Text</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter some text below:</DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            label='Your Text'
            type='text'
            fullWidth
            variant='standard'
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default MyDialog
