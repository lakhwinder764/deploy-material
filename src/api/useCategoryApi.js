'use client'
import { useEffect, useState } from 'react'

import axios from 'axios'
import { useTheme } from '@mui/material/styles'

import { toast } from 'react-toastify'
import { IconButton, Typography } from '@mui/material'

// import {
//   CATEGORY_DATA,
//   CATEGORY_MODULE_ENDPOINTS,
//   CATEGORY_MODULE_ENDPOINTS_CHILDREN,
//   CATEGORY_DATA_V2
// } from '@/Const/ApiEndpoints'

import { alertMessages } from '@/components/globals/AlertMessages'
import {
  CATEGORY_DATA_V2,
  CATEGORY_DATA,
  CATEGORY_MODULE_ENDPOINTS_CHILDREN,
  CATEGORY_MODULE_ENDPOINTS
} from '@/Const/test/ApiEndpoints'

export default function useCategoryApi() {
  const [data, setData] = useState([])
  const theme = useTheme()
  const [trashData, setTrashData] = useState([])
  console.info(process.env.NEXT_PUBLIC_DOCS_URL)

  const fetchData = () => {
    try {
      axios
        .post(
          `${CATEGORY_DATA_V2}/all`,
          {},
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        ?.then(res => {
          //   setData(res?.payload?.data)
          setData(res?.data?.payload?.data)
        })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  const addCategoryData = userData => {
    // console.log(userData, 'categoryapi')

    // Create the data object
    const data = {
      title: userData?.title,
      description: userData?.description
      // parent: userData?.parent
    }

    const formData = new FormData()

    // Append all fields to formData
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    // Only append parent_guid if userData.category has a value
    if (userData?.parent) {
      formData.append('parent', userData.parent)
    }

    try {
      axios
        .post(
          `${CATEGORY_DATA_V2}/create`,

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
  const viewCategory = guid => {
    // try {
    return axios.post(
      `${CATEGORY_DATA_V2}/${guid}/view`,
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
  const updateCategoryData = (guId, data) => {
    const formData = new FormData()

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    try {
      axios.post(`${CATEGORY_DATA}/${guId}/edit`, formData).then(res => {
        alertMessages(theme, 'success', res?.data?.message)
      })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const trashCategoryData = Data => {
    // console.log(data, 'pptesting')
    // Create the data object
    const guids = Array.isArray(Data) ? Data : [Data]

    // Create the form data object
    const formData = new FormData()

    // Append each GUID
    guids.forEach(id => {
      console.log(id, 'idss')
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
          `${CATEGORY_DATA_V2}/trash`,

          // userData
          formData,
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        .then(() => fetchData())

      return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  const trashDifficultyData = () => {
    try {
      axios
        .post(
          `${CATEGORY_DATA_V2}/trashed`,
          {},
          {
            Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
            Network: 'dev369',
            accept: 'application/json'
          }
        )
        ?.then(res => {
          //   setData(res?.payload?.data)
          setTrashData(res?.data?.payload.data)
        })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  const resetCategoryData = Data => {
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
          `${CATEGORY_DATA_V2}/restore`,

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
  return {
    data,
    setData,
    fetchData,
    addCategoryData,
    viewCategory,
    updateCategoryData,
    trashCategoryData,
    trashDifficultyData,
    trashData,
    setTrashData,
    resetCategoryData
  }
}
