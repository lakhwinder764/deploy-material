'use client'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import axios from 'axios'
import { useTheme } from '@mui/material/styles'

import { alertMessages } from '@/components/globals/AlertMessages'

export default function useQuestionApi() {
  const [data, setData] = useState([])
  const [QId, setQId] = useState(null)
  const [questionTypeFixed, setQuestionTypeFixed] = useState(false)
  const theme = useTheme()

  console.info(process.env.NEXT_PUBLIC_DOCS_URL)
  const router = useRouter()

  const createQuestion = (data, mode) => {
    const formData = new FormData()

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'choices') {
          value.map((choice, i) => {
            console.info(choice?.feedback?.length)

            if (choice.choice) {
              formData.append(`choice[${i}]`, choice.choice)
              formData.append(`correct_answer[${i}]`, choice.correct_answer ? '1' : '0')

              // formData.append(`order[${i}]`, i)
            }

            if (choice.feedback) {
              formData.append(`choice_feedback[${i}]`, choice?.feedback)
            }
          })
        }

        if (key === 'userfile') {
          data?.userfile?.forEach((file, i) => {
            formData.append(`question_attachment[${i}]`, file)
          })
        } else {
          formData.append(key, value)
        }
      })
    }

    try {
      axios

        // .post(`${process.env.NEXT_PUBLIC_BASEPATH}tests/create_question`,formData,{
        .post(`${process.env.NEXT_PUBLIC_LMS_API_URL_V2}qb/questions/create`, formData, {
          Authorization: 'Bearer 2a59a7e2800e94ae59a44b4084393b5b5df9d6a0ccfab01bd17ba5f9dc58f262',
          Network: 'dev369',
          accept: 'application/json'
        })
        .then(res => {
          if (!mode && res?.success) {
            setQuestionTypeFixed(true)
          } else {
            setQuestionTypeFixed(false)
          }

          alertMessages(theme, 'success', res?.data?.message)
          setQId(res?.data?.payload?.guid)

          // setTimeout(() => router.push('/question/allquestion'), [2000])
        })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const editQuestion = (data, mode) => {
    console.info(data)
    const formData = new FormData()

    formData.append(`category`, 'SCI38')

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'choices') {
          value.map((choice, i) => {
            if (choice.choice) {
              formData.append(`choice[${i}]`, choice.choice)
              formData.append(`correct_answer[${i}]`, choice.correct_answer ? '1' : '0')
              formData.append(`feedback[${i}]`, choice.feedback)
              formData.append(`order[${i}]`, i)
            }
          })
        }

        if (key === 'userfile') {
          data?.userfile?.length >= 1 &&
            data?.userfile?.forEach(file => {
              formData.append('userfile', file)
              console.log(file, 'eeeee')
            })
        } else {
          if (value !== undefined) {
            formData.append(key, value)
          }
        }
      })
    }

    try {
      axios
        .post(`${process.env.NEXT_PUBLIC_BASEPATH_V2}qb/questions/${data?.guid}/edit`, formData, {
          Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
          Network: 'dev369',
          accept: 'application/json'
        })
        .then(res => {
          if (!mode && res?.success) {
            setQuestionTypeFixed(true)
          } else {
            setQuestionTypeFixed(false)
          }

          alertMessages(theme, 'info', res?.data?.message)
        })

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return {
    editQuestion,
    createQuestion,
    QId,
    questionTypeFixed,
    setQuestionTypeFixed
  }
}
