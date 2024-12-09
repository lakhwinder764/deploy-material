import React, { useState, useEffect, useRef } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import { Button, Typography, Checkbox, FormControlLabel, Box, IconButton, Grid } from '@mui/material'

import axios from 'axios'
import { toast } from 'react-toastify'

import useDraggableList from './useDraggableList' // Import the custom hook
import Tablefor from '../import/view/Tablefor'

const QuestionCardBankModule = ({
  expandedPanels,
  isVisible,
  showAnswers,
  setShowAnswers,
  handleCollapseAll,
  questions,
  selectedQuestions,
  handleCheckboxChange,
  showCorrectAnswer,
  check,
  showCategory,
  showFields,
  trash,
  currentPage,
  addQuestion,
  handleEdit,
  setSelectedQuestions,
  manageCheckboxState
}) => {
  const [editingQuestionId, setEditingQuestionId] = useState(null) // To track which question is being edited
  const [editedText, setEditedText] = useState('') // To store the edited text for a question
  const [editingAnswerId, setEditingAnswerId] = useState(null) // To track which answer is being edited
  const [editedAnswer, setEditedAnswer] = useState('') // To store the edited text for
  // Using a custom hook for drag-and-drop
  const { items: questionList, handleDragStart, handleDragOver, handleDrop } = useDraggableList(questions)
  const [questionData, setQuestionData] = useState(questions)
  const isInitialRender = useRef(true) // Track if this is the initial render

  // Use useEffect to update questionData whenever questions prop changes
  useEffect(() => {
    setQuestionData(questions)
  }, [questions])

  // Set all questions to be expanded by default on initial render
  useEffect(() => {
    if (isInitialRender.current && questionData.length > 0) {
      const allQuestionIds = questionData.map(question => question.id)

      setShowAnswers(allQuestionIds)
      isInitialRender.current = false // Set flag to false
    }
  }, [questionData, currentPage])

  // const groupedBySection = questionData?.sections.reduce((acc, question) => {
  //   const section = question.section || 'Default Section' // Use 'Default Section' if no section specified

  //   if (!acc[section]) acc[section] = []
  //   acc[section].push(question)

  //   return acc
  // }, {})

  console.log(questionData, 'sectionss')

  const handleToggleAnswer = questionId => {
    setShowAnswers(prevAnswers =>
      prevAnswers.includes(questionId) ? prevAnswers.filter(id => id !== questionId) : [...prevAnswers, questionId]
    )
  }

  const handleEditAnswerClick = (questionId, answerIndex, currentAnswer) => {
    setEditingAnswerId(`${questionId}-${answerIndex}`) // Set the answer ID being edited
    setEditedAnswer(currentAnswer) // Set the current answer in the input field
    setEditingQuestionId(null)
  }

  // Handle answer edit change

  // Handle saving the edited answer
  useEffect(() => {}, [questions, isVisible, expandedPanels, questions])
  console.log(editedAnswer, 'gg')

  const handleImportSelected = async () => {
    if (selectedQuestions.length === 0) {
      toast.error('Please select at least one question.')

      return
    }

    // Create a new FormData object
    const formData = new FormData()

    const selectedQuestionData = questionData.filter(q => selectedQuestions.includes(q.id))

    // Loop through selected questions and append to formData
    selectedQuestionData.forEach((question, index) => {
      // Append question fields in the required form-data format
      formData.append(`questions[${index}][question]`, question.text) // Question text
      formData.append(`questions[${index}][question_type]`, question.question_type) // Assuming 'mcq' as question type

      // Append choices for the question
      question.options.forEach((choice, choiceIndex) => {
        formData.append(`questions[${index}][choice][${choiceIndex}]`, choice)
      })

      question.correctanswer.forEach((correctanswer, correctAnswerIndex) => {
        formData.append(`questions[${index}][correct_answer][${correctAnswerIndex}]`, correctanswer)
      })

      question.order.forEach((order, orderIndex) => {
        formData.append(`questions[${index}][order][${orderIndex}]`, order)
      })
    })

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_LMS_API_URL}tests/save_uploaded_questions/MAT3`

      const response = await axios.post(
        endpoint,
        formData, // Send the formData object
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`, // Include Authorization header
            Network: process.env.NEXT_PUBLIC_LMS_TOKEN, // Include Network header
            Accept: 'application/json', // Specify accepted response format
            'Content-Type': 'multipart/form-data' // Specify form-data content type
          }
        }
      )

      // Handle success response
      toast.success('Selected questions imported successfully!')

      setQuestionData(selectedQuestionData)
    } catch (error) {
      toast.error('Failed to import selected questions.')
    }
  }

  const handleExpandAllButton = () => {}

  const router = useRouter()

  const handleAccordionClick = guid => {
    router.push(`/question/edit?guid=${guid}`) // Redirect to question edit page with the question's guid
  }

  const handleViewPage = guid => {
    router.push(`/question/view?guid=${guid}`) // Redirect to question edit page with the question's guid
  }

  const decodeHtmlEntities = html => {
    const txt = document.createElement('textarea')

    txt.innerHTML = html

    return txt.value.replace(/<[^>]*>/g, '') // Remove HTML tags
  }

  const handleImport = guid => {
    router.push(`/question/import?sectionguid=${guid}`)
  }

  // const manageCheckboxState = (sectionGuid, questionGuid, isChecked, isSectionAction) => {
  //   const updatedSelectedQuestions = new Set(selectedQuestions)

  //   if (isSectionAction) {
  //     // Section checkbox logic
  //     const section = questionData.find(section => section.sectionGuid === sectionGuid)

  //     if (section) {
  //       if (isChecked) {
  //         // Add all questions and the section itself
  //         section.questions.forEach(question => updatedSelectedQuestions.add(question.guid))
  //         updatedSelectedQuestions.add(sectionGuid)
  //       } else {
  //         // Remove all questions and the section itself
  //         section.questions.forEach(question => updatedSelectedQuestions.delete(question.guid))
  //         updatedSelectedQuestions.delete(sectionGuid)
  //       }
  //     }
  //   } else {
  //     // Question checkbox logic
  //     if (isChecked) {
  //       updatedSelectedQuestions.add(questionGuid)

  //       // If all questions in a section are selected, the section remains unchecked
  //       const parentSection = questionData.find(section =>
  //         section.questions.some(question => question.guid === questionGuid)
  //       )

  //       if (parentSection && parentSection.questions.every(question => updatedSelectedQuestions.has(question.guid))) {
  //         // Do not add section even if all questions are selected
  //         updatedSelectedQuestions.delete(parentSection.sectionGuid)
  //       }
  //     } else {
  //       updatedSelectedQuestions.delete(questionGuid)

  //       // Ensure section is unchecked if any question is unchecked
  //       const parentSection = questionData.find(section =>
  //         section.questions.some(question => question.guid === questionGuid)
  //       )

  //       if (parentSection) {
  //         updatedSelectedQuestions.delete(parentSection.sectionGuid)
  //       }
  //     }
  //   }

  //   setSelectedQuestions([...updatedSelectedQuestions])
  // }
  console.log(selectedQuestions, 'selctedquestions')

  return (
    <>
      {/* <Card style={{ marginTop: '50px', padding: '20px', width: width }}> */}
      {check && (
        <Tablefor
          handleExpandAll={handleExpandAllButton}
          handleCollapseAll={handleCollapseAll}
          handleImportSelected={handleImportSelected}
        />
      )}
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
                          __html: decodeHtmlEntities(`${section?.sectionId}.${section.sectionTitle}`)
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
                                  __html: decodeHtmlEntities(`${questionIndex + 1}. ${processedText}`)
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
                                              color: showCorrectAnswer && isCorrect ? '#34C759' : 'black',
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
                                  {showFields && (
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
                                  )}
                                  {/* Category */}
                                  {showCategory && (
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
                                  )}
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
                                  {showFields && (
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
                                  )}
                                  {/* Time */}
                                  {showFields && (
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
                                  )}
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
                              const letter = String.fromCharCode(97 + index) // Convert index to letter (A=65, B=66, ...)
                              const labeledOption = `${letter}. ${decodeHtmlEntities(option)}`

                              return (
                                <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography
                                    style={{
                                      color:
                                        showCorrectAnswer && section.correctanswer[index] === 1 ? '#34C759' : 'black',
                                      flexGrow: 1,
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => handleEditAnswerClick(section.id, index, option)}
                                    dangerouslySetInnerHTML={{ __html: labeledOption }}
                                  />
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
                          {showFields && (
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
                          )}
                          {/* Category */}
                          {showCategory && (
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
                          )}
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
                          {showFields && (
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
                          )}
                          {/* Time */}
                          {showFields && (
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
                          )}
                        </Grid>
                      </div>
                    )}
                    {!trash && (
                      <Button
                        style={{ color: 'rgba(38, 43, 67, 0.898)', marginTop: '10px' }}
                        onClick={() => handleAccordionClick(section.guid)}
                      >
                        <i className='ri-edit-box-line' style={{ color: 'rgba(38, 43, 67, 0.898)' }}></i>
                      </Button>
                    )}
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

export default QuestionCardBankModule
