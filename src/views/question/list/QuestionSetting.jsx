import React, { useState } from 'react'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material'

const QuestionSettings = ({ open, handleClose, handleSave }) => {
  // State to hold the form values
  const [settings, setSettings] = useState({
    questionType: 'MCQ',
    marksPerQuestion: 2,
    negativeMarks: 2,
    timeAllowed: 20,
    timeUnit: 'Second',
    difficultyLevel: 'Low',
    importance: 'Low'
  })

  // Handle input change
  const handleChange = event => {
    const { name, value } = event.target

    setSettings({
      ...settings,
      [name]: value
    })
  }

  console.log(open, 'open')

  // Render the popup modal
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogTitle>Questions Settings</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin='dense'>
          <InputLabel>Question Type</InputLabel>
          <Select name='questionType' value={settings.questionType} onChange={handleChange}>
            <MenuItem value='MCQ'>MCQ</MenuItem>
            <MenuItem value='True/False'>True/False</MenuItem>
            <MenuItem value='Short Answer'>Short Answer</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label='Marks Per Question'
          name='marksPerQuestion'
          type='number'
          value={settings.marksPerQuestion}
          onChange={handleChange}
          fullWidth
          margin='dense'
        />

        <TextField
          label='Negative Marks Per Question'
          name='negativeMarks'
          type='number'
          value={settings.negativeMarks}
          onChange={handleChange}
          fullWidth
          margin='dense'
        />

        <FormControl fullWidth margin='dense'>
          <TextField
            label='Time Allowed per Question'
            name='timeAllowed'
            type='number'
            value={settings.timeAllowed}
            onChange={handleChange}
          />
          <Select name='timeUnit' value={settings.timeUnit} onChange={handleChange}>
            <MenuItem value='Second'>Second</MenuItem>
            <MenuItem value='Minute'>Minute</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin='dense'>
          <InputLabel>Select Difficulty Level</InputLabel>
          <Select name='difficultyLevel' value={settings.difficultyLevel} onChange={handleChange}>
            <MenuItem value='Low'>Low</MenuItem>
            <MenuItem value='Medium'>Medium</MenuItem>
            <MenuItem value='High'>High</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin='dense'>
          <InputLabel>Select Importance</InputLabel>
          <Select name='importance' value={settings.importance} onChange={handleChange}>
            <MenuItem value='Low'>Low</MenuItem>
            <MenuItem value='Medium'>Medium</MenuItem>
            <MenuItem value='High'>High</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='secondary'>
          Cancel
        </Button>
        <Button onClick={() => handleSave(settings)} color='primary' variant='contained'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default QuestionSettings
