import React, { useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Select,
  MenuItem
} from '@mui/material'

const AlertDialogBox = ({
  open,
  handleCancel,
  title,
  textContent,
  handleConfirm,
  rejectedButton = 'Cancel',
  acceptedButton
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: '600px' } }} // Setting the width and maxWidth
    >
      <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>{textContent}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCancel}
          style={{ border: '1px solid black', color: 'black', height: '38px', width: '94px' }}
        >
          {rejectedButton}
        </Button>
        <Button onClick={handleConfirm} variant='contained' style={{ height: '38px', width: '94px' }} autoFocus>
          {acceptedButton}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AlertDialogBox
