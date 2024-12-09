'use client'
import { useEffect, useState } from 'react'

import axios from 'axios'
import { useTheme } from '@mui/material/styles'

import { QUESTION_MODULE_ENDPOINTS } from '@/Const/test/ApiEndpoints'
import { alertMessages } from '@/Components/globals/AlertMessages'

export default function useQuestionApi() {
  const [data, setData] = useState([])
  const [QId, setQId] = useState(null)
  const [questionTypeFixed, setQuestionTypeFized] = useState(false)
  const theme = useTheme()

  console.info(process.env.NEXT_PUBLIC_DOCS_URL)

  const createQuestion = data => {
    //userData example
    // const data = {
    //   title: userData?.title,
    //   type: userData?.type,
    //   details: userData?.description
    // }
    console.log(data, 'checkData')
    const formData = new FormData()

    if (data.sectionguid) {
      formData.append('section_guid', data.sectionguid)
    }

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'choices') {
          value.map((choice, i) => {
            if (choice.choice) {
              formData.append(`choice[${i}]`, choice.choice)
              formData.append(`correct_answer[${i}]`, choice.correct_answer ? '1' : '0')
              formData.append(`order[${i}]`, i)
            }
          })
        } else {
          formData.append(key, value)
        }
      })
    }

    try {
      axios
        .post(`${process.env.NEXT_PUBLIC_LMS_API_URL_V2}/${data?.guid}`, formData, {
          Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
          Network: 'dev369',
          accept: 'application/json'
        })
        .then(res => {
          setQuestionTypeFized(true)
          alertMessages(theme, 'success', res?.data?.message)
          setQId(res?.data?.payload?.question_guid)
        })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const editQuestion = data => {
    //userData example
    // const data = {
    //   title: userData?.title,
    //   type: userData?.type,
    //   details: userData?.description
    // }

    const formData = new FormData()

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'choices') {
          value.map((choice, i) => {
            if (choice.choice) {
              formData.append(`choice[${i}]`, choice.choice)
              formData.append(`correct_answer[${i}]`, choice.correct_answer ? '1' : '0')
              formData.append(`order[${i}]`, i)
            }
          })
        } else {
          formData.append(key, value)
        }
      })
    }

    try {
      axios
        .post(`${QUESTION_MODULE_ENDPOINTS}/${data?.guid}/${data?.qId}`, formData, {
          Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
          Network: 'dev369',
          accept: 'application/json'
        })
        .then(res => alertMessages(theme, 'info', res?.data?.message))

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return {
    editQuestion,
    createQuestion,
    QId,
    questionTypeFixed
  }
}
