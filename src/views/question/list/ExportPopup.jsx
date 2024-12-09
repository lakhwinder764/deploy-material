'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button
} from '@mui/material'

const ExportPopup = ({ open, onClose, onExport }) => {
  const [selectedFormat, setSelectedFormat] = useState('')

  const handleExport = () => {
    if (selectedFormat) {
      onExport(selectedFormat)
    } else {
      alert('Please select a format before exporting.')
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          width: '600px', // Set dialog width
          maxWidth: '600px', // Prevent width from exceeding 600px
          position: 'relative'
        }
      }}
    >
      <DialogTitle>Export Questions</DialogTitle>
      <i
        class='ri-close-line'
        style={{
          position: 'absolute',
          top: 24,
          right: 11,
          cursor: 'pointer'
        }}
        onClick={onClose}
      />
      <DialogContent>
        <FormControl component='fieldset'>
          <FormLabel component='legend'>Which Format Do You Want to Export the File To?</FormLabel>
          <RadioGroup value={selectedFormat} onChange={e => setSelectedFormat(e.target.value)}>
            <FormControlLabel value='pdf' control={<Radio />} label='PDF' />
            <FormControlLabel value='doc' control={<Radio />} label='Docs' />
            <FormControlLabel value='csv' control={<Radio />} label='CSV' />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={handleExport} color='primary' variant='contained'>
          Export
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ExportPopup
