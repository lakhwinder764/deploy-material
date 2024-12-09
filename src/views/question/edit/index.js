'use client'
import React, { useEffect, useState } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Select,
  Radio,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton
} from '@mui/material'
import { Controller } from 'react-hook-form'

import Reactquill from '../list/Reactquill'
import useQuestionModuleApi from '@/api/useQuestionModuleApi'
import FilterHeader from '@/Components/globals/FilterHeader'
import QuestionUpload from '@/views/test/questions/QuestionUpload'
import PaginationCard from '@/api/Pagination'
import useTestApi from '@/api/useTestApi'

import useDifficultiesApi from '@/api/useDifficultiesApi'

import useImportanceApi from '@/api/useImportanceApi'

const questionTypeMapping = {
  mcmc: 'Multiple Choice Question',
  fib: 'Fill in the Blanks',
  tf: 'True/False',
  essay: 'Essay'
}

const EditQuestion = () => {
  const { data, addDifficultyLevelToQuestion, removeDifficultyLevelToQuestion } = useDifficultiesApi()

  const {
    data: importanceData,

    addImportanceLevelToQuestion,

    removeImportanceLevelToQuestion,

    fetchImportanceData,

    fetchData
  } = useImportanceApi()

  const { data: difficultiesData, fetchData: fetchDifficultiesData } = useDifficultiesApi()
  const [diffId, setDiffId] = useState(null)

  const [impId, setImpId] = useState(null)

  const { viewQuestion, updateQuestion, fetchDataallquestion } = useQuestionModuleApi()
  const { getTestQuestion } = useTestApi()
  const searchParams = useSearchParams()
  const guid = searchParams.get('guid')
  const source = searchParams.get('source')
  const router = useRouter()

  const [questionData, setQuestionData] = useState({
    question: '',
    type: '',
    details: '',
    marksPerQuestion: '',
    negativeMarks: '',
    timeAllowed: '',
    difficulty: '',

    importance: '',
    timeUnit: 'Second',
    choices: [] // Initialize choices
  })

  useEffect(() => {
    if (guid) {
      viewQuestion(guid).then(res => {
        const payload = res?.data?.payload

        setQuestionData({
          question: payload?.question || '', // Update the question value
          type: payload?.type || '',
          details: payload?.details || '',
          marksPerQuestion: payload?.marks || '',
          negativeMarks: payload?.neg_marks || '',
          timeAllowed: payload?.time || '',
          timeUnit: 'Second',
          choices: payload?.choices || [],
          difficulty: payload?.difficulty || '',

          importance: payload?.difficulty || ''
        })
      })
    }
  }, [guid])

  //quill changes updates
  const handleQuillChange = value => {
    setQuestionData(prevState => ({
      ...prevState,
      question: value
    }))
  }

  useEffect(() => {
    fetchData()

    fetchDifficultiesData()
  }, [])

  //handle input changes for the form data
  const handleInputChange = e => {
    const { name, value } = e.target

    setQuestionData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  //handle choice change
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

  // function for removing difficulty level to question

  const removeDifficultyLevel = (guid, Id) => {
    removeDifficultyLevelToQuestion(guid, Array(Id))

    setQuestionData(prevState => ({
      ...prevState,

      difficulty: null
    }))

    setDiffId(null)
  }

  // function for removing importance level to question

  const removeImportanceLevel = (guid, Id) => {
    removeImportanceLevelToQuestion(guid, Array(Id))

    setQuestionData(prevState => ({
      ...prevState,

      importance: null
    }))

    setImpId(null)
  }

  // Handle correct answer selection
  const handleSelectCorrectAnswer = index => {
    const updatedChoices = questionData.choices.map((choice, idx) => ({
      ...choice,
      is_correct_answer: idx === index ? 1 : 0
    }))

    setQuestionData(prevState => ({
      ...prevState,
      choices: updatedChoices
    }))
  }

  const handleUpdate = async () => {
    try {
      const updatedData = { ...questionData }

      await updateQuestion(guid, updatedData)
      alert('Question updated successfully')

      if (!source) {
        router.push('/question/allquestion') // Navigate back to the list after successful update
        fetchDataallquestion()
      } else if (source) {
        router.push(`/question/list?testguid=${source}`) // Navigate back to the list after successful update
        // fetchDataallquestion()
        getTestQuestion()
      }
    } catch (error) {
      console.error('Error updating question:', error)
      alert('Failed to update the question. Please try again.')
    }
  }

  // console.log(questionData, 'questionData')
  return (
    <>
      <FilterHeader title='Edit Question' subtitle='Orders placed across your store' link='/test/list'></FilterHeader>
      <Box sx={{ padding: 4 }}>
        <form>
          {/* MUI Grid layout for better spacing */}
          <Card>
            <CardContent>
              <Grid item xs={12}>
                {/* Display Question Type (Read-only) */}
                <FormControl
                  fullWidth
                  sx={{
                    '& .MuiInputBase-root': {
                      height: '40px',
                      minHeight: 'auto'
                    },
                    '& .MuiInputLabel-root': {
                      top: '-7px'
                    }
                  }}
                >
                  <InputLabel id='question-type'>Question Type</InputLabel>
                  <Select labelId='question-type' value={questionData.type} readOnly>
                    {/* Map the type to readable text */}
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
              <Grid container spacing={3}>
                {/* Question field using ReactQuill */}
                <Grid item xs={12}>
                  {/* <Typography variant='h6'>Question:</Typography> */}
                  <Reactquill
                    value={questionData.question}
                    onChange={handleQuillChange}
                    style={{ marginBottom: '1.5rem' }}
                  />
                </Grid>
                <Grid item xs={12} py={3}>
                  <QuestionUpload />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card sx={{ mt: 2 }}>
            <CardContent>
              {/* <Box sx={{ padding: 3, backgroundColor: '#f5f5f5', borderRadius: '10px', boxShadow: 3 }}> */}
              <Grid container spacing={2} py={4} sx={{ mt: 1 }}>
                {/* Marks Per Question */}
                <Grid item xs={12} md={4}>
                  <TextField
                    label='Marks Per Question *'
                    name='marksPerQuestion'
                    value={questionData.marksPerQuestion}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>

                {/* Negative Marks */}
                <Grid item xs={12} md={4}>
                  <TextField
                    label='Negative Marks *'
                    name='negativeMarks'
                    value={questionData.negativeMarks}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>

                {/* Time Allowed */}
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
                          value={questionData.timeUnit} // Dynamic time unit
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
                <Grid item xs={12} sm={4}>
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiInputBase-root': {
                        height: '40px',
                        minHeight: 'auto'
                      },
                      '& .MuiInputLabel-root': {
                        top: '-7px'
                      }
                    }}
                  >
                    <InputLabel id='country'>Select difficulty level *</InputLabel>
                    {/* <Controller
                    name='difficulty'
                    control={'control'}
                    // control={control}
                    rules={{ required: true }}
                    render={({ field }) => ( */}
                    <Select
                      label='Select difficulty level *'
                      value={questionData.difficulty} // Dynamic time unit
                      name='difficulty'
                      onChange={handleInputChange}
                      endAdornment={
                        diffId && (
                          <InputAdornment
                            position='end'
                            sx={{
                              paddingRight: 6
                            }}
                          >
                            <IconButton
                              edge='end'
                              aria-label='clear selection'
                              name='difficulty'
                              onClick={() => diffId && removeDifficultyLevel(diffId, Array(guid))}
                            >
                              <i class='ri-close-fill'></i>
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    >
                      {difficultiesData?.map(item => (
                        <MenuItem
                          value={item?.guid}
                          key={item?.guid}
                          onClick={() =>
                            (() => {
                              addDifficultyLevelToQuestion(item?.guid, Array(guid))

                              setDiffId(item?.guid)
                            })()
                          }
                        >
                          {item?.title}
                        </MenuItem>
                      ))}
                    </Select>
                    {/* // )} */}
                    {/* /> */}
                    {/* {errors.difficulty && <FormHelperText error>This field is required.</FormHelperText>} */}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiInputBase-root': {
                        height: '40px',
                        minHeight: 'auto'
                      },
                      '& .MuiInputLabel-root': {
                        top: '-7px'
                      }
                    }}
                  >
                    <InputLabel id='country'>Select importance *</InputLabel>
                    {/* <Controller
                name='importance'
                control={control}
                rules={{ required: true }}
                render={({ field }) => ( */}
                    <Select
                      label='Select importance *'
                      value={questionData.importance} // Dynamic time unit
                      name='importance'
                      onChange={handleInputChange}
                      endAdornment={
                        impId && (
                          <InputAdornment
                            position='end'
                            sx={{
                              paddingRight: 6
                            }}
                          >
                            <IconButton
                              edge='end'
                              aria-label='clear selection'
                              name='importance'
                              onClick={() => impId && removeImportanceLevel(impId, Array(guid))}
                            >
                              <i class='ri-close-fill'></i>
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    >
                      {importanceData?.map(item => (
                        <MenuItem
                          value={item?.guid}
                          key={item?.guid}
                          onClick={() =>
                            (() => {
                              addImportanceLevelToQuestion(item?.guid, Array(guid))

                              setImpId(item?.guid)
                            })()
                          }
                        >
                          {item?.title}
                        </MenuItem>
                      ))}
                    </Select>
                    {/* )}
              /> */}
                    {/* {errors.importance && <FormHelperText error>This field is required.</FormHelperText>} */}
                  </FormControl>
                </Grid>
              </Grid>
              {/* </Box> */}
            </CardContent>
          </Card>
          <Card sx={{ mt: 2 }}>
            <CardHeader title='Answer Choices:' />
            <CardContent>
              <Grid item xs={12}>
                {/* <Typography variant='h6'>Answer Choices:</Typography> */}
                {questionData.choices.map((choice, index) => (
                  <Grid container alignItems='center' spacing={2} key={index}>
                    <Grid item xs={1}>
                      {/* Radio button for selecting correct answer */}
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={choice.is_correct_answer === 1}
                            onChange={() => handleSelectCorrectAnswer(index)}
                          />
                        }
                      />
                    </Grid>
                    <Grid item xs={11} sx={{ mb: 2 }}>
                      {/* ReactQuill for editing the choice */}
                      <Reactquill value={choice.choice} onChange={value => handleChoiceChange(value, index)} />
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
          <Grid item xs={12} py={4}>
            <Card>
              <CardContent>
                <Grid container item xs={12}>
                  <Grid item xs={12}>
                    <Typography fontWeight='bold' pb={3}>
                      Feedback For Student
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Reactquill

                    // setTextValue={setFeedback}
                    />
                  </Grid>
                </Grid>
                <Grid container item xs={12} pt={6}>
                  <Grid item xs={12}>
                    <Typography fontWeight='bold' pb={3}>
                      Answer Feedback (For Instructor Only)
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Reactquill

                    // setTextValue={setAnswerFeedback}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button variant='contained' color='primary' onClick={handleUpdate}>
              Update
            </Button>
          </Grid>
        </form>
      </Box>
    </>
  )
}

export default EditQuestion
