'use client'
import { useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import { useTheme } from '@mui/material/styles'

import axios from 'axios'

import { alertMessages } from '@/Components/globals/AlertMessages'

export default function useEnrollmentsApi() {
  const theme = useTheme()
  const [unenrolledUsersData, setUnenrolledUsersData] = useState([])
  const [usersData, setUsersData] = useState(null)

  const [unenrolledUsersMetaData, setUnenrolledUsersMetaData] = useState([])
  const [enrolledUsersData, setEnrolledUsersData] = useState([])
  const [enrolledUsersMetaData, setEnrolledUsersMetaData] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [usersSearchKeyword, setUsersSearchKeyword] = useState('')

  const enrollUsersInTest = (guid, data) => {
    const formData = new FormData()

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'users') {
          value.map((item, i) => {
            formData.append(`users[${i}]`, item)
          })
        } else {
          if (key === 'extra_time' || key === 'screen_reader') {
            formData.append(`options[${key}]`, value)
          } else {
            formData.append(key, value)
          }
        }
      })
    }

    try {
      return axios
        .post(`${process.env.NEXT_PUBLIC_LOCAL_BASEPATH_V2}test/${guid}/enrolments/enrol`, formData, {
          Authorization: 'Bearer 2a59a7e2800e94ae59a44b4084393b5b5df9d6a0ccfab01bd17ba5f9dc58f262',
          Network: 'dev369',
          accept: 'application/json'
        })
        .then(res => {
          alertMessages(theme, 'success', res?.data?.message)
          getUnenrollUsersData(guid)
        })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const unenrollUsersInTest = (guid, data) => {
    const formData = new FormData()

    if (Array.isArray(data)) {
      data.map((item, i) => {
        formData.append(`users[${i}]`, item)
      })
    }

    try {
      return axios
        .post(`${process.env.NEXT_PUBLIC_LOCAL_BASEPATH_V2}test/${guid}/enrolments/unenrol`, formData, {
          Authorization: 'Bearer 2a59a7e2800e94ae59a44b4084393b5b5df9d6a0ccfab01bd17ba5f9dc58f262',
          Network: 'dev369',
          accept: 'application/json'
        })
        .then(res => {
          alertMessages(theme, 'success', res?.data?.message)
          getEnrollUsersData(guid)
        })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const editUsersEnrollmentInTest = (guid, userIds, data) => {
    const formData = new FormData()

    if (Array.isArray(userIds)) {
      userIds.map((item, i) => {
        formData.append(`users[${i}]`, item)
      })
    }

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'extra_time' || key === 'screen_reader') {
        formData.append(`options[${key}]`, value)
      } else {
        formData.append(key, value)
      }
    })

    try {
      return axios
        .post(`${process.env.NEXT_PUBLIC_LOCAL_BASEPATH_V2}test/${guid}/enrolments/enrol`, formData, {
          Authorization: 'Bearer 2a59a7e2800e94ae59a44b4084393b5b5df9d6a0ccfab01bd17ba5f9dc58f262',
          Network: 'dev369',
          accept: 'application/json'
        })
        .then(res => {
          alertMessages(theme, 'success', res?.data?.message)
          getEnrollUsersData(guid)
        })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getUnenrollUsersData = (guid, page, results_per_page, searchKeyword, data) => {
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

    if (Array?.isArray(data)) {
      data?.map((item, i) => {
        formData.append(`batch[${i}]`, item)
      })
    }

    try {
      return axios
        .post(`${process.env.NEXT_PUBLIC_LOCAL_BASEPATH_V2}test/${guid}/enrolments/notenroled`, formData, {
          Authorization: 'Bearer 2a59a7e2800e94ae59a44b4084393b5b5df9d6a0ccfab01bd17ba5f9dc58f262',
          Network: 'dev369',
          accept: 'application/json'
        })
        .then(res => {
          setUnenrolledUsersData(res?.data?.payload?.data)
          setUnenrolledUsersMetaData(res?.data?.payload?.meta)
        })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getUsersData = (guid, userId) => {
    const formData = new FormData()

    try {
      return axios
        .post(`${process.env.NEXT_PUBLIC_LOCAL_BASEPATH_V2}test/${guid}/enrolments/${userId}/view`, formData, {
          Authorization: 'Bearer 2a59a7e2800e94ae59a44b4084393b5b5df9d6a0ccfab01bd17ba5f9dc58f262',
          Network: 'dev369',
          accept: 'application/json'
        })
        .then(res => {
          setUsersData(res?.data?.payload?.users?.[0]?.enrolment)
        })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getEnrollUsersData = (guid, page, results_per_page, searchKeyword, data) => {
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

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    try {
      return axios
        .post(`${process.env.NEXT_PUBLIC_LOCAL_BASEPATH_V2}test/${guid}/enrolments/enroled`, formData, {
          Authorization: 'Bearer 2a59a7e2800e94ae59a44b4084393b5b5df9d6a0ccfab01bd17ba5f9dc58f262',
          Network: 'dev369',
          accept: 'application/json'
        })
        .then(res => {
          setEnrolledUsersData(res?.data?.payload?.data)
          setEnrolledUsersMetaData(res?.data?.payload?.meta)
        })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return {
    enrollUsersInTest,
    unenrollUsersInTest,
    getUnenrollUsersData,
    getEnrollUsersData,
    unenrolledUsersData,
    unenrolledUsersMetaData,
    enrolledUsersMetaData,
    enrolledUsersData,
    editUsersEnrollmentInTest,
    getUsersData,
    usersData,
    searchKeyword,
    setSearchKeyword,
    usersSearchKeyword,
    setUsersSearchKeyword
  }
}
