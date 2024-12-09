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
  Menu,
  IconButton
} from '@mui/material'
import { styled } from '@mui/material/styles'

import axios from 'axios'

import { toast } from 'react-toastify'

import useDraggableList from './useDraggableList' // Import the custom hook
import Reactquill from './Reactquill'

import Tablefor from '../import/view/Tablefor'
import AddUserDrawer from './AddUserDrawer'

// import { useRouter } from 'next/navigation'
const debounce = (func, delay) => {
  let timeoutId

  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(null, args)
    }, delay)
  }
}

const QuestionCardTest = ({
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
  toggleAnswer,
  questions,
  selectedQuestions,
  setSelectedQuestions,
  check,
  setEdit,
  edit,
  onEditClick,
  addQuestion,
  manageCheckboxState,
  handleEdit
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
  const open = Boolean(anchorEl)

  const [settings, setSettings] = useState({
    questionType: 'mcmc',
    marksPerQuestion: 2,
    negativeMarks: 2,
    timeAllowed: 0,
    timeUnit: 'Second',
    difficultyLevel: 'Low',
    importance: 'Low'
  })

  const isInitialRender = useRef(true)

  const handleSettingsChange = newSettings => {
    setSettings(newSettings)
  }

  const router = useRouter()

  // Use useEffect to update questionData whenever questions prop changes
  useEffect(() => {
    setQuestionData(questions) // Sync the questions prop with questionData state
  }, [questions, toggleAnswer])
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

  // useEffect(() => {
  //   if (questionData.length > 0) {
  //     const allQuestionIds = questionData.map(question => question.id)

  //     // Check if the state is already the same before setting it
  //     if (JSON.stringify(allQuestionIds) !== JSON.stringify(showAnswers)) {
  //       setShowAnswers(allQuestionIds)
  //     }
  //   }
  // }, [questionData, showAnswers])

  // Handle when the user types in the input field

  // Handle when the user presses Enter or blurs out of the input
  // Handle when the user clicks on an answer to edit
  const handleEditAnswerClick = (questionId, answerIndex, currentAnswer) => {
    setEditingAnswerId(`${questionId}-${answerIndex}`) // Set the answer ID being edited
    setEditedAnswer(currentAnswer) // Set the current answer in the input field
    setEditingQuestionId(null)
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
  console.log(editedAnswer, 'gg')
  useEffect(() => {
    if (isInitialRender.current && questionData.length > 0) {
      const allQuestionIds = questionData.map(question => question.id)

      setShowAnswers(allQuestionIds)
      isInitialRender.current = false // Set flag to false
    }
  }, [questionData])

  const handleToggleAnswer = questionId => {
    setShowAnswers(prevAnswers =>
      prevAnswers.includes(questionId) ? prevAnswers.filter(id => id !== questionId) : [...prevAnswers, questionId]
    )
  }

  const MAX_QUESTIONS_PER_BATCH = 40

  const handleImportSelected = async () => {
    if (selectedQuestions.length === 0) {
      toast.error('Please select at least one question.')

      return
    }

    const selectedQuestionData = questionData.filter(q => selectedQuestions.includes(q.id))
    const batches = []

    for (let i = 0; i < selectedQuestionData.length; i += MAX_QUESTIONS_PER_BATCH) {
      batches.push(selectedQuestionData.slice(i, i + MAX_QUESTIONS_PER_BATCH))
    }

    try {
      for (const batch of batches) {
        const formData = new FormData()

        if (guid) {
          formData.append('category', guid)
        }

        if (testGuid) {
          formData.append('test_guid', testGuid)
        }

        batch.forEach((question, index) => {
          formData.append(`questions[${index}][question]`, question.text)
          formData.append(`questions[${index}][difficulty]`, settings.difficultyLevel)
          formData.append(`questions[${index}][test_name]`, settings.testName)
          formData.append(`questions[${index}][type]`, settings.questionType)
          formData.append(`questions[${index}][importance]`, settings.importance)
          formData.append(`questions[${index}][marks]`, settings.marksPerQuestion)
          formData.append(`questions[${index}][category]`, guid)
          formData.append(`questions[${index}][neg_marks]`, settings.negativeMarks)
          formData.append(`questions[${index}][time]`, settings.timeAllowed)

          question.options.forEach((choice, choiceIndex) => {
            formData.append(`questions[${index}][choice][${choiceIndex}]`, choice)
          })

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

  const handleExpandAllButton = () => {
    setIsVisible(true) // Show the questions
    setExpandedPanels(questionData.map(q => q.id)) // Expand all panels
    setShowAnswers(questionData.map(q => q.id)) // Reset showing answers (no answers shown)
    // setIsExpandedAll(true) // Set the expanded state
  }

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

  const handleSearch = debounce(event => {
    setSearchKeyword(event.target.value) // Update the search keyword
  }, 500) //

  console.log(questions, 'showanswert')

  const decodeHtmlEntities = html => {
    const txt = document.createElement('textarea')

    txt.innerHTML = html

    return txt.value // Return the decoded string
  }

  const decodeAndStripHtml = html => {
    const div = document.createElement('div')

    div.innerHTML = html // Decode HTML entities

    return div.textContent || div.innerText || '' // Strip HTML tags
  }

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleAccordionClick = guid => {
    router.push(`/question/edit?guid=${guid}&source=${testGuid}`) // Redirect to question edit page with the question's guid
  }

  const handleViewPage = guid => {
    router.push(`/question/view?guid=${guid}`) // Redirect to question edit page with the question's guid
  }

  return (
    <>
      {check && (
        <>
          {/* <Tablefor
            handleExpandAll={handleExpandAllButton}
            handleCollapseAll={handleCollapseAll}
            handleImportSelected={handleImportSelected}
            open={isSettingsOpen}
            handleClose={handleCloseSettings}
            handleSave={handleSaveSettings}
            addUserOpen={addUserOpen}
            setAddUserOpen={setAddUserOpen}
          /> */}
        </>
      )}
      <AddUserDrawer
        open={addUserOpen}
        handleClose={() => setAddUserOpen(!addUserOpen)}
        settings={settings}
        onSaveSettings={handleSettingsChange}
      />

      {/* <CardHeader
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
        /> */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}></div>
      {isVisible && (
        <div style={{ width: '100%', marginTop: '20px' }}>
          {/* Render Sections */}
          {questionData &&
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
                            checked={selectedQuestions && selectedQuestions.includes(section.sectionGuid)}
                            onChange={e => manageCheckboxState(section.sectionGuid, null, e.target.checked, true)}
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
                          __html: decodeAndStripHtml(`${section?.sectionId}.${section.sectionTitle}`)
                        }}
                      />
                      {/* Toggle Section Button */}
                      {section?.questions.length > 0 && (
                        <Button
                          style={{ marginLeft: '20px' }}
                          onClick={e => {
                            e.stopPropagation()
                            handleToggleAnswer(section.sectionId)
                          }}
                        >
                          {showAnswers.includes(section.sectionId) ? (
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
                        onClick={() => handleEdit(section.sectionTitle, section.sectionGuid)}
                      >
                        <i className='ri-edit-box-line' style={{ color: 'rgba(38, 43, 67, 0.898)' }}></i>
                        <span className='hover-text'>Edit Section</span>
                      </Box>

                      {/* Add and Import icons on the right */}
                      <Box display='flex' gap={1} justifyContent='flex-end'>
                        <Box
                          display='flex'
                          alignItems='center'
                          justifyContent='flex-end'
                          className='hover-container'
                          style={{ position: 'relative', width: '40px', height: '40px' }}
                          onClick={() => addQuestion(section.sectionGuid)}
                        >
                          <i
                            className='ri-add-fill'
                            style={{
                              width: 21.6,
                              height: 21.6
                            }}
                          />
                          <span className='hover-text'>Add Question</span>
                        </Box>

                        <Box
                          display='flex'
                          alignItems='center'
                          justifyContent='center'
                          className='hover-container'
                          style={{ position: 'relative', width: '40px', height: '40px' }}
                        >
                          <i
                            className='ri-download-2-line'
                            style={{ fontSize: '24px' }}
                            onClick={() => handleImport(section.sectionGuid)}
                          />
                          <span className='hover-text'>Import</span>
                        </Box>
                      </Box>
                    </Box>
                    {/* <hr
                    style={{
                      width: '100%',
                      border: '0.5px solid #ddd',
                      margin: '10px 0'
                    }}
                  /> */}
                    {/* Show Questions in Section */}
                    {showAnswers.includes(section.sectionId) &&
                      section.questions.map((question, questionIndex) => {
                        console.log('Question:', question) // Log the question object

                        const processedText = question?.text?.startsWith('#')
                          ? question?.text?.slice(1).trim()
                          : question?.text

                        return (
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
                                    checked={selectedQuestions?.includes(question.guid)}
                                    onChange={e => manageCheckboxState(null, question.guid, e.target.checked, false)}
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
                                  __html: decodeAndStripHtml(`${questionIndex + 1}. ${processedText}`)
                                }}
                              />

                              {/* Toggle Answer Button */}
                              <Button
                                style={{ marginLeft: '20px' }}
                                onClick={e => {
                                  e.stopPropagation()
                                  handleToggleAnswer(question.guid)
                                }}
                              >
                                {showAnswers.includes(question.guid) ? (
                                  <i className='ri-arrow-up-s-line' style={{ color: '#262B43E5' }} />
                                ) : (
                                  <i className='ri-arrow-down-s-line' style={{ color: '#262B43E5' }} />
                                )}
                              </Button>
                            </div>

                            {/* Show Answer Section */}
                            {showAnswers.includes(question.guid) && (
                              <div style={{ marginLeft: '40px' }}>
                                {question.options && (
                                  <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                                    {question.options.map((option, idx) => {
                                      const stripHtmlTags = str => str.replace(/<\/?[^>]+(>|$)/g, '')

                                      const label = `${String.fromCharCode(97 + idx)}. ${stripHtmlTags(option)}`

                                      {
                                        /*  console.log(isCorrect, 'iscorrect') */
                                      }

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
                                              color: isCorrect ? '#34C759' : 'black',
                                              cursor: 'pointer'
                                            }}
                                            onClick={() => handleEditAnswerClick(question.id, idx, option)}
                                          />
                                          {label}
                                        </li>
                                      )
                                    })}
                                  </ul>
                                )}
                                <Grid
                                  container
                                  spacing={2}
                                  justifyContent='space-between'
                                  alignItems='center'
                                  sx={{
                                    flexWrap: { xs: 'wrap', md: 'nowrap' } // Wrap on smaller screens, single row on desktop
                                  }}
                                >
                                  {/* Marks */}
                                  {
                                    <Grid item xs={12} md>
                                      <Box display='flex' alignItems='center'>
                                        <IconButton style={{ borderRadius: '8px', background: '#F0EFF0' }}>
                                          <i className='ri-percent-line' style={{ color: '#262B43E5' }} />
                                        </IconButton>
                                        <Box display='flex' flexDirection='column' style={{ marginLeft: '5px' }}>
                                          <Typography variant='body2' style={{ color: 'black' }}>
                                            Marks:
                                          </Typography>
                                          <Typography>{question?.marks}</Typography>
                                        </Box>
                                      </Box>
                                    </Grid>
                                  }
                                  {/* Category */}
                                  {
                                    <Grid item xs={12} md>
                                      <Box display='flex' alignItems='center'>
                                        <IconButton style={{ borderRadius: '8px', background: '#F0EFF0' }}>
                                          <i className='ri-list-unordered' style={{ color: '#262B43E5' }} />
                                        </IconButton>
                                        <Box display='flex' flexDirection='column' style={{ marginLeft: '5px' }}>
                                          <Typography variant='body2' style={{ color: 'black' }}>
                                            Category:
                                          </Typography>
                                          <Typography variant='body2'>Quiz</Typography>
                                        </Box>
                                      </Box>
                                    </Grid>
                                  }
                                  {/* Difficulty */}
                                  <Grid item xs={12} md>
                                    <Box display='flex' alignItems='center'>
                                      <IconButton style={{ borderRadius: '8px', background: '#F0EFF0' }}>
                                        <i className='ri-compass-2-line' style={{ color: '#262B43E5' }} />
                                      </IconButton>
                                      <Box display='flex' flexDirection='column'>
                                        <Typography variant='body2' style={{ color: 'black' }}>
                                          Difficulty
                                        </Typography>
                                        <Typography variant='body2'>Medium</Typography>
                                      </Box>
                                    </Box>
                                  </Grid>
                                  {/* Importance */}
                                  <Grid item xs={12} md>
                                    <Box display='flex' alignItems='center'>
                                      <IconButton style={{ borderRadius: '8px', background: '#F0EFF0' }}>
                                        <i className='ri-information-line' style={{ color: '#262B43E5' }} />
                                      </IconButton>
                                      <Box display='flex' flexDirection='column' style={{ marginLeft: '5px' }}>
                                        <Typography variant='body2' style={{ color: 'black' }}>
                                          Importance:
                                        </Typography>
                                        <Typography>{question?.importance?.title}</Typography>
                                      </Box>
                                    </Box>
                                  </Grid>
                                  {/* Negative Marks */}
                                  {
                                    <Grid item xs={12} md>
                                      <Box display='flex' alignItems='center'>
                                        <IconButton style={{ borderRadius: '8px', background: '#F0EFF0' }}>
                                          <i className='ri-information-line' style={{ color: '#262B43E5' }} />
                                        </IconButton>
                                        <Box display='flex' flexDirection='column' style={{ marginLeft: '5px' }}>
                                          <Typography variant='body2' style={{ color: 'black' }}>
                                            Negative Marks:
                                          </Typography>
                                          <Typography>{question?.neg_marks}</Typography>
                                        </Box>
                                      </Box>
                                    </Grid>
                                  }
                                  {/* Time */}
                                  {
                                    <Grid item xs={12} md>
                                      <Box display='flex' alignItems='center'>
                                        <IconButton style={{ borderRadius: '8px', background: '#F0EFF0' }}>
                                          <i className='ri-information-line' style={{ color: '#262B43E5' }} />
                                        </IconButton>
                                        <Box display='flex' flexDirection='column' style={{ marginLeft: '5px' }}>
                                          <Typography variant='body2' style={{ color: 'black' }}>
                                            Time:
                                          </Typography>
                                          <Typography>{question?.time}</Typography>
                                        </Box>
                                      </Box>
                                    </Grid>
                                  }
                                </Grid>
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
                return (
                  <div
                    key={section.id}
                    expanded={showAnswers.includes(section.id)} // Check if this question is expanded
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    draggable
                    style={{
                      borderRadius: 'none',
                      borderTop: 'none',
                      border: 'none'
                    }}
                    sx={{ '& .MuiAccordionSummary-expandIconWrapper': { display: 'none' } }} // Hide the expand icon
                  >
                    <div aria-controls={`panel${section.id}-content`} id={`panel${section.id}-header`}>
                      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <FormControlLabel
                          aria-label='Select'
                          control={
                            <Checkbox
                              checked={selectedQuestions && selectedQuestions.includes(section.guid)}
                              onChange={e => handleCheckboxChange(section.guid, e.target.checked)}
                            />
                          }
                          label=''
                          style={{ marginRight: '10px' }}
                        />

                        <Typography
                          variant='body1'
                          style={{
                            flexGrow: 1,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            textTransform: 'capitalize',
                            color: 'black'
                          }}
                          onClick={() => handleViewPage(section.guid)}
                          dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(`${section.id}. ${section.text}`) }}
                        ></Typography>

                        {/* Button to toggle answers directly on the accordion */}
                        <Button
                          style={{ marginLeft: '20px' }}
                          variant='text'
                          onClick={e => {
                            e.stopPropagation() // Prevent accordion toggle
                            handleToggleAnswer(section.id)
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
                      <div style={{ marginLeft: '40px' }}>
                        {section.options ? (
                          <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                            {section.options.map((option, index) => {
                              const stripHtmlTags = str => str.replace(/<\/?[^>]+(>|$)/g, '')
                              const letter = String.fromCharCode(97 + index) // Convert index to letter (A=65, B=66, ...)
                              const labeledOption = `${letter}. ${stripHtmlTags(option)}`

                              return (
                                <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography
                                    style={{
                                      color: section.correctanswer[index] === 1 ? '#34C759' : 'black',
                                      flexGrow: 1,
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => handleEditAnswerClick(section.id, index, option)}
                                    dangerouslySetInnerHTML={{ __html: labeledOption }}
                                  />
                                  {/* {labeledOption} */}
                                  {/* <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>{letter}</span> */}
                                </li>
                              )
                            })}
                          </ul>
                        ) : (
                          ''
                        )}
                        <Grid
                          container
                          spacing={2}
                          justifyContent='space-between'
                          alignItems='center'
                          sx={{
                            flexWrap: { xs: 'wrap', md: 'nowrap' } // Wrap on smaller screens, single row on desktop
                          }}
                        >
                          {/* Marks */}
                          {
                            <Grid item xs={12} md>
                              <Box display='flex' alignItems='center'>
                                <IconButton style={{ borderRadius: '8px', background: '#F0EFF0' }}>
                                  <i className='ri-percent-line' style={{ color: '#262B43E5' }} />
                                </IconButton>
                                <Box display='flex' flexDirection='column' style={{ marginLeft: '5px' }}>
                                  <Typography variant='body2' style={{ color: 'black' }}>
                                    Marks:
                                  </Typography>
                                  <Typography>{section?.marks}</Typography>
                                </Box>
                              </Box>
                            </Grid>
                          }
                          {/* Category */}
                          {
                            <Grid item xs={12} md>
                              <Box display='flex' alignItems='center'>
                                <IconButton style={{ borderRadius: '8px', background: '#F0EFF0' }}>
                                  <i className='ri-list-unordered' style={{ color: '#262B43E5' }} />
                                </IconButton>
                                <Box display='flex' flexDirection='column' style={{ marginLeft: '5px' }}>
                                  <Typography variant='body2' style={{ color: 'black' }}>
                                    Category:
                                  </Typography>
                                  <Typography variant='body2'>Quiz</Typography>
                                </Box>
                              </Box>
                            </Grid>
                          }
                          {/* Difficulty */}
                          <Grid item xs={12} md>
                            <Box display='flex' alignItems='center'>
                              <IconButton style={{ borderRadius: '8px', background: '#F0EFF0' }}>
                                <i className='ri-compass-2-line' style={{ color: '#262B43E5' }} />
                              </IconButton>
                              <Box display='flex' flexDirection='column'>
                                <Typography variant='body2' style={{ color: 'black' }}>
                                  Difficulty
                                </Typography>
                                <Typography variant='body2'>
                                  {section?.difficulty ? section?.difficulty : 'N/A'}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          {/* Importance */}
                          <Grid item xs={12} md>
                            <Box display='flex' alignItems='center'>
                              <IconButton style={{ borderRadius: '8px', background: '#F0EFF0' }}>
                                <i className='ri-information-line' style={{ color: '#262B43E5' }} />
                              </IconButton>
                              <Box display='flex' flexDirection='column' style={{ marginLeft: '5px' }}>
                                <Typography variant='body2' style={{ color: 'black' }}>
                                  Importance:
                                </Typography>
                                <Typography>{section?.importance ? section?.importance : 'N/A'}</Typography>
                              </Box>
                            </Box>
                          </Grid>
                          {/* Negative Marks */}
                          {
                            <Grid item xs={12} md>
                              <Box display='flex' alignItems='center'>
                                <IconButton style={{ borderRadius: '8px', background: '#F0EFF0' }}>
                                  <i className='ri-information-line' style={{ color: '#262B43E5' }} />
                                </IconButton>
                                <Box display='flex' flexDirection='column' style={{ marginLeft: '5px' }}>
                                  <Typography variant='body2' style={{ color: 'black' }}>
                                    Negative Marks:
                                  </Typography>
                                  <Typography>{section?.neg_marks}</Typography>
                                </Box>
                              </Box>
                            </Grid>
                          }
                          {/* Time */}
                          {
                            <Grid item xs={12} md>
                              <Box display='flex' alignItems='center'>
                                <IconButton style={{ borderRadius: '8px', background: '#F0EFF0' }}>
                                  <i className='ri-information-line' style={{ color: '#262B43E5' }} />
                                </IconButton>
                                <Box display='flex' flexDirection='column' style={{ marginLeft: '5px' }}>
                                  <Typography variant='body2' style={{ color: 'black' }}>
                                    Time:
                                  </Typography>
                                  <Typography>{section?.time}</Typography>
                                </Box>
                              </Box>
                            </Grid>
                          }
                        </Grid>
                      </div>
                    )}
                    {
                      <Button
                        style={{ color: 'rgba(38, 43, 67, 0.898)', marginTop: '10px' }}
                        onClick={() => handleAccordionClick(section.guid)}
                      >
                        <i className='ri-edit-box-line' style={{ color: 'rgba(38, 43, 67, 0.898)' }}></i>
                      </Button>
                    }
                    <hr style={{ width: '100%', border: '0.5px solid #ddd', margin: '10px 0' }} />
                  </div>
                )
              }

              {
                /* })} */
              }

              {
                /* </div> */
              }
            })}
        </div>
      )}
    </>
  )
}

export default QuestionCardTest

//}tests/save_uploaded_questions/SAM8 api save
