'use client'

import React, { useState, useEffect } from 'react'

// import useQuestionApi from '../../../Api/useQuestionApi'
import { Box, CircularProgress } from '@mui/material'
import { useSelector } from 'react-redux'

import { useForm } from 'react-hook-form'

import QuestionCard from '../../list/QuestionCard'
import TableFilters from '../../list/TableFilters'
import Tablefor from './Tablefor'
import useQuestionModuleApi from '@/api/useQuestionModuleApi'
import EditImport from '../../list/EditImport'
import DialogBox from '../../list/DialogBox'
import '../../../style/styles.css'

const ImportView = () => {
  const [expandedPanels, setExpandedPanels] = useState([]) // Tracks which panels are expanded
  const [isVisible, setIsVisible] = useState(true) // Controls visibility of questions
  const [showAnswers, setShowAnswers] = useState([]) // Tracks which panels' answers are shown
  const [edit, setEdit] = useState(false)
  const [isExpandedAll, setIsExpandedAll] = useState(false) // Tracks if all are expanded
  const { uploadData, uploadFiles, file, uploadingData, uploadFiled } = useQuestionModuleApi()
  const [fileReferences, setFileReferences] = useState([])
  const { files, uploading, error } = useSelector(state => state.fileReducer)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [questions, setQuestions] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [currentDescription, setCurrentDescription] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  console.log(files, 'ccccc')
  console.log(uploadData, 'ssssss')

  const createFileArray = fileList => {
    return Array.from(fileList).map(file => ({
      path: file.name,
      name: file.name,
      lastModified: file.lastModified,
      lastModifiedDate: new Date(file.lastModified),
      size: file.size,
      type: file.type,
      webkitRelativePath: file.webkitRelativePath || ''
    }))
  }

  console.log(files, 'chedcking')

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      description: ''

      // type: '',
    }
  })

  // Simulated file input (e.g., coming from an <input type="file"> or drag-and-drop)
  const fileList = [
    new File(['file content'], 'BulkQuestionUpload.txt', {
      type: 'text/plain',
      lastModified: 1726239009248
    })
  ]

  useEffect(() => {
    if (files.length > 0) {
      uploadFiles(files) // Call the API with the files if they exist
    }
  }, [files])
  console.log(files, 'filesarray')
  console.log(uploadData)
  useEffect(() => {
    if (uploadData) {
      const questionSection = Object.keys(uploadData)
        .filter(key => uploadData[key].question !== null) // Filter out items with a null question
        .reduce((acc, key) => {
          const item = uploadData[key]
          const { choice, correct_answer, question, parent_id, created_by, order, type, guid } = item

          if (parent_id) {
            // Handle child questions
            const parentSection = acc.find(section => section.id === parent_id.toString())

            if (parentSection) {
              parentSection.questions.push({
                guid,
                id: key, // Use the key as the ID of the child
                text: question,
                options: choice || [],
                correctanswer: correct_answer,
                order,
                created_by,
                type
              })
            }
          } else {
            // Handle standalone sections
            const newSection = {
              guid,
              id: key, // Use the key as the unique ID for the section
              text: question,
              type, // Explicitly set type for the section
              options: choice || [],
              correctanswer: correct_answer,
              order,
              created_by,
              questions: [] // Initialize an empty array for child questions
            }

            acc.push(newSection)
          }

          return acc
        }, [])

      setQuestions(questionSection) // Set the formatted data
    }
  }, [uploadData])

  const formattedQuestions = Object.keys(uploadData)
    .filter(key => uploadData[key].question !== null)
    .map((key, index) => {
      const item = uploadData[key]
      const { choice, correct_answer, question, parent_id, created_by, order, type, guid } = item

      return {
        guid: guid,
        id: key,
        text: question,
        options: choice || [],
        correctanswer: correct_answer,
        order,
        created_by,
        parent_id,
        type
      }
    })

  console.log(formattedQuestions, 'questionscheck')
  const filesArray = createFileArray(fileList)

  console.log(createFileArray(fileList), 'hhhh')

  console.log(fileReferences, 'files')
  useEffect(() => {
    // uploadFiles(filesArray)
  }, [])

  const handleExpandAllButton = () => {
    setIsVisible(true) // Show the questions
    setExpandedPanels(questions.map(q => q.id)) // Expand all panels
    setShowAnswers(questions.map(q => q.id)) // Reset showing answers (no answers shown)
    // setIsExpandedAll(true) // Set the expanded state
  }

  const handleReset = () => {
    setAddUserOpen(!addUserOpen)
    setIsEditing(false)

    // setFormData(initialData)
    // setDescription('')
    setCurrentDescription('')
  }

  const handleClose = () => {
    setAddUserOpen(false)
    setIsEditing(false)
    setCurrentDescription('') // Reset description after closing
  }

  // Function to collapse all accordions and hide everything
  const handleCollapseAll = () => {
    setExpandedPanels([]) // Collapse all panels
    setIsVisible(false) // Hide the questions
    setShowAnswers([]) // Reset answers visibility
    setIsExpandedAll(false) // Reset the expanded state
  }

  const onSubmit = async data => {
    const newUser = {
      // avatar: `/images/avatars/${Math.floor(Math.random() * 8) + 1}.png`,
      // title: data.title,
      // description: description
      // type: data.type,
      // parent: selectedCategories[selectedCategories.length - 1],
      // created_on: moment().format('YYYY-MM-DD HH:mm:ss'),
      // optional parameters
      // created_by: 'ADJ20',
      // status: '0'
    }

    // if (isEditing) {
    //   await updateSection(currentDescription, sectionGuid)
    // } else {
    //   await addSection(newUser)
    // }

    // fetchDataallquestion({
    //   page: currentPage,
    //   results_per_page: rowsPerPage
    // })
    setAddUserOpen(!addUserOpen)

    // setDescription(null)
    setCurrentDescription(null)
    setIsEditing(false)

    // setFormData(initialData)
    resetForm({ currentDescription: '' })

    // console.log(description, 'setDescriprion')
  }

  // Function to toggle the answer visibility of a specific question
  const toggleAnswer = panelId => {
    // setIsVisible(true)
    // if (showAnswers.includes(panelId)) {
    //   setShowAnswers(showAnswers.filter(id => id !== panelId)) // Hide answer if already visible
    // } else {
    //   setShowAnswers([...showAnswers, panelId]) // Show answer if hidden
    //   setIsVisible(true)
    // }
  }

  const [filteredData, setFilteredData] = useState(uploadData || []) // Initialize with data from API

  // const { uploadData } = useQuestionApi(); // Fetching uploadData from the hook
  const handleSave = updatedQuestion => {
    setQuestions(prevQuestions =>
      prevQuestions.map(question => (question.id === updatedQuestion.id ? updatedQuestion : question))
    )
    setEditingQuestion(null) // Close the EditImport component
  }

  console.log(questions, 'sssss')
  useEffect(() => {
    if (uploadData) {
      setFilteredData(uploadData) // Make sure uploadData is set here
    }
  }, [uploadData])

  const questionss = Object.keys(uploadData)
    .filter(key => uploadData[key].question !== null) // Filter out items with a null question
    .map((key, index) => {
      const item = uploadData[key]

      // Extract the values from each question object
      const { choice, correct_answer, question, parent_id, created_by, order, question_type, guid } = item

      // If choices exist (i.e., a multiple-choice question)
      if (choice) {
        return {
          guid: guid,
          id: index + 1,
          text: question,
          options: choice, // Use 'choice' for options
          correctanswer: correct_answer, // Use 'correct_answer' from the object
          order, // Optionally include order if needed
          created_by, // Include the created_by field
          parent_id, // Include the parent_id field
          question_type // Include the question_type field (e.g., "mcq", "mcma")
        }
      }

      // For other question types that may not have choices
      return {
        guid: guid,
        id: index + 1,
        text: question,
        correctanswer: correct_answer,
        parent_id,
        created_by,
        question_type
      }
    })

  console.log(questions, 'questioncheck')

  const questionSection = Object.keys(uploadData)
    .filter(key => uploadData[key].question !== null) // Filter out items with a null question
    .reduce((acc, key) => {
      const item = uploadData[key]
      const { choice, correct_answer, question, parent_id, created_by, order, type, guid } = item

      // If the question has a parent_id (child question)
      if (parent_id) {
        // Find the parent section using the key (which is the parent_id)
        const parentSection = acc.find(section => section.id === parent_id.toString()) // Convert parent_id to string to match keys

        if (parentSection) {
          // If parent exists, push the child question under it
          parentSection.questions.push({
            guid: guid,
            id: key, // Use the key as the ID of the child
            text: question,
            options: choice || [], // Use 'choice' for options if available
            correctanswer: correct_answer,
            order, // Optionally include order if needed
            created_by, // Include created_by field
            type // Include question_type field
          })
        }
      } else {
        // This is a standalone section (without parent_id)
        const newSection = {
          guid: guid,
          id: key, // Use the key as the unique id for the section
          text: question,
          type: type, // Explicitly set type to 'section' for sections
          options: choice || [], // Use 'choice' for options if available
          correctanswer: correct_answer,
          order,
          created_by,
          questions: [] // Initialize an empty array for child questions
        }

        // Add the section to the accumulator
        acc.push(newSection)
      }

      return acc
    }, [])

  console.log(questionSection, 'onequestiuon')

  // console.log(questionss, 'questionss')
  const [selectedQuestions, setSelectedQuestions] = useState([]) // Track selected checkboxes in QuestionCard

  // console.log(questions, 'questions')
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

  console.log(selectedQuestions, 'selectedquetsion')

  const handleSelectAllClick = event => {
    const isChecked = event.target.checked

    setSelectAll(isChecked) // Update "Select All" checkbox state

    if (isChecked) {
      // Select all questions
      const allQuestionIds = questions.map(q => q.id)

      setSelectedQuestions(allQuestionIds)
    } else {
      // Deselect all questions
      setSelectedQuestions([])
    }
  }

  const handleExpandAll = () => {
    setIsVisible(true) // Show the questions
    setExpandedPanels(questionss.map(q => q.id)) // Expand all panels
    setShowAnswers([]) // Reset showing answers (no answers shown)
    setIsExpandedAll(true) // Set the expanded state
  }

  const handleEditClick = question => {
    setEditingQuestion(question) // Set the selected question to be edited
  }

  // Function to reset editing state
  const resetEditing = () => {
    setEditingQuestion(null)
  }

  const width = '100%'
  const marginLeft = '0px'

  const manageCheckboxState = (sectionGuid, questionGuid, isChecked, isSectionAction) => {
    const updatedSelectedQuestions = new Set(selectedQuestions)

    if (isSectionAction) {
      // Section checkbox logic
      const section = questionSection.find(section => section.id === sectionGuid)

      if (section) {
        if (isChecked) {
          // Add all questions and the section itself
          section.questions.forEach(question => updatedSelectedQuestions.add(question.id))
          updatedSelectedQuestions.add(sectionGuid)
        } else {
          // Remove all questions and the section itself
          section.questions.forEach(question => updatedSelectedQuestions.delete(question.id))
          updatedSelectedQuestions.delete(sectionGuid)
        }
      }
    } else {
      // Question checkbox logic
      if (isChecked) {
        updatedSelectedQuestions.add(questionGuid)

        // Check if all questions in the parent section are selected
        const parentSection = questionSection.find(section =>
          section.questions.some(question => question.id === questionGuid)
        )

        if (
          parentSection &&
          parentSection.questions.every(question => updatedSelectedQuestions.has(question.id)) &&
          updatedSelectedQuestions.has(parentSection.id) // Ensure the section was not previously deselected
        ) {
          // Keep the section unchecked if it was manually deselected
          updatedSelectedQuestions.delete(parentSection.id)
        }
      } else {
        updatedSelectedQuestions.delete(questionGuid)

        // Ensure section is unchecked if any question is unchecked
        const parentSection = questionSection.find(section =>
          section.questions.some(question => question.id === questionGuid)
        )

        if (parentSection) {
          updatedSelectedQuestions.delete(parentSection.id)
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

  console.log(selectedQuestions, 'questionsection')

  console.log(questions, 'questionstesting')

  return (
    <>
      {/* <Tablefor /> */}
      {questions.length > 0 && !editingQuestion && (
        <QuestionCard
          check={'true'}
          onEditClick={handleEditClick}
          marginLeft={marginLeft}
          width={width}
          handleSelectAllClick={handleSelectAllClick}
          expandedPanels={expandedPanels}
          setExpandedPanels={setExpandedPanels}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          showAnswers={showAnswers}
          setShowAnswers={setShowAnswers}
          handleCollapseAll={handleCollapseAll}
          handleExpandAll={handleExpandAll}
          toggleAnswer={toggleAnswer}
          questions={questions}
          isExpandedAll={isExpandedAll}
          setIsExpandedAll={setIsExpandedAll}
          onQuestionSelect={handleCheckboxChange}
          manageCheckboxState={manageCheckboxState}
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
          handleExpandAllButton={handleExpandAllButton}
          handleEdit={handleEdit}
          edit={edit}
          setEdit={setEdit}
          selectAll={selectAll}
          formattedQuestions={formattedQuestions}
        />
      )}
      {editingQuestion && <EditImport question={editingQuestion} onSave={handleSave} />}

      <DialogBox
        open={addUserOpen}
        onClose={handleClose}
        onSubmit={onSubmit}
        description={isEditing ? currentDescription : ''} // Show current description when editing
        setDescription={isEditing ? setCurrentDescription : ''} // Update state accordingly
        handleSubmit={handleSubmit}
        handleReset={handleReset}
        edit={isEditing} // Pass edit state to the DialogBox

        // updateUserData={updateUserData}
        // addUserData={addUserData}
      />
    </>
  )
}

export default ImportView
