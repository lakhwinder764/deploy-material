import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { USER_MODULE_ENDPOINTS } from '@/Const/test/ApiEndpoints'

export default function useTakeTestApi() {
  const [questions, setQuestions] = useState([]) // Updated to store questions from the payload
  const [loading, setLoading] = useState(true) // Track loading state
  const [error, setError] = useState(null) // Track errors

  // Fetch all test data by GUID
  const fetchData = guid => {
    if (!guid) return
    setLoading(true)
    try {
      axios
        .get(`${USER_MODULE_ENDPOINTS}/questions/${guid}`)
        .then(res => {
          console.log('API Response:', res) // Log the full response for debugging

          if (res?.data?.payload && Array.isArray(res.data.payload)) {
            setQuestions(res.data.payload) // Set the questions from the payload
          } else {
            setError('No questions found in payload')
          }

          setLoading(false)
        })
        .catch(error => {
          setError('Error fetching data: ' + error.message)
          setLoading(false)
        })
    } catch (error) {
      setError('Error: ' + error.message)
      setLoading(false)
    }
  }

  return {
    questions,
    loading,
    error,
    fetchData
  }
}
