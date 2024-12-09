'use client'
import { useEffect, useState } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import CircularProgress from '@mui/material/CircularProgress'

// React Imports

// MUI Imports
import Card from '@mui/material/Card'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

// Third-party Imports

import Box from '@mui/material/Box'

// Component Imports
import TableFilters from './TableFilters'

import '../../style/styles.css'

// Style Imports
import TestCard from './TestCard'

import { Grid, Menu, MenuItem } from '@mui/material'

import QuickLinksCard from './QuickLinkCards'
import QuestionCard from './QuestionCard'
import useQuestionModuleApi from '@/api/useQuestionModuleApi'
import QuestionCardTest from './QuestionCardTest'
import useTestApi from '@/api/useTestApi'
import FilterHeader from '@/components/globals/FilterHeader'

// import { useRouter } from 'next/router'
// Var

import Topcard from './Topcard'
import Topcardtest from './TopcardTest'
import TopcardTest from './TopcardTest'
import DialogBox from './DialogBox'

import { useForm } from 'react-hook-form'

// Column Definitions

const QuestionList = ({ tableData }) => {
  const { data, fetchData, addSection, updateSection } = useQuestionModuleApi()

  // const [addUserOpen, setAddUserOpen] = useState('false')
  const { BulkRemoveQuestion } = useTestApi()
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [expandedPanels, setExpandedPanels] = useState([]) // Tracks which panels are expanded
  const [isVisible, setIsVisible] = useState(true) // Controls visibility of questions
  const [showAnswers, setShowAnswers] = useState([]) // Tracks which panels' answers are shown
  const { getTestQuestion, testQuestionData, loading, error } = useTestApi()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [localSearch, setLocalSearch] = useState('')
  const searchParams = useSearchParams()
  const categoryGuid = 'guid'
  const testGuid = searchParams.get('testguid')
  const sectionGuids = searchParams.get('')
  const [description, setDescription] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [currentDescription, setCurrentDescription] = useState('')
  const [sectionGuid, setSectionGuid] = useState('')
  const [isPublished, setIsPublished] = useState(testQuestionData?.status === 1)

  const debounce = (func, delay) => {
    let timeoutId

    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func.apply(null, args)
      }, delay)
    }
  }

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      currentDescription: ''

      // type: '',
    }
  })

  const [isExpandedAll, setIsExpandedAll] = useState(false) // Tracks if all are expanded

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchKeyword(localSearch) // Only set search keyword after delay
    }, 500) // 500ms delay

    return () => clearTimeout(delayDebounceFn) // Cleanup the timeout
  }, [localSearch, setSearchKeyword])
  useEffect(() => {
    getTestQuestion(testGuid, searchKeyword)
  }, [searchKeyword])

  const handleExpandAll = () => {
    setIsVisible(true) // Show the questions
    setExpandedPanels(questions.map(q => q.id)) // Expand all panels
    setShowAnswers([]) // Reset showing answers (no answers shown)
    setIsExpandedAll(true) // Set the expanded state
  }

  const handleExpandAllButton = () => {
    setIsVisible(true) // Show the questions
    setExpandedPanels(questions.map(q => q.id)) // Expand all panels
    setShowAnswers(questions.map(q => q.id)) // Reset showing answers (no answers shown)
    // setIsExpandedAll(true) // Set the expanded state
  }

  // Function to collapse all accordions and hide everything
  const handleCollapseAll = () => {
    setExpandedPanels([]) // Collapse all panels
    setIsVisible(false) // Hide the questions
    setShowAnswers([]) // Reset answers visibility
    setIsExpandedAll(false) // Reset the expanded state
  }

  // Function to toggle the answer visibility of a specific question
  const toggleAnswer = panelId => {
    if (showAnswers.includes(panelId)) {
      setShowAnswers(showAnswers.filter(id => id !== panelId)) // Hide answer if already visible
    } else {
      setShowAnswers([...showAnswers, panelId]) // Show answer if hidden
    }

    // setIsExpandedAll(true)
  }

  const [filteredData, setFilteredData] = useState(testQuestionData || []) // Initialize with data from API

  useEffect(() => {
    if (testQuestionData) {
      setFilteredData(testQuestionData)
    }
  }, [testQuestionData])
  console.log(isExpandedAll)

  // console.log(questionss, 'questionss')
  const [selectedQuestions, setSelectedQuestions] = useState([]) // Track selected checkboxes in QuestionCard

  // Pass this to QuestionCard to manage checkbox selections
  const handleCheckboxChange = (questionId, isChecked) => {
    if (isChecked) {
      setSelectedQuestions([...selectedQuestions, questionId]) // Add question to selected list
    } else {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId)) // Remove from list
    }
  }

  const handleDeleteClick = () => {
    if (selectedQuestions.length > 0) {
      setOpenDeleteDialog(true)
    }
  }

  const handleSearch = debounce(event => {
    setSearchKeyword(event.target.value) // Update the search keyword
  }, 500) // 500ms delay before making the API call

  // const handleConfirmDelete = () => {
  //   console.log('Deleted questions:', selectedQuestions)
  //   setSelectedQuestions([]) // Clear the selected questions
  //   setOpenDeleteDialog(false) // Close the dialog
  // }

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false)
  }

  const questions = testQuestionData.questions
    ?.filter(item => item.question !== null) // Filter out items with a null question
    .map((item, index) => ({
      // console.log(item, 'checking')
      guid: item.guid,
      id: index + 1,
      text: item.question, // No need for null check here since it's already filtered
      options: item.choices.map(choice => choice.choice), // Map the options
      correctanswer: item.choices.map(choice => choice.is_correct_answer) // Map correct answers
    }))

  // const filteredQuestions = questions?.filter(question =>
  //   question.text.toLowerCase().includes(searchKeyword.toLowerCase())
  // )
  // console.log(filteredQuestions, 'filtered')
  let globalCounters = 0

  const formattedData = testQuestionData.questions?.map(item => {
    globalCounters++ // Increment global counter for each item

    if (item.type === 'section') {
      return {
        type: 'section',
        sectionGuid: item?.guid,
        sectionId: globalCounters,
        sectionTitle: item?.question,
        questions:
          item?.children
            ?.filter(question => question?.question !== null)
            ?.map(child => ({
              guid: child?.guid,

              text: child?.question,
              options: Array.isArray(child?.choices) ? child.choices.map(choice => choice.choice) : [],
              correctanswer: Array.isArray(child?.choices) ? child.choices.map(choice => choice.is_correct_answer) : [],
              marks: child?.marks,
              creationDate: child?.created_on,
              question_type: child?.question_type,
              neg_marks: child?.neg_marks,
              time: child?.time
            })) || []
      }
    } else {
      return {
        type: 'question',
        id: globalCounters,
        guid: item?.guid,
        text: item?.question,
        options: Array.isArray(item?.choices) ? item.choices.map(choice => choice.choice) : [],
        correctanswer: Array.isArray(item?.choices) ? item.choices.map(choice => choice.is_correct_answer) : [],
        marks: item?.marks,
        creationDate: item?.created_on,
        question_type: item?.question_type,
        neg_marks: item?.neg_marks,
        time: item?.time,
        difficulty: item?.difficulty?.title,
        importance: item?.importance?.title
      }
    }
  })

  console.log(formattedData, 'formatted')

  const applySort = questions => {
    const stripHtmlTags = text => {
      const parser = new DOMParser()
      const parsedHtml = parser.parseFromString(text, 'text/html')

      return parsedHtml.body.textContent || ''
    }

    const cleanText = text => {
      // Remove HTML tags
      let strippedText = stripHtmlTags(text)

      strippedText = strippedText.replace(/<\/?[^>]+>/gi, '').replace(/[^a-zA-Z0-9\s]/g, '') // Remove all non-alphanumeric characters except spaces

      // Step 3: Trim spaces from start and end
      return strippedText.trim()
    }

    return questions
  }

  const sortedQuestions = applySort(formattedData)
  const sortedQuestionss = applySort(questions)

  console.log(sortedQuestions, 'format')
  console.log(sortedQuestionss, 'formatquestions')
  const width = '850px'
  const deleteIconActive = selectedQuestions.length > 0

  console.log(questions, 'sssss')
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const [addUserOpen, setAddUserOpen] = useState(false)
  const router = useRouter()

  const handleImportClick = event => {
    // router.push('/question/import') // Replace with the actual path to the import page
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null) // Close the dropdown
  }

  const handleImportFromBank = () => {
    // Implement your logic for importing from the question bank
    router.push(`/question/allquestion`)
    console.log('Importing from question bank')
    handleClose()
  }

  const handleImportFromFile = () => {
    router.push(`/question/import?testguid=${testGuid}`)
    console.log('Importing from file')
    handleClose()
  }

  // const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const AddQuestion = () => {
    router.push(`/test/questions?testguid=${testGuid}`)
  }

  // const handleDeleteClick = () => {
  //   if (selectedQuestions.length > 0) {
  //     setOpenDeleteDialog(true)
  //     setDeleteOpen(true)
  //     setTrashOpen(false)
  //   }

  //   // setDeleteOpen(true)
  // }
  const onSubmit = async data => {
    const newUser = {
      // avatar: `/images/avatars/${Math.floor(Math.random() * 8) + 1}.png`,
      // title: data.title,
      description: currentDescription

      // guid: testGuid

      // type: data.type,
      // parent: selectedCategories[selectedCategories.length - 1],
      // created_on: moment().format('YYYY-MM-DD HH:mm:ss'),

      // optional parameters
      // created_by: 'ADJ20',
      // status: '0'
    }

    await updateSection(currentDescription, sectionGuid)

    // fetchDataallquestion({
    //   page: currentPage,
    //   results_per_page: rowsPerPage
    // })
    setAddUserOpen(!addUserOpen)

    // setDescription(null)
    // setCurrentDescription(null)
    setIsEditing(false)
    getTestQuestion(testGuid)

    // setFormData(initialData)
    resetForm({ currentDescription: '' })
  }

  const handleConfirmDelete = async () => {
    try {
      // Call the delete function from your API hook

      await BulkRemoveQuestion(selectedQuestions, testGuid)
      await getTestQuestion(testGuid)
      console.log('Deleted questions:', selectedQuestions)
      setSelectedQuestions([]) // Clear the selected questions
      setOpenDeleteDialog(false)() // Close the dialog // Refresh the questions list after deletion
    } catch (error) {
      console.error('Error deleting questions:', error)
    }
  }

  const addQuestion = guid => {
    if (guid) {
      router.push(`/test/questions?sectionguid=${guid}`)
    }

    if (guid && testGuid) {
      router.push(`/test/questions?sectionguid=${guid}&tguid=${testGuid}`)
    } else {
      router.push('/test/questions')
    }
  }

  const manageCheckboxState = (sectionGuid, questionGuid, isChecked, isSectionAction) => {
    console.log(questionGuid, 'questionGuid')
    const updatedSelectedQuestions = new Set(selectedQuestions)

    if (isSectionAction) {
      // Section checkbox logic
      const section = formattedData.find(section => section.sectionGuid === sectionGuid)

      if (section) {
        if (isChecked) {
          // Add all questions and the section itself
          section.questions.forEach(question => updatedSelectedQuestions.add(question.guid))
          updatedSelectedQuestions.add(sectionGuid)
        } else {
          // Remove all questions and the section itself
          section.questions.forEach(question => updatedSelectedQuestions.delete(question.guid))
          updatedSelectedQuestions.delete(sectionGuid)
        }
      }
    } else {
      // Question checkbox logic
      if (isChecked) {
        updatedSelectedQuestions.add(questionGuid)

        // Check if all questions in the parent section are selected
        const parentSection = formattedData.find(
          section => section?.questions?.some(question => question.guid === questionGuid) // Add safe check for questions
        )

        if (parentSection) {
          if (
            parentSection.questions.every(question => updatedSelectedQuestions.has(question.guid)) &&
            updatedSelectedQuestions.has(parentSection.sectionGuid) // Ensure the section was not previously deselected
          ) {
            // Keep the section unchecked if it was manually deselected
            updatedSelectedQuestions.delete(parentSection.sectionGuid)
          }
        }
      } else {
        updatedSelectedQuestions.delete(questionGuid)

        // Ensure section is unchecked if any question is unchecked
        const parentSection = formattedData.find(
          section => section?.questions?.some(question => question.guid === questionGuid) // Add safe check for questions
        )

        if (parentSection) {
          updatedSelectedQuestions.delete(parentSection.sectionGuid)
        }
      }
    }

    setSelectedQuestions([...updatedSelectedQuestions])
  }

  const handleEdit = (description, guid) => {
    setIsEditing(true)
    setAddUserOpen(true)
    setCurrentDescription(description) // Set the description to edit
    setSectionGuid(guid)
  }

  return (
    <>
      <FilterHeader title='All Questions' subtitle='Orders placed across your store' link='/test/questions'>
        <Grid
          item
          xs={6}
          // gap={2}
          md={2}
          display='flex'
          alignItems='end'
          justifyContent='flex-end'
          /* Aligns the button to the right */ pb={3}
        >
          <Button
            variant='outlined'
            aria-controls='basic-menu'
            aria-haspopup='true'
            color='secondary'
            onClick={handleImportClick}
            startIcon={
              <i
                className='ri-download-line'
                style={{ color: 'silver' }}

                // onClick={e => handleDeleteClick(e, 1)}
              />
            }
            endIcon={<i className='ri-arrow-down-s-line' style={{ color: 'silver' }} />}
          >
            Import Question
          </Button>
          <Menu keepMounted id='basic-menu' anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl)}>
            <MenuItem
              onClick={handleImportFromBank}
              sx={{
                '&:hover': {
                  backgroundColor: 'primary.main', // Change this to your desired primary color
                  color: 'white' // Optional: Change text color on hover
                }
              }}
            >
              Import from question bank
            </MenuItem>
            <MenuItem
              onClick={handleImportFromFile}
              sx={{
                '&:hover': {
                  backgroundColor: 'primary.main', // Change this to your desired primary color
                  color: 'white' // Optional: Change text color on hover
                }
              }}
            >
              Import from file
            </MenuItem>
          </Menu>
        </Grid>
        <Grid
          item
          xs={6}
          // gap={2}
          md={2}
          display='flex'
          alignItems='end'
          justifyContent='flex-end'
          /* Aligns the button to the right */ pb={3}
        >
          <Button
            fullWidth
            variant='outlined'
            // onClick={categoryPage}
            onClick={AddQuestion}
            className='max-sm:is-full'
            startIcon={
              <i
                class='ri-add-fill'
                style={{
                  width: 21.6,
                  height: 21.6
                }}
              />
            }
          >
            Add Question
          </Button>
        </Grid>
      </FilterHeader>
      <Card
        sx={{
          padding: '20px',
          borderRadius: '15px',
          border: '1px solid #d3d3d3',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          width: '100%',
          marginBottom: '20px',
          boxSizing: 'border-box'
        }}
      >
        {loading ? (
          <Box className='loader' style={{ textAlign: 'center', padding: '50px 0px' }}>
            <CircularProgress />
          </Box>
        ) : formattedData && formattedData.length > 0 ? (
          <>
            <TopcardTest
              deleteIconActive={deleteIconActive}
              handleSearch={e => setLocalSearch(e.target.value)}
              onDeleteClick={handleDeleteClick}
              searchKeyword={searchKeyword}
            />
            <Grid container gap={10}>
              <Grid item xs={12} md={9} lg={8} sm={12}>
                <QuestionCardTest
                  userListTable={'true'}
                  marginLeft={'17px'}
                  width={'auto'}
                  expandedPanels={expandedPanels}
                  setExpandedPanels={setExpandedPanels}
                  isVisible={isVisible}
                  setIsVisible={setIsVisible}
                  showAnswers={showAnswers}
                  setShowAnswers={setShowAnswers}
                  handleCollapseAll={handleCollapseAll}
                  handleExpandAll={handleExpandAll}
                  toggleAnswer={toggleAnswer}
                  questions={formattedData}
                  isExpandedAll={isExpandedAll}
                  setIsExpandedAll={setIsExpandedAll}
                  onQuestionSelect={handleCheckboxChange}
                  selectedQuestions={selectedQuestions}
                  setSelectedQuestions={setSelectedQuestions}
                  addQuestion={addQuestion}
                  manageCheckboxState={manageCheckboxState}
                  handleEdit={handleEdit}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <TestCard
                  testQuestionData={testQuestionData}
                  isPublished={isPublished}
                  setIsPublished={setIsPublished}
                  getTestQuestion={getTestQuestion}
                  searchKeyword={searchKeyword}
                />
                <QuickLinksCard />
              </Grid>
            </Grid>
          </>
        ) : (
          error && (
            <Box className='loader' style={{ textAlign: 'center', padding: '50px 0px' }}>
              No records found
            </Box>
          )
        )}

        {/* </Grid> */}
        {/* <Dialog
          open={openDeleteDialog}
          onClose={handleCancelDelete}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: '600px' } }} // Setting the width and maxWidth
        >
          <DialogTitle id='alert-dialog-title'>{'Delete Questions'}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>Are you sure you want to delete ?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCancelDelete}
              style={{ border: '1px solid black', color: 'black', height: '38px', width: '94px' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant='contained'
              style={{ height: '38px', width: '94px' }}
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog> */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleCancelDelete}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: '600px' } }} // Setting the width and maxWidth
        >
          <DialogTitle id='alert-dialog-title'>{'Delete Questions'}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              Are you sure you want to Remove Questions?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCancelDelete}
              style={{ border: '1px solid black', color: 'black', height: '38px', width: '94px' }}
            >
              Cancel
            </Button>
            <Button
              onClick={
                handleConfirmDelete // For "Delete"
              }
              variant='contained'
              style={{ height: '38px', width: '94px' }}
              autoFocus
            >
              {'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
        <DialogBox
          open={addUserOpen}
          onClose={handleClose}
          onSubmit={onSubmit}
          description={currentDescription} // Show current description when editing
          setDescription={setCurrentDescription} // Update state accordingly
          handleSubmit={handleSubmit}

          // handleReset={handleReset}

          // edit={isEditing} // Pass edit state to the DialogBox

          // updateUserData={updateUserData}
          // addUserData={addUserData}
        />
      </Card>
    </>
  )
}

export default QuestionList
