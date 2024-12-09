import React, { useState, useEffect, useRef } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Menu
} from '@mui/material'
import { styled } from '@mui/material/styles'

import axios from 'axios'

import { toast } from 'react-toastify'

import useDraggableList from './useDraggableList' // Import the custom hook
import Reactquill from './Reactquill'

import Tablefor from '../import/view/Tablefor'
import AddUserDrawer from './AddUserDrawer'

const QuestionCard = ({
  handleSelectAllClick,
  selectAll,
  marginLeft,
  width,
  expandedPanels,
  setExpandedPanels,
  isVisible,
  setIsVisible,
  showAnswers,
  setShowAnswers,
  handleCollapseAll,
  handleExpandAllButton,
  manageCheckboxState,
  handleEdit,
  formattedQuestions,

  // toggleAnswer,
  questions,
  selectedQuestions,
  setSelectedQuestions,
  check,
  setEdit,
  edit,
  onEditClick
}) => {
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [editingQuestionId, setEditingQuestionId] = useState(null) // To track which question is being edited
  const [editedText, setEditedText] = useState('') // To store the edited text for a question
  const [editingAnswerId, setEditingAnswerId] = useState(null) // To track which answer is being edited
  const [editedAnswer, setEditedAnswer] = useState('') // To store the edited text for
  // Using a custom hook for drag-and-drop
  const { items: questionList, handleDragStart, handleDragOver, handleDrop } = useDraggableList(questions)
  const [questionData, setQuestionData] = useState(questions)

  const [anchorEl, setAnchorEl] = useState(null)
  const search = useSearchParams()

  const guid = search.get('guid')
  const testGuid = search.get('testguid')
  const sectionGuid = search.get('sectionguid')
  const open = Boolean(anchorEl)
  const isInitialRender = useRef(true) //

  console.log(showAnswers, 'showanswer123')

  const [settings, setSettings] = useState({
    questionType: 'mcmc',
    marksPerQuestion: 2,
    negativeMarks: 2,
    timeAllowed: 0,
    timeUnit: 'Second',
    difficultyLevel: 'Low',
    importance: 'Low'
  })

  const handleSettingsChange = newSettings => {
    setSettings(newSettings)
  }

  // Use useEffect to update questionData whenever questions prop changes
  useEffect(() => {
    setQuestionData(questions) // Sync the questions prop with questionData state
  }, [questions])
  console.log

  // Function to handle checkbox change
  const handleCheckboxChange = (questionId, isChecked) => {
    if (isChecked) {
      setSelectedQuestions([...selectedQuestions, questionId]) // Add question to selected list
    } else {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId)) // Remove from list
    }
  }

  console.log(selectedQuestions, 'questionsselected')

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded)
  }

  // Handle when the user clicks on a question to edit
  const handleEditClick = (questionId, currentText) => {
    setEditingQuestionId(questionId) // Set the question ID being edited
    setEditedText(currentText) // Set the current text in the input field
    setEditingAnswerId(null)
  }

  useEffect(() => {
    if (isInitialRender.current && questionData.length > 0) {
      const allQuestionIds = questionData.map(question => question.id)

      setShowAnswers(allQuestionIds)
      isInitialRender.current = false // Set flag to false
    }
  }, [questionData])

  console.log(showAnswers, 'show')

  // Handle when the user types in the input field

  // Handle when the user presses Enter or blurs out of the input
  // Handle when the user clicks on an answer to edit
  const handleEditAnswerClick = (questionId, answerIndex, currentAnswer) => {
    setEditingAnswerId(`${questionId}-${answerIndex}`) // Set the answer ID being edited
    setEditedAnswer(currentAnswer) // Set the current answer in the input field
    setEditingQuestionId(null)
  }

  const toggleAnswer = questionId => {
    setShowAnswers(prevAnswers =>
      prevAnswers.includes(questionId) ? prevAnswers.filter(id => id !== questionId) : [...prevAnswers, questionId]
    )
  }

  // Handle answer edit change
  const handleEditAnswerChange = e => {
    setEditedAnswer(e.target.value)
  }

  console.log(selectAll, 'selectAll')

  // Handle saving the edited answer
  const handleEditAnswerSave = (questionId, answerIndex) => {
    const updatedQuestions = questionList.map(question => {
      if (question.id === questionId) {
        const updatedOptions = question.options.map((option, index) => (index === answerIndex ? editedAnswer : option))

        return { ...question, options: updatedOptions }
      }

      return question
    })

    setEditingAnswerId(null) // Stop editing mode for answer
    // You would ideally call a function here to save the changes to the server or state
    console.log('Updated questions with edited answer:', updatedQuestions)
  }

  useEffect(() => {}, [questions, isVisible, expandedPanels, questions])
  console.log(selectedQuestions, 'gg')

  const MAX_QUESTIONS_PER_BATCH = 40

  const handleImportSelected = async () => {
    if (selectedQuestions.length === 0) {
      toast.error('Please select at least one question.')

      return
    }

    const selectedQuestionData = formattedQuestions.filter(q => selectedQuestions.includes(q.id))
    const batches = []

    for (let i = 0; i < selectedQuestionData.length; i += MAX_QUESTIONS_PER_BATCH) {
      batches.push(selectedQuestionData.slice(i, i + MAX_QUESTIONS_PER_BATCH))
    }

    console.log(batches, 'batchess')

    try {
      for (const batch of batches) {
        const formData = new FormData()

        if (guid) {
          formData.append('category', guid)
        }

        if (testGuid) {
          formData.append('test_guid', testGuid)
        }

        if (sectionGuid) {
          formData.append('section_guid', sectionGuid)
        }

        batch.forEach((question, index) => {
          formData.append(`questions[${index}][question]`, question.text)

          // formData.append(`questions[${index}][difficulty]`, settings.difficultyLevel)
          // formData.append(`questions[${index}][test_name]`, settings.testName)
          formData.append(`questions[${index}][type]`, question.type)
          formData.append(`questions[${index}][importance]`, settings.importance)
          formData.append(`questions[${index}][marks]`, settings.marksPerQuestion)
          formData.append(`questions[${index}][category]`, guid)
          formData.append(`questions[${index}][neg_marks]`, settings.negativeMarks)
          formData.append(`questions[${index}][time]`, settings.timeAllowed)

          if (question?.options?.length > 0) {
            question.options.forEach((choice, choiceIndex) => {
              formData.append(`questions[${index}][choice][${choiceIndex}]`, choice)
            })
          } else {
            formData.append(`questions[${index}][choice]`, '0')
          }

          if (question.correctanswer && question.correctanswer.length > 0) {
            question.correctanswer.forEach((correctAnswer, correctAnswerIndex) => {
              formData.append(`questions[${index}][correct_answer][${correctAnswerIndex}]`, correctAnswer)
            })
          }
        })

        const endpoint = `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/questions/save_import`

        await axios.post(endpoint, formData, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`,
            Network: process.env.NEXT_PUBLIC_LMS_TOKEN,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        })
      }

      toast.success('Selected questions imported successfully!')
    } catch (error) {
      toast.error('Failed to import selected questions.')
    }
  }

  const handleImportAll = async () => {
    console.log('hyeeeee')

    if (!questionData || questionData.length === 0) {
      toast.error('No questions available to import.')

      return
    }

    // Create a new FormData object
    const formData = new FormData()

    if (guid) {
      formData.append('category', guid)
    }

    if (testGuid) {
      formData.append('test_guid', testGuid)
    }

    // Loop through all questions and append to formData
    questionData.forEach((question, index) => {
      // Append question fields in the required form-data format
      formData.append(`questions[${index}][question]`, question.text) // Question text
      formData.append(`questions[${index}][difficulty]`, settings.difficultyLevel)
      formData.append(`questions[${index}][test_name]`, settings.testName || 'Default Test Name')
      formData.append(`questions[${index}][type]`, settings.questionType)
      formData.append(`questions[${index}][importance]`, settings.importance)
      formData.append(`questions[${index}][marks]`, settings.marksPerQuestion)
      formData.append(`questions[${index}][category]`, guid)
      formData.append(`questions[${index}][neg_marks]`, settings.negativeMarks)
      formData.append(`questions[${index}][time]`, settings.timeAllowed)

      // Append choices for the question
      question.options.forEach((choice, choiceIndex) => {
        formData.append(`questions[${index}][choice][${choiceIndex}]`, choice)
      })

      // Append correct answers for the question

      if (question.correctanswer && question.correctanswer.length > 0) {
        question.correctanswer.forEach((correctAnswer, correctAnswerIndex) => {
          formData.append(`questions[${index}][correct_answer][${correctAnswerIndex}]`, correctAnswer)
        })
      }
    })

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/questions/save_import`

      // Make the API call
      const response = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`,
          Network: process.env.NEXT_PUBLIC_LMS_TOKEN,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data'
        }
      })

      // Handle success response
      toast.success('All questions imported successfully!')
    } catch (error) {
      toast.error('Failed to import questions.')
    }
  }

  // const handleExpandAllButton = () => {
  //   setIsVisible(true) // Show the questions
  //   setExpandedPanels(questionData.map(q => q.id)) // Expand all panels
  //   setShowAnswers(questionData.map(q => q.id)) // Reset showing answers (no answers shown)
  //   // setIsExpandedAll(true) // Set the expanded state
  // }

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDeleteClick = async () => {
    if (selectedQuestions.length === 0) {
      toast.error('Please select at least one question to delete.')

      return
    }

    console.log(isVisible, 'jjjjj')

    // Get selected questions' GUIDs
    const selectedQuestionGuids = questionData
      .filter(question => {
        console.log(question, 'uuuuuu') // Log each question object

        return selectedQuestions.includes(question.id) // Filter selected questions by their id
      })
      .map(question => question.guid) // Map to GUID

    try {
      // Send the selected question GUIDs to the API for deletion
      const endpoint = `${process.env.NEXT_PUBLIC_LMS_API_URL}qb/questions/${selectedQuestionGuids}/delete`

      await axios.delete(
        endpoint,
        {},

        // Send the GUIDs in the request body
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`,
            Network: process.env.NEXT_PUBLIC_LMS_TOKEN,
            Accept: 'application/json'
          }
        }
      )

      // Filter out deleted questions from local state
      const updatedQuestionData = questionData.filter(question => !selectedQuestionGuids.includes(question.guid))

      setQuestionData(updatedQuestionData) // Update state with remaining questions
      setSelectedQuestions([]) // Clear selected questions
      toast.success('Selected questions deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete selected questions.')
    }
  }

  console.log(questions, 'showanswert')

  const decodeHtmlEntities = html => {
    const txt = document.createElement('textarea')

    txt.innerHTML = html

    return txt.value // Return the decoded string
  }

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleOpenSettings = () => {
    setIsSettingsOpen(true)
  }

  const handleCloseSettings = () => {
    setIsSettingsOpen(false)
  }

  const handleSaveSettings = settings => {
    setIsSettingsOpen(false)

    // Apply the settings globally or pass them to the relevant component
  }

  const setDifficulty = value => setSettings(prev => ({ ...prev, difficultyLevel: value }))
  const setTestName = value => setSettings(prev => ({ ...prev, testName: value }))
  const setCategory = value => setSettings(prev => ({ ...prev, questionType: value }))
  const setImportance = value => setSettings(prev => ({ ...prev, importance: value }))
  const setMarks = value => setSettings(prev => ({ ...prev, marksPerQuestion: value }))
  const setNegativeMarks = value => setSettings(prev => ({ ...prev, negativeMarks: value }))
  const setTime = value => setSettings(prev => ({ ...prev, timeAllowed: value }))
  const setTimeUnit = value => setSettings(prev => ({ ...prev, timeUnit: value }))

  console.log(questions.length, 'questiontype')

  return (
    <>
      {check && (
        <>
          <Tablefor
            handleExpandAll={handleExpandAllButton}
            handleCollapseAll={handleCollapseAll}
            handleImportSelected={handleImportSelected}
            open={isSettingsOpen}
            handleClose={handleCloseSettings}
            handleSave={handleSaveSettings}
            addUserOpen={addUserOpen}
            setAddUserOpen={setAddUserOpen}
          />
        </>
      )}
      <AddUserDrawer
        open={addUserOpen}
        handleClose={() => setAddUserOpen(!addUserOpen)}
        settings={settings}
        onSaveSettings={handleSettingsChange}
      />
      <Card style={{ marginTop: '50px', marginLeft: marginLeft, padding: '20px', width: width }}>
        <CardHeader
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAllClick}
                    // checkedIcon={selectedQuestions.length !== questions.length ? <i class='ri-checkbox-fill'></i> : ''}
                    label='Select All'
                  />
                }
                style={{ marginRight: '10px' }}
              />
              Select All
            </div>
          }
          // subheaderTypographyProps={{ style: { color: '#262B43E5', fontSize: '13px' } }}
          action={
            <>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                  variant='contained'
                  startIcon={<i className='ri-download-2-line' style={{ color: 'white' }} />}
                  onClick={handleImportSelected}
                  disabled={selectedQuestions.length === 0} // Disable if no questions selected
                >
                  Import Selected
                </Button>
                <Button
                  variant='contained'
                  startIcon={<i className='ri-download-2-line' style={{ color: 'white' }} />}
                  onClick={handleImportAll}

                  // disabled={selectedQuestions.length !== questions.length} // Disable if not all questions are selected
                >
                  Import All
                </Button>
              </div>
            </>
          }
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}></div>

        {isVisible && (
          <CardContent>
            {questionData.length > 0 &&
              questionData.map((section, sectionIndex) => {
                if (section.type === 'section') {
                  console.log('Section:', section) // Log the section object

                  return (
                    <div
                      key={section.sectionId}
                      draggable
                      onDragStart={() => handleDragStart(sectionIndex)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(sectionIndex)}

                      // style={{ padding: '10px 0', border: '1px solid #ddd', marginBottom: '20px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <FormControlLabel
                          aria-label='Select'
                          control={
                            <Checkbox
                              checked={selectedQuestions && selectedQuestions.includes(section.id)}
                              onChange={e => manageCheckboxState(section.id, null, e.target.checked, true)}
                            />
                          }
                          label=''
                          style={{ marginRight: '10px' }}
                        />
                        {/* Section Title */}
                        <Typography
                          variant='h6'
                          style={{
                            flexGrow: 1,
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            color: 'black'
                          }}
                          dangerouslySetInnerHTML={{
                            __html: decodeHtmlEntities(`${section?.id}.${section.text}`)
                          }}
                        />
                        {/* Toggle Section Button */}
                        {section?.questions.length > 0 && (
                          <Button
                            style={{ marginLeft: '20px' }}
                            onClick={e => {
                              e.stopPropagation()
                              toggleAnswer(section.id)
                            }}
                          >
                            {showAnswers.includes(section.id) ? (
                              <i className='ri-arrow-up-s-line' style={{ color: '#262B43E5' }} />
                            ) : (
                              <i className='ri-arrow-down-s-line' style={{ color: '#262B43E5' }} />
                            )}
                          </Button>
                        )}
                        {/* <Button
                      style={{ color: 'rgba(38, 43, 67, 0.898)', marginTop: '10px' }}
                      onClick={() => handleAccordionClick(question?.guid)}
                    >
                      <i className='ri-edit-box-line' style={{ color: 'rgba(38, 43, 67, 0.898)' }}></i>
                    </Button> */}
                      </div>
                      <Box
                        display='flex'
                        alignItems='center'
                        justifyContent='space-between'
                        style={{ width: '100%', marginRight: '16px' }}
                      >
                        {/* Edit button on the left */}
                        <Box
                          display='flex'
                          alignItems='center'
                          justifyContent='flex-end'
                          className='hover-container'
                          style={{ position: 'relative', width: '40px', height: '40px' }}
                          onClick={() => handleEdit(section.text, section.id)}
                        >
                          <i className='ri-edit-box-line' style={{ color: 'rgba(38, 43, 67, 0.898)' }}></i>
                          <span className='hover-text'>Edit Section</span>
                        </Box>

                        {/* Add and Import icons on the right */}
                      </Box>
                      {/* <hr
                    style={{
                      width: '100%',
                      border: '0.5px solid #ddd',
                      margin: '10px 0'
                    }}
                  /> */}
                      {/* Show Questions in Section */}
                      {showAnswers.includes(section.id) &&
                        section.questions.map((question, questionIndex) => {
                          console.log('Question:', question) // Log the question object

                          const processedText = question?.text?.startsWith('#')
                            ? question?.text?.slice(1).trim()
                            : question?.text

                          return (
                            <>
                              <div
                                key={question.id}
                                draggable
                                onDragStart={() => handleDragStart(questionIndex)}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(questionIndex)}
                                style={{ padding: '10px 0' }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                  {/* Checkbox */}
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={selectedQuestions?.includes(question.id)}
                                        onChange={e => manageCheckboxState(null, question.id, e.target.checked, false)}
                                      />
                                    }
                                    label=''
                                    style={{ marginRight: '10px' }}
                                  />

                                  {/* Question Text */}
                                  <Typography
                                    variant='body1'
                                    style={{
                                      flexGrow: 1,
                                      cursor: 'pointer',
                                      textTransform: 'capitalize',
                                      color: 'black'
                                    }}
                                    onClick={() => handleViewPage(question?.guid)}
                                    dangerouslySetInnerHTML={{
                                      __html: decodeHtmlEntities(`${questionIndex + 1}. ${processedText}`)
                                    }}
                                  />

                                  {/* Toggle Answer Button */}
                                  <Button
                                    style={{ marginLeft: '20px' }}
                                    onClick={e => {
                                      e.stopPropagation()
                                      toggleAnswer(question.id)
                                    }}
                                  >
                                    {showAnswers.includes(question.id) ? (
                                      <i className='ri-arrow-up-s-line' style={{ color: '#262B43E5' }} />
                                    ) : (
                                      <i className='ri-arrow-down-s-line' style={{ color: '#262B43E5' }} />
                                    )}
                                  </Button>
                                </div>

                                {/* Show Answer Section */}
                                {showAnswers.includes(question.id) && (
                                  <div style={{ marginLeft: '40px' }}>
                                    {question.options && (
                                      <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                                        {question.options.map((option, idx) => {
                                          const label = `${String.fromCharCode(97 + idx)}. ${decodeHtmlEntities(option)}`

                                          const isCorrect = question.correctanswer[idx] === 1

                                          return (
                                            <li
                                              key={idx}
                                              style={{
                                                display: 'flex',
                                                alignItems: 'center'
                                              }}
                                            >
                                              <Typography
                                                style={{
                                                  // color: showCorrectAnswer && isCorrect ? '#34C759' : 'black',
                                                  cursor: 'pointer'
                                                }}
                                                onClick={() => handleEditAnswerClick(question.id, idx, option)}
                                                dangerouslySetInnerHTML={{
                                                  __html: label
                                                }}
                                              />
                                            </li>
                                          )
                                        })}
                                      </ul>
                                    )}

                                    {/* Additional Info */}
                                  </div>
                                )}
                                <Button
                                  style={{ color: 'rgba(38, 43, 67, 0.898)', marginTop: '10px' }}
                                  onClick={() => handleAccordionClick(question?.guid)}
                                >
                                  <i className='ri-edit-box-line' style={{ color: 'rgba(38, 43, 67, 0.898)' }}></i>
                                </Button>
                              </div>
                              <div expanded={isExpanded} onChange={handleExpandClick} style={{ border: 'none ' }}>
                                <div></div>
                                <div>
                                  <Grid container spacing={2}>
                                    {/* Difficulty */}
                                    <Grid item xs={3}>
                                      <FormControl fullWidth size='small'>
                                        <InputLabel>Difficulty</InputLabel>
                                        <Select
                                          value={settings.difficultyLevel}
                                          onChange={e => setDifficulty(e.target.value)}
                                        >
                                          <MenuItem value='Low'>Low</MenuItem>
                                          <MenuItem value='Medium'>Medium</MenuItem>
                                          <MenuItem value='High'>High</MenuItem>
                                        </Select>
                                      </FormControl>
                                    </Grid>
                                    {/* Test Name */}
                                    <Grid item xs={3}>
                                      <FormControl size='small' fullWidth>
                                        <InputLabel>Test Name</InputLabel>
                                        <Select value={settings.testName} onChange={e => setTestName(e.target.value)}>
                                          <MenuItem value='Math Test'>Maths Test</MenuItem>
                                          <MenuItem value='Exam'>English Test</MenuItem>
                                        </Select>
                                      </FormControl>
                                    </Grid>
                                    {/* Category */}
                                    <Grid item xs={3}>
                                      <FormControl size='small' fullWidth>
                                        <InputLabel>Category</InputLabel>
                                        <Select
                                          value={settings.questionType}
                                          onChange={e => setCategory(e.target.value)}
                                        >
                                          <MenuItem value='mcmc'>MCQ</MenuItem>
                                          <MenuItem value='True/False'>True/False</MenuItem>
                                        </Select>
                                      </FormControl>
                                    </Grid>
                                    {/* Importance */}
                                    <Grid item xs={3}>
                                      <FormControl fullWidth size='small'>
                                        <InputLabel>Importance</InputLabel>
                                        <Select
                                          value={settings.importance}
                                          onChange={e => setImportance(e.target.value)}
                                        >
                                          <MenuItem value='Low'>Low</MenuItem>
                                          <MenuItem value='Medium'>Medium</MenuItem>
                                          <MenuItem value='High'>High</MenuItem>
                                        </Select>
                                      </FormControl>
                                    </Grid>

                                    {/* Marks */}
                                    <Grid item xs={4}>
                                      <TextField
                                        fullWidth
                                        size='small'
                                        label='Marks'
                                        type='number'
                                        value={settings.marksPerQuestion}
                                        onChange={e => setMarks(e.target.value)}
                                      />
                                    </Grid>
                                    {/* Negative Marks */}
                                    <Grid item xs={4}>
                                      <TextField
                                        fullWidth
                                        size='small'
                                        label='Negative Marks'
                                        type='number'
                                        value={settings.negativeMarks}
                                        onChange={e => setNegativeMarks(e.target.value)}
                                      />
                                    </Grid>
                                    {/* Time */}
                                    <Grid item xs={4} sm={4}>
                                      <FormControl fullWidth size='small'>
                                        <Box display='flex' alignItems='center'>
                                          <TextField
                                            label='Time Allowed'
                                            name='timeAllowed'
                                            type='number'
                                            value={settings.timeAllowed}
                                            onChange={e => setTime(e.target.value)}
                                            style={{ flex: 2, marginRight: '10px' }} // Adjusts input width
                                            size='small'
                                          />
                                          <Select
                                            name='timeUnit'
                                            value={settings.timeUnit}
                                            onChange={e => setTimeUnit(e.target.value)}
                                            style={{ flex: 1 }} // Dropdown size
                                          >
                                            <MenuItem value='Second'>Second</MenuItem>
                                            <MenuItem value='Minute'>Minute</MenuItem>
                                          </Select>
                                        </Box>
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                </div>
                              </div>
                            </>
                          )
                        })}

                      <hr
                        style={{
                          width: '100%',
                          border: '0.5px solid #ddd',
                          margin: '10px 0'
                        }}
                      />
                    </div>
                  )
                } else {
                  const processedText =
                    section?.text !== null && section?.text?.startsWith('#')
                      ? section?.text?.slice(1).trim()
                      : section?.text

                  console.log(
                    section && section.correctanswer && section.correctanswer[sectionIndex] === 1,
                    'questiondemo'
                  )

                  return (
                    <>
                      <div
                        key={section.id}
                        expanded={showAnswers.includes(section.id)} // Check if this question is in the expandedPanels array
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                        draggable
                        style={{
                          borderRadius: 'none',
                          borderTop: 'none',
                          border: 'none'

                          // boxShadow: 'none',
                          // border: 'none'
                        }}
                        sx={{ '& .MuiAccordionSummary-expandIconWrapper': { display: 'none' } }} // Th
                      >
                        <div aria-controls={`panel${section.id}-content`} id={`panel${section.id}-header`}>
                          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            {/* Checkbox for selecting questions */}
                            <FormControlLabel
                              aria-label='Select'
                              control={
                                <Checkbox
                                  checked={selectedQuestions && selectedQuestions.includes(section.id)} // Check if this question is selected
                                  onChange={e => handleCheckboxChange(section.id, e.target.checked)} // Handle checkbox change
                                />
                              }
                              label=''
                              style={{ marginRight: '10px' }}
                            />
                            {/* Editable question text */}
                            <Typography
                              // variant='body2'
                              style={{
                                flexGrow: 1,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                color: 'black'
                              }}
                              onClick={() => handleEditClick(section.id, processedText)} // Switch to editing mode on click
                              dangerouslySetInnerHTML={{
                                __html: decodeHtmlEntities(`${sectionIndex + 1}. ${section.text}`)
                              }}
                            >
                              {/* {index + 1}. {processedText} */}
                            </Typography>
                            <Divider />
                            <Button
                              // style={{ marginLeft: '20px' }}
                              variant='text'
                              onClick={e => {
                                e.stopPropagation() // Prevent accordion toggle
                                toggleAnswer(section.id)
                              }}
                            >
                              {showAnswers.includes(section.id) ? (
                                <i className='ri-arrow-up-s-line' style={{ color: '#262B43E5' }} />
                              ) : (
                                <i className='ri-arrow-down-s-line' style={{ color: '#262B43E5' }} />
                              )}
                            </Button>
                          </div>
                        </div>
                        {showAnswers.includes(section.id) && (
                          <div

                          //  style={{
                          //   marginLeft: '40px' }}
                          >
                            {section.options ? (
                              <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                                {section.options.map((option, index) => (
                                  <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Checkbox
                                      checked={section && section.correctanswer && section.correctanswer[index] === 1} // Check if the option is the correct one
                                      disabled // Disable checkbox to prevent user interaction
                                      sx={{
                                        '&.Mui-checked': {
                                          color: '#34C759' // Green color for the correct answer
                                        }
                                      }}
                                    />
                                    {editingAnswerId === `${section.id}-${index}` ? (
                                      <Reactquill
                                        value={editedAnswer}
                                        onChange={setEditedAnswer}
                                        style={{ backgroundColor: 'white', flexGrow: 1 }} // Use flexGrow to take remaining space
                                        onBlur={() => handleEditAnswerSave(section.id, index)} // Save on blur
                                        onKeyPress={e => {
                                          if (e.key === 'Enter') handleEditAnswerSave(section.id, index) // Save on pressing Enter
                                        }}
                                        autoFocus
                                        fullWidth
                                      />
                                    ) : (
                                      <Typography
                                        style={{
                                          color: section?.correctanswer?.[sectionIndex] === '1' ? '#34C759' : 'black',
                                          flexGrow: 1, // Use flexGrow to take remaining space
                                          cursor: 'pointer'
                                        }}
                                        onClick={() => handleEditAnswerClick(section.id, index, option)} // Switch to editing mode on click
                                        dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(option) }}
                                      >
                                        {/* {option} */}
                                      </Typography>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <Typography variant='body2' style={{ whiteSpace: 'pre-line' }}>
                                {section.sampleAnswer}
                              </Typography>
                            )}

                            <div expanded={isExpanded} onChange={handleExpandClick} style={{ border: 'none ' }}>
                              <div></div>
                              <div>
                                <Grid container spacing={2}>
                                  {/* Difficulty */}
                                  <Grid item xs={3}>
                                    <FormControl fullWidth size='small'>
                                      <InputLabel>Difficulty</InputLabel>
                                      <Select
                                        value={settings.difficultyLevel}
                                        onChange={e => setDifficulty(e.target.value)}
                                      >
                                        <MenuItem value='Low'>Low</MenuItem>
                                        <MenuItem value='Medium'>Medium</MenuItem>
                                        <MenuItem value='High'>High</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  {/* Test Name */}
                                  <Grid item xs={3}>
                                    <FormControl size='small' fullWidth>
                                      <InputLabel>Test Name</InputLabel>
                                      <Select value={settings.testName} onChange={e => setTestName(e.target.value)}>
                                        <MenuItem value='Math Test'>Maths Test</MenuItem>
                                        <MenuItem value='Exam'>English Test</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  {/* Category */}
                                  <Grid item xs={3}>
                                    <FormControl size='small' fullWidth>
                                      <InputLabel>Category</InputLabel>
                                      <Select value={settings.questionType} onChange={e => setCategory(e.target.value)}>
                                        <MenuItem value='mcmc'>MCQ</MenuItem>
                                        <MenuItem value='True/False'>True/False</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  {/* Importance */}
                                  <Grid item xs={3}>
                                    <FormControl fullWidth size='small'>
                                      <InputLabel>Importance</InputLabel>
                                      <Select value={settings.importance} onChange={e => setImportance(e.target.value)}>
                                        <MenuItem value='Low'>Low</MenuItem>
                                        <MenuItem value='Medium'>Medium</MenuItem>
                                        <MenuItem value='High'>High</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>

                                  {/* Marks */}
                                  <Grid item xs={4}>
                                    <TextField
                                      fullWidth
                                      size='small'
                                      label='Marks'
                                      type='number'
                                      value={settings.marksPerQuestion}
                                      onChange={e => setMarks(e.target.value)}
                                    />
                                  </Grid>
                                  {/* Negative Marks */}
                                  <Grid item xs={4}>
                                    <TextField
                                      fullWidth
                                      size='small'
                                      label='Negative Marks'
                                      type='number'
                                      value={settings.negativeMarks}
                                      onChange={e => setNegativeMarks(e.target.value)}
                                    />
                                  </Grid>
                                  {/* Time */}
                                  <Grid item xs={4} sm={4}>
                                    <FormControl fullWidth size='small'>
                                      <Box display='flex' alignItems='center'>
                                        <TextField
                                          label='Time Allowed'
                                          name='timeAllowed'
                                          type='number'
                                          value={settings.timeAllowed}
                                          onChange={e => setTime(e.target.value)}
                                          style={{ flex: 2, marginRight: '10px' }} // Adjusts input width
                                          size='small'
                                        />
                                        <Select
                                          name='timeUnit'
                                          value={settings.timeUnit}
                                          onChange={e => setTimeUnit(e.target.value)}
                                          style={{ flex: 1 }} // Dropdown size
                                        >
                                          <MenuItem value='Second'>Second</MenuItem>
                                          <MenuItem value='Minute'>Minute</MenuItem>
                                        </Select>
                                      </Box>
                                    </FormControl>
                                  </Grid>
                                </Grid>
                              </div>
                            </div>
                          </div>
                        )}

                        <Button
                          style={{ color: 'rgba(38, 43, 67, 0.898)', marginTop: '10px' }}
                          onClick={() => onEditClick(section)}
                        >
                          <i className='ri-edit-box-line' style={{ color: 'rgba(38, 43, 67, 0.898)' }}></i>
                        </Button>
                        <hr style={{ width: '100%', border: '0.5px solid #ddd', margin: '10px 0' }} />
                      </div>
                    </>
                  )
                }
              })}
          </CardContent>
        )}
      </Card>
    </>
  )
}

export default QuestionCard

//}tests/save_uploaded_questions/SAM8 api save
