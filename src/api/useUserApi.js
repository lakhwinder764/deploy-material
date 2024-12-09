'use client'
import { useEffect, useState } from 'react'

import axios from 'axios'

export default function useUserApi() {
  const [data, setData] = useState([])
  const [loader, setLoader] = useState(true)

  const fetchData = async () => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_LMS_API_URL}users/list`

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`,
          Accept: 'application/json',
          Network: process.env.NEXT_PUBLIC_LMS_TOKEN
        }
      })

      setLoader(false)
      setData(response.data?.payload?.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchUserById = async userId => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_LMS_API_URL}users/view/${userId}`

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`,
          Accept: 'application/json'
        }
      })

      return response.data?.payload // Return the user data
    } catch (error) {
      console.error(`Error fetching user with ID ${userId}:`, error)

      return null
    }
  }

  const updateUser = async (userId, updatedData) => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_LMS_API_URL}users/update/${userId}`

      console.log('Update User Endpoint:', endpoint)

      const response = await axios.post(endpoint, updatedData, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LMS_TOKEN}`,
          Accept: 'application/json'
        }
      })

      return response.data // Return the response after update
    } catch (error) {
      console.error('Error updating user data:', error.response?.data || error)

      return null
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    data,
    setData,
    loader,
    setLoader,
    fetchUserById,
    updateUser
  }
}
