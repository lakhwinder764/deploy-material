'use client'
import { useEffect, useState } from 'react'

import axios from 'axios'
import { useTheme } from '@mui/material/styles'

import { toast } from 'react-toastify'
import { IconButton, Typography } from '@mui/material'

import { CATEGORY_DATA, CATEGORY_MODULE_ENDPOINTS, CATEGORY_MODULE_ENDPOINTS_CHILDREN } from '@/Const/test/ApiEndpoints'

import { alertMessages } from '@/components/globals/AlertMessages'

export default function useDifficultiesApi() {
  const [data, setData] = useState([])
  const [trashedData, setTrashedData] = useState([])
  const [diffId, setDiffId] = useState(null)
  const [metaData, setMetaData] = useState([])

  //trash states
  const [trashMetaData, setTrashMetaData] = useState([])
  const [difficultData, setDifficultData] = useState([])

  //
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchTrashKeyword, setSearchTrashKeyword] = useState('')
  const theme = useTheme()

  console.info(process.env.NEXT_PUBLIC_DOCS_URL)

  const fetchData = (page = '', results_per_page = '', searchKeyword = '') => {
    const formData = new FormData()

    if (page) {
      formData.append('page', page) // Add pagination: current page
    }

    if (results_per_page) {
      formData.append('results_per_page', results_per_page)
    }

    if (searchKeyword) {
      formData.append('search', searchKeyword) // Add the search term to the formData
    }

    try {
      axios
        .post(`${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/difficulty/all`, formData, {
          Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
          Network: 'dev369',
          accept: 'application/json'
        })
        ?.then(res => {
          setData(res?.data?.payload?.data)
          setDifficultData(res?.data?.payload?.data)
          setMetaData(res?.data?.payload?.meta)
        })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const addDifficultyData = userData => {
    console.log(userData, 'checking123')

    // Create the data object
    const data = {
      title: userData?.title,
      description: userData?.description
    }

    const formData = new FormData()

    // Append all fields to formData
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    // Only append parent_guid if userData.category has a value
    if (userData?.category) {
      formData.append('parent_guid', userData.category)
    }

    try {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/difficulty/create`,

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

  const addDifficultyLevelToQuestion = (guid, QId) => {
    const formData = new FormData()

    QId.map((qId, i) => {
      formData.append(`questions[${i}]`, qId)
    })

    try {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/difficulty/${guid}/add_to_questions`,

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
        })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const removeDifficultyLevelToQuestion = (guid, QId) => {
    const formData = new FormData()

    QId.map((qId, i) => {
      formData.append(`questions[${i}]`, qId)
    })

    try {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/difficulty/${guid}/remove_from_questions`,

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
        })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const viewDifficulty = guid => {
    // try {
    return axios.post(
      `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/difficulty/${guid}/view`,
      {},
      {
        Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
        Network: 'dev369',
        accept: 'application/json'
      }
    )
  }

  const updateDifficulty = (guId, data) => {
    const formData = new FormData()

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    try {
      axios.post(`${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/difficulty/${guId}/edit`, formData).then(res => {
        alertMessages(theme, 'success', res?.data?.message)
      })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const trashDifficulties = guId => {
    console.info(guId)
    const formData = new FormData()

    guId.map((choice, i) => {
      formData.append(`guid[${i}]`, choice)
    })

    try {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/difficulty/trash`,

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
          getTrashedDifficultiesLevel()
          fetchData()
        })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteDifficulties = guId => {
    const formData = new FormData()

    guId.map((choice, i) => {
      formData.append(`guid[${i}]`, choice)
    })

    try {
      axios
        .post(`${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/difficulty/delete`, formData, {
          Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
          Network: 'dev369',
          accept: 'application/json'
        })
        .then(res => {
          alertMessages(theme, 'success', res?.data?.message)
          getTrashedDifficultiesLevel()
          fetchData()
        })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const restoreTrashDifficulties = guId => {
    const formData = new FormData()

    guId.map((choice, i) => {
      formData.append(`guid[${i}]`, choice)
    })

    try {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/difficulty/restore`,

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
          getTrashedDifficultiesLevel()
          fetchData()
        })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getTrashedDifficultiesLevel = (page = '', results_per_page = '', searchKeyword = '') => {
    const formData = new FormData()

    console.info(searchKeyword)

    if (page) {
      formData.append('page', page) // Add pagination: current page
    }

    if (results_per_page) {
      formData.append('results_per_page', results_per_page)
    }

    if (searchKeyword) {
      formData.append('search', searchKeyword) // Add the search term to the formData
    }

    try {
      axios
        .post(`${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/difficulty/trashed`, formData, {
          Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
          Network: 'dev369',
          accept: 'application/json'
        })
        .then(res => {
          setTrashedData(res?.data?.payload?.data)
          setTrashMetaData(res?.data?.payload?.meta)
        })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    // fetchData()
    // getTrashedDifficultiesLevel()
  }, [])

  return {
    data,
    trashedData,
    difficultData,
    setDifficultData,
    setData,
    fetchData,
    addDifficultyData,
    viewDifficulty,
    updateDifficulty,
    trashDifficulties,
    deleteDifficulties,
    restoreTrashDifficulties,
    getTrashedDifficultiesLevel,
    addDifficultyLevelToQuestion,
    removeDifficultyLevelToQuestion,
    searchKeyword,
    setSearchKeyword,
    searchTrashKeyword,
    setSearchTrashKeyword,
    fetchData,
    metaData,
    trashMetaData
  }
}
