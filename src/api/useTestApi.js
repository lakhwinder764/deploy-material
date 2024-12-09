'use client'
import { useEffect, useState } from 'react'

import axios from 'axios'
import { useTheme } from '@mui/material/styles'

import { toast } from 'react-toastify'
import 'react-toastify/ReactToastify.min.css'
import { IconButton, Typography } from '@mui/material'

import moment from 'moment'

import { USER_MODULE_ENDPOINTS } from '@/Const/test/ApiEndpoints'
import { alertMessages } from '@/components/globals/AlertMessages'

export default function useTestApi() {
  const [data, setData] = useState([])
  const [submissionsData, setSubmissionsData] = useState([])
  const [categories, setCategories] = useState([])
  const [testData, setTestData] = useState({})
  const [viewTestData, setViewTestData] = useState([])
  const [testQuestionData, setTestQuestionData] = useState([])
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  console.info(process.env.NEXT_PUBLIC_DOCS_URL)

  const fetchData = () => {
    try {
      axios
        .post(
          `${NEXT_PUBLIC_LOCAL_BASEPATH_V2}/test/all`,
          {},
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        ?.then(res => {
          setData(res?.data?.payload?.data)
        })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getCategories = () => {
    try {
      axios
        .post(
          `${USER_MODULE_ENDPOINTS}/categories`,
          {},
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        ?.then(res => {
          setCategories(res?.data?.payload)
        })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const viewTest = guid => {
    try {
      console.log()
      axios
        .post(
          `${NEXT_PUBLIC_LOCAL_BASEPATH_V2}/${guid}/view`,
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

  // ?.then(res => {
  //   setTestData(res?.data?.payload)
  // })
  // .catch(error => {
  //   console.error('Error fetching data:', error)
  // })

  // } catch (error) {
  // console.error('Error fetching data:', error)
  // }

  useEffect(() => {
    fetchData()
  }, [])

  const addTestData = userData => {
    //userData example
    const data = {
      title: userData?.title,
      details: userData?.description,
      category: userData?.category
    }

    const formData = new FormData()

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    try {
      axios
        .post(
          `${USER_MODULE_ENDPOINTS}/add`,

          // userData
          formData,
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        .then(res => {
          fetchData()
        })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const testSettings = (guid, settingsData) => {
    //userData example
    const data = {
      // marks_per_question: 1,
      // neg_marks_per_question: 0,
      // pass_marks: 30,
      // pass_marks_unit: 'percentage',
      // time_per_question: 0,
      // test_duration: 0,
      // show_timer: false,
      // show_result: 'immediately',
      // on_date: '01-12-2023 15:25:00',
      // num_attempts: 0,
      // show_question_hint_on_test_page: 0,
      // randomize_questions_within_test: 1,
      // randomize_answer_choices: 1,
      // randomize_questions_within_comprehension: 0,
      // allow_bookmark_questions: 1,
      // show_bookmark_question_correct_answer: 0
      ...settingsData

      //randomize_fixed_answer_choices:0
    }

    const formData = new FormData()

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    try {
      axios
        .post(
          `${USER_MODULE_ENDPOINTS}/settings/${guid}`,

          // userData
          formData,
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        .then(res => {
          alertMessages(theme, 'success', res?.data?.message)
          fetchData()
        })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const testSubmissions = (data, sessionId) => {
    //userData example
    const datas = {
      guid: data?.guid,
      attempted_start_date: data?.startDate ? moment(data?.startDate).format('DD-MM-yyyy') : null,
      attempted_end_date: data?.endDate ? moment(data?.endDate).format('DD-MM-yyyy') : null,
      submission_start_date: data?.submissionStartDate ? moment(data?.submissionStartDate).format('DD-MM-yyyy') : null,
      submission_end_date: data?.submissionEndDate ? moment(data?.submissionEndDate).format('DD-MM-yyyy') : null

      // session_id: sessionId
    }

    const formData = new FormData()

    if (typeof datas === 'object') {
      Object.entries(datas).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    try {
      axios
        .post(
          `${USER_MODULE_ENDPOINTS}/submissions`,

          // userData
          formData,
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        .then(res => {
          setSubmissionsData(res?.data?.payload)
          alertMessages(theme, 'success', res?.data?.message)
        })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const updateTestData = (guId, data) => {
    const formData = new FormData()

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    try {
      axios.post(`${USER_MODULE_ENDPOINTS}/add/${guId}`, formData).then(res => {})

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteTestData = userId => {
    try {
      return axios.delete(`${USER_MODULE_ENDPOINTS}/delete/${userId}`).then(() => fetchData())
    } catch (error) {}
  }

  const handleTestPublish = (guid, publishKey) => {
    //userData example
    const formData = new FormData()

    formData.append('status', publishKey)

    try {
      axios
        .post(
          `${USER_MODULE_ENDPOINTS}/status/${guid}`,

          // userData
          formData,
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        .then(res => {
          alertMessages(theme, 'success', res?.data?.message)
          fetchData()
        })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getTestQuestion = async (guid, search) => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}test/${guid}/questions/all` // Construct the full URL
      const formData = new FormData()

      if (search) {
        formData.append('search', search)
      }

      await axios
        .post(endpoint, formData, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`, // Add Authorization header
            Network: process.env.NEXT_PUBLIC_LMS_TOKEN, // Add Network header
            Accept: 'application/json' // Specify the accepted response format
          }
        })
        ?.then(res => {
          console.log(res, 'payloadData')
          setTestQuestionData(res?.data?.payload?.data)
          setLoading(false)
        })
        ?.catch(err => {
          console.log(err, 'message')
          setError(true)
          setLoading(false)
        })
    } catch (error) {
      console.error('Error 12345', error)
      setLoading(false)
    }
  }

  const BulkRemoveQuestion = async (questionIds, guid) => {
    try {
      const formData = new FormData()

      // Append each question ID with the same key
      questionIds.forEach(id => {
        formData.append('questions[]', id)
      })

      // Send the DELETE request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}test/${guid}/questions/remove`,
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
    } catch (error) {
      console.error('Error deleting questions in bulk:', error)
      throw error // Rethrow error to be handled in the component if necessary
    }
  }

  return {
    BulkRemoveQuestion,
    getTestQuestion,
    loading,
    setLoading,
    error,
    testQuestionData,
    deleteTestData,
    updateTestData,
    addTestData,
    data,
    setData,
    testData,
    viewTest,
    getCategories,
    categories,
    handleTestPublish,
    testSettings,
    testSubmissions,
    submissionsData,
    viewTestData,
    setViewTestData
  }
}
