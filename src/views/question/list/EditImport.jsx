import React, { useEffect, useState } from 'react'

import {
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Select,
  Checkbox,
  FormControl,
  InputLabel,
  Typography
} from '@mui/material'

import Reactquill from '../list/Reactquill'
import FilterHeader from '@/Components/globals/FilterHeader'
import QuestionUpload from '@/views/test/questions/QuestionUpload'

const EditImport = ({ question, onSave }) => {
  const [questionData, setQuestionData] = useState({
    question: question.text || '',
    type: question.type || 'mcmc',
    marksPerQuestion: '',
    negativeMarks: '',
    timeAllowed: '',
    timeUnit: 'Minute',
    difficulty: '',
    importance: '',
    choices: question.options.map((option, index) => ({
      choice: option,
      correct_answer: question.correctanswer[index] === 1 ? '1' : '0'
    }))
  })

  // Handle Quill changes
  const handleQuillChange = value => {
    setQuestionData(prevState => ({
      ...prevState,
      question: value
    }))
  }

  // Handle form input changes
  const handleInputChange = e => {
    const { name, value } = e.target

    setQuestionData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  // Handle choice changes
  const handleChoiceChange = (value, index) => {
    const updatedChoices = questionData.choices.map((choice, idx) => ({
      ...choice,
      choice: idx === index ? value : choice.choice
    }))

    setQuestionData(prevState => ({
      ...prevState,
      choices: updatedChoices
    }))
  }

  // Handle correct answer selection
  const handleSelectCorrectAnswer = index => {
    const updatedChoices = questionData.choices.map((choice, idx) => ({
      ...choice,
      correct_answer: idx === index ? '1' : '0'
    }))

    setQuestionData(prevState => ({
      ...prevState,
      choices: updatedChoices
    }))
  }

  const handleSave = () => {
    // Prepare updated data structure to match parent component’s format
    const updatedQuestion = {
      ...question,
      text: questionData.question,
      options: questionData.choices.map(choice => choice.choice),
      correctanswer: questionData.choices.map(choice => (choice.correct_answer === '1' ? 1 : 0))
    }

    // Send updated data back to parent component
    onSave(updatedQuestion)
  }

  const questionTypeMapping = {
    mcmc: 'Multiple Choice Question',
    fib: 'Fill in the Blanks',
    tf: 'True/False',
    essay: 'Essay'
  }

  console.log(questionData, 'questionData')

  return (
    <>
      <FilterHeader title='Edit Question' subtitle='Update question details' link='/test/list' />
      <Box sx={{ padding: 4 }}>
        <form>
          <Card>
            <CardContent>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ '& .MuiInputBase-root': { height: '40px' } }}>
                  <InputLabel id='question-type'>Question Type</InputLabel>
                  <Select labelId='question-type' value={questionData.type} readOnly>
                    <MenuItem value={questionData.type} disabled>
                      {questionTypeMapping[questionData.type] || 'Unknown Type'}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardHeader title='Question' />
            <CardContent>
              <Reactquill value={questionData.question} onChange={handleQuillChange} />
              <QuestionUpload />
            </CardContent>
          </Card>

          {/* <Card sx={{ mt: 2 }}>
            <CardContent>
              <Grid container spacing={2} py={4}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label='Marks Per Question *'
                    name='marksPerQuestion'
                    value={questionData.marksPerQuestion}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label='Negative Marks *'
                    name='negativeMarks'
                    value={questionData.negativeMarks}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label='Time Allowed *'
                    name='timeAllowed'
                    value={questionData.timeAllowed}
                    onChange={handleInputChange}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <Select
                          value={questionData.timeUnit}
                          name='timeUnit'
                          onChange={handleInputChange}
                          sx={{ ml: 4 }}
                        >
                          <MenuItem value='Second'>Second</MenuItem>
                          <MenuItem value='Minute'>Minute</MenuItem>
                        </Select>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card> */}

          <Card sx={{ mt: 2 }}>
            <CardHeader title='Answer Choices:' />
            <CardContent>
              {questionData.choices.map((choice, index) => (
                <Grid container alignItems='center' spacing={2} key={index}>
                  <Grid item xs={1}>
                    <Checkbox
                      checked={choice.correct_answer === '1'}
                      onChange={() => handleSelectCorrectAnswer(index)}
                    />
                  </Grid>
                  <Grid item xs={11} sx={{ mb: 2 }}>
                    <Reactquill value={choice.choice} onChange={value => handleChoiceChange(value, index)} />
                  </Grid>
                </Grid>
              ))}
            </CardContent>
          </Card>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button variant='contained' color='primary' onClick={handleSave}>
              Update
            </Button>
          </Grid>
        </form>
      </Box>
    </>
  )
}

export default EditImport
