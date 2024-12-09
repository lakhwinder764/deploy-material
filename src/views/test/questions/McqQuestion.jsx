import { useState } from 'react'

import {
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  FormHelperText,
  IconButton,
  InputAdornment,
  Grid,
  CardContent,
  CardActions,
  TextField,
  Typography,
  FormControlLabel
} from '@mui/material'

import { Controller } from 'react-hook-form'

import TextEditor from '@/components/Common/TextEditor'
import Reactquill from '@/libs/styles/Reactquill'

const McqQuestion = ({ mcqFields, setMcqFields, control, error }) => {
  // Function to handle input text change
  const [openFeedback, setOpenFeedback] = useState(false)
  const [openField, setOpenField] = useState(null)
  const [openTextFieldIds, setOpenTextFieldIds] = useState([])

  const toggleTextField = itemId => {
    setOpenTextFieldIds(prevIds => {
      if (prevIds?.includes(itemId)) {
        // If the text field for this item is open, remove it from the state
        return prevIds?.filter(id => id !== itemId)
      } else {
        // If it's not open, add the item ID to the state
        return [...prevIds, itemId]
      }
    })
  }

  const handleInputChange = (index, content) => {
    const newFields = [...mcqFields]

    newFields[index].choice = content
    setMcqFields(newFields)
  }

  const handleFeedbackInputChange = (index, feedback) => {
    const newFields = [...mcqFields]

    newFields[index].feedback = feedback
    setMcqFields(newFields)
  }

  // Function to handle checkbox change
  const handleCheckboxChange = index => {
    const newFields = [...mcqFields]

    newFields[index].correct_answer = !newFields[index].correct_answer

    setMcqFields(newFields)
  }

  // Delete item from the list
  const deleteItem = index => {
    const newItems = mcqFields?.filter((_, i) => i !== index)

    setMcqFields(newItems)
  }

  // Function to add a new text field and checkbox
  const addField = () => {
    const newField = { id: mcqFields?.length + 1, choice: '', correct_answer: false, feedback: '', remove: true }

    setMcqFields([...mcqFields, newField])
  }

  return (
    <Grid item xs={12} py={4}>
      <Card>
        <CardHeader title='Answer Choices' />
        <CardContent>
          {mcqFields?.map((field, index) => (
            <Grid
              container
              item
              xs={12}
              key={field?.id}
              display='flex'
              justifyContent='flex-start'
              alignItems='flex-start'
              py={3}
            >
              <Grid item xs={12} md={0.5} sx={{ xs: { p: 0 }, md: { p: 1 } }}>
                <Checkbox checked={field?.correct_answer} onChange={() => handleCheckboxChange(index)} />
              </Grid>
              <Grid item xs={12} md={11}>
                <TextEditor
                  value={field?.choice}
                  onChange={content => {
                    handleInputChange(index, content)
                  }}
                  style={{ backgroundColor: 'white' }}
                  autoFocus
                  fullWidth
                  quilleditor
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={0.5}
                onClick={() => deleteItem(index)}
                sx={{
                  cursor: 'pointer',
                  p: 2
                }}
              >
                {field?.remove && <i class='ri-close-circle-line'></i>}
              </Grid>
              <Grid item xs={12} sx={{ pl: 12, pt: 5 }}>
                <Typography
                  component='a'
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{ textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }} // Optional: to style the link
                  onClick={() => {
                    setOpenFeedback(!openFeedback)
                    setOpenField(field?.id)
                    toggleTextField(field?.id)
                  }}
                >
                  Feedback
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ pt: 3, pl: 12 }}>
                {openTextFieldIds?.includes(field?.id) && (
                  <Grid item xs={12} md={11.5}>
                    <TextEditor
                      {...field}
                      value={field?.feedback}
                      onChange={content => {
                        handleFeedbackInputChange(index, content)
                      }}
                      style={{ backgroundColor: 'white' }}
                      autoFocus
                      fullWidth
                      quilleditor
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          ))}
        </CardContent>
        <CardActions
          sx={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <Controller
            name='randomize_questions'
            control={control}
            render={({ field }) => (
              <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label='Randomize Questions' />
            )}
          />

          <Button variant='outlined' color='primary' type='reset' onClick={addField}>
            Add Answer Choice
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
}

export default McqQuestion
