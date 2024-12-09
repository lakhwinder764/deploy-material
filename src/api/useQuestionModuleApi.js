'use client'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import axios from 'axios'

// import 'react-toastify/ReactToastify.min.css'
import { file } from 'valibot'

// import { USER_MODULE_ENDPOINTS } from '../Const/ApiEndpoints'
import { useTheme } from '@mui/material/styles'

import { alertMessages } from '@/Components/globals/AlertMessages'
import { ApiRequestHandle } from '@/libs/axios'

export default function useQuestionModuleApi() {
  const [data, setData] = useState([])
  const [file, setFiles] = useState([])
  const router = useRouter()
  const [loader, setLoader] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadData, setUploadData] = useState([]) // Fix typo here
  const [allquestionData, setallquestionData] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [trashData, setTrashData] = useState([])
  const [testData, setTestData] = useState([])
  const [viewTestData, setViewTestData] = useState([])
  const theme = useTheme

  const fetchData = async () => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_LMS_API_URL}tests/questions/eng2` // Construct the full URL

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`, // Add Authorization header
          Network: process.env.NEXT_PUBLIC_LMS_TOKEN, // Add Network header
          Accept: 'application/json' // Specify the accepted response format
        }
      })

      setLoader(false)
      setData(response.data?.payload) // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // console.log(data, 'check123')
  const uploadFiles = async files => {
    const formData = new FormData()

    files.forEach(file => {
      formData.append('userfile', file)

      // formData.appned('guid', 'SCI5')
      // console.log(file, 'eeeee')
    })
    setFiles(files)

    try {
      setUploading(true)

      const response = await axios.post(`${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/questions/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`,
          Network: process.env.NEXT_PUBLIC_LMS_TOKEN
        }
      })

      setUploadData(response?.data?.payload) // Make sure this works
      // console.log(response.data.payload.questions, 'uuu')
      // console.log(uploadData, 'uuu2')
      alertMessages(theme, 'success', response?.data?.message)
    } catch (error) {
      console.error('Error uploading files:', error)
      alert('Failed to upload files. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const fetchDataallquestion = async ({
    page,
    results_per_page,
    type,
    order,
    searchKeyword,
    category,
    selectedFilters,
    difficultSelect
  }) => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/questions/all` // Construct the full URL
      const formData = new FormData()

      // console.log(searchKeyword, 'searchinggg1234')
      console.log(category, 'checkcategory')

      if (searchKeyword) {
        formData.append('search', searchKeyword) // Add the search term to the formData
      }

      if (page) {
        formData.append('page', page) // Add pagination: current page
      }

      if (results_per_page) {
        formData.append('results_per_page', results_per_page) // Add pagination: results per page
      }

      if (category && category !== 'Categories') {
        formData.append('category', category)
      }

      if (selectedFilters) {
        formData.append('importance[]', selectedFilters)
      }

      if (difficultSelect) {
        formData.append('difficulty[]', difficultSelect)
      }

      // formData.append('category', selectedCategory)
      // formData.append('type', type)

      if (type) {
        formData.append('type', type)
      }

      if (order) {
        formData.append('order_by', order)
      }

      const response = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`, // Add Authorization header
          Network: process.env.NEXT_PUBLIC_LMS_TOKEN, // Add Network header
          Accept: 'application/json' // Specify the accepted response format
        }
      })

      setLoader(false)
      setallquestionData(response.data?.payload)
      console.log(response.data, 'responseallquestion')

      // console.log(uploadData, 'uuu2')
      // alertMessages(theme, 'success', response?.data?.message)
      // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const viewQuestion = guid => {
    // try {
    return axios.post(
      `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/questions/${guid}/view`,
      {},
      {
        Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
        Network: 'dev369',
        accept: 'application/json'
      }
    )

    // ?.then(res => {
    //   setTestData(res?.data?.payload)
    // })
    // .catch(error => {
    //   console.error('Error fetching data:', error)
    // })

    // } catch (error) {
    // console.error('Error fetching data:', error)
    // }
  }

  const updateQuestion = async (guid, questionData, uploadedFile) => {
    try {
      const formData = new FormData()

      formData.append('question', questionData.question)
      formData.append('type', questionData.type)
      formData.append('marks', questionData.marksPerQuestion)
      formData.append('neg_marks', questionData.negativeMarks)
      formData.append('time', questionData.timeAllowed)

      // formData.append('time_unit', questionData.timeUnit)

      // Add choices data
      questionData.choices.forEach((choice, index) => {
        formData.append(`choice[${index}]`, choice.choice)
        formData.append(`correct_answer[${index}]`, choice.is_correct_answer)
      })

      // Add file to the form data, if uploaded
      if (uploadedFile) {
        formData.append('userfile', uploadedFile)
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/questions/${guid}/edit`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`,
            Network: process.env.NEXT_PUBLIC_LMS_TOKEN
          }
        }
      )

      // console.log('Update response:', response.data)
      return response.data // Return response for further processing
    } catch (error) {
      console.error('Error updating question:', error)
      throw error // Optionally rethrow the error to handle it in the calling component
    }
  }

  const deleteSingleQuestion = guid => {
    try {
      axios
        .delete(`${process.env.NEXT_PUBLIC_LMS_API_URL}qb/questions/${guid}/delete`)
        .then(() => fetchDataallquestion())
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    // console.log(uploadData, 'updated uploadData')
  }, [uploadData, file])

  // Optional: Use useEffect to watch for changes in uploadData
  // useEffect(() => {
  //   if (uploadData.length > 0) {
  //     console.log('Updated UploadData:', uploadData)
  //   }
  //   uploadFiles()
  // }, [uploadData])

  // Optional: Use useEffect to watch for changes in uploadData
  // useEffect(() => {
  //   if (uploadData.length > 0) {
  //     console.log('Updated UploadData:', uploadData)
  //   }
  // }, [uploadData])
  // useEffect(() => {
  //   if (uploadData.length > 0) {
  //     console.log('UploadData:', uploadData)
  //   }
  // }, [uploadData])
  const trashDifficultyData = async ({
    page,
    results_per_page,

    // type,
    // order,
    searchKeyword,

    // category,
    selectedFilters

    // difficultSelect
  }) => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/questions/trashed` // Construct the full URL
      const formData = new FormData()

      // console.log(searchKeyword, 'searchinggg1234')

      if (searchKeyword) {
        formData.append('search', searchKeyword) // Add the search term to the formData
      }

      if (page) {
        formData.append('page', page) // Add pagination: current page
      }

      if (results_per_page) {
        formData.append('results_per_page', results_per_page) // Add pagination: results per page
      }

      // if (category && category !== 'Categories') {
      //   formData.append('category', category)
      // }

      // if (selectedFilters) {
      //   formData.append('importance[]', selectedFilters)
      // }

      // if (difficultSelect) {
      //   formData.append('difficulty[]', difficultSelect)
      // }

      // // formData.append('category', selectedCategory)
      // // formData.append('type', type)

      // if (type) {
      //   formData.append('type', type)
      // }

      // if (order) {
      //   formData.append('order_by', order)
      // }

      const response = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`, // Add Authorization header
          Network: process.env.NEXT_PUBLIC_LMS_TOKEN, // Add Network header
          Accept: 'application/json' // Specify the accepted response format
        }
      })

      setTrashData(response?.data?.payload)

      // console.log(uploadData, 'uuu2')
      // alertMessages(theme, 'success', response?.data?.message)
      // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const BulkDelete = async questionIds => {
    try {
      const formData = new FormData()

      // Append each question ID with the same key
      questionIds.forEach(id => {
        formData.append('guid[]', id)
      })

      // Send the DELETE request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/questions/trash`,
        {
          method: 'POST',
          body: formData
        },
        {
          Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
          Network: 'dev369',
          accept: 'application/json'
        }
      )

      // return response.data // Return the response data for further processing if needed
      alertMessages(theme, 'success', response?.data?.message)
      trashDifficultyData()
    } catch (error) {
      console.error('Error deleting questions in bulk:', error)
      throw error // Rethrow error to be handled in the component if necessary
    }
  }

  const resetQuestionData = Data => {
    const guids = Array.isArray(Data) ? Data : [Data]

    // Create the form data object
    const formData = new FormData()

    // Append each GUID
    guids.forEach(id => {
      formData.append('guid[]', id)
    })

    // Append additional data if needed
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    // Only append parent_guid if userData.category has a value
    // if (userData?.category) {
    //   formData.append('parent_guid', userData.category)
    // }

    try {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/questions/restore`,

          // userData
          formData,
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        .then(() => trashDifficultyData())

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const BulkDeleteQuestion = async questionIds => {
    try {
      const formData = new FormData()

      // Append each question ID with the same key
      questionIds.forEach(id => {
        formData.append('guid[]', id)
      })

      // Send the DELETE request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/questions/delete`,
        {
          method: 'POST',
          body: formData
        },
        {
          Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
          Network: 'dev369',
          accept: 'application/json'
        }
      )

      // return response.data // Return the response data for further processing if needed
      trashDifficultyData()
    } catch (error) {
      console.error('Error deleting questions in bulk:', error)
      throw error // Rethrow error to be handled in the component if necessary
    }
  }

  const fetchTestData = () => {
    try {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}test/all`,
          {},
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        ?.then(res => {
          setTestData(res?.data?.payload?.data)
        })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const addQuestionInTest = async (guid, questionIds) => {
    try {
      const formData = new FormData()

      questionIds.forEach(id => {
        formData.append('questions[]', id)
      })

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}test/${guid}/questions/add`,
        formData,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`,
            Network: process.env.NEXT_PUBLIC_LMS_TOKEN
          }
        }
      )

      // console.log('Update response:', response.data)
      alertMessages(theme, 'success', response?.data?.message)

      return response.data // Return response for further processing
    } catch (error) {
      console.error('Error updating question:', error)
      alertMessages(theme, 'error', response?.data?.message)
      throw error // Optionally rethrow the error to handle it in the calling component
    }
  }

  const addSection = userData => {
    //userData example
    const data = {
      title: userData?.description
    }

    const formData = new FormData()

    if (userData?.guid) {
      formData.append('test_guid', userData.guid)

      // formData.append('title', userData.title\)
    }

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    try {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/section/create`,

          // userData
          formData,
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        .then(res => {
          // fetchData()
          alertMessages(theme, 'success', res?.data?.message)
        })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const viewTest = guid => {
    try {
      console.log()
      axios
        .post(
          `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}test/${guid}/view`,
          {},
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        ?.then(res => {
          console.log(res, 'payloadData')
          setViewTestData(res?.data?.payload)
        })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const addSectionInTest = async (guid, questionIds) => {
    try {
      const formData = new FormData()

      questionIds.forEach(id => {
        formData.append('questions[]', id)
      })

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/section/${guid}/add_to_questions`,
        formData,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`,
            Network: process.env.NEXT_PUBLIC_LMS_TOKEN
          }
        }
      )

      // console.log('Update response:', response.data)
      alertMessages(theme, 'success', response?.data?.message)

      return response.data // Return response for further processing
    } catch (error) {
      console.error('Error updating question:', error)
      alertMessages(theme, 'error', response?.data?.message)
      throw error // Optionally rethrow the error to handle it in the calling component
    }
  }

  const updateSection = async (userData, guid) => {
    console.log(userData, 'checkingimp')

    try {
      const data = {
        question: userData,
        'choice[]': [],
        type: 'section'
      }

      const formData = new FormData()

      if (typeof data === 'object') {
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value)
        })
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/questions/${guid}/edit`,
        formData,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`,
            Network: process.env.NEXT_PUBLIC_LMS_TOKEN
          }
        }
      )

      // console.log('Update response:', response.data)
      return response.data // Return response for further processing
    } catch (error) {
      console.error('Error updating question:', error)
      throw error // Optionally rethrow the error to handle it in the calling component
    }
  }

  return {
    addSectionInTest,
    updateSection,
    viewTest,
    viewTestData,
    testData,
    fetchTestData,
    data,
    setData,
    fetchData,
    loader,
    setLoader,
    uploadFiles,
    uploading,
    uploadData,
    setUploadData,
    trashDifficultyData,
    trashData,
    setTrashData,
    file,
    setFiles,
    fetchDataallquestion,
    allquestionData,
    setallquestionData,
    searchKeyword,
    setSearchKeyword,
    viewQuestion,
    BulkDelete,
    updateQuestion,
    deleteSingleQuestion,
    trashDifficultyData,
    resetQuestionData,
    BulkDeleteQuestion,
    addQuestionInTest,
    addSection
  }
}
