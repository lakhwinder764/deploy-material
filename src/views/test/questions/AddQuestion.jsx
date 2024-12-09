'use client'

// React Imports
import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'
// eslint-disable-next-line import/no-duplicates
import { useSearchParams } from 'next/navigation'

import { useForm, Controller } from 'react-hook-form'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'

import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Checkbox,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material'

import { toast } from 'react-toastify'

import { useRole } from '@floating-ui/react'

import { Text } from 'recharts'

import TextEditor from '@/components/Common/TextEditor'
import QuestionTypeAndTemplate from './QuestionTypeAndTemplate'
import QuestionFeedback from './QuestionFeedback'
import SaveQuestion from './SaveQuestion'
import McqQuestion from './McqQuestion'
import QuestionUpload from './QuestionUpload'
import TrueFalseQuestion from './TrueFalseQuestion'
import EssaysQuestion from './EssaysQuestion'
import QuestionSettings from './QuestionSettings'
import FilterHeader from '@/components/globals/FilterHeader'
import { alertMessages } from '@/components/globals/AlertMessages'
import useQuestionApi from '@/api/test/useQuestionApi'
import useQuestionModuleApi from '@/api/useQuestionModuleApi'

// import { useSearchParams } from 'next/navigation'
const AddQuestion = () => {
  const searchParams = useSearchParams()
  const guid = searchParams.get('guid')
  const section_guid = searchParams.get('sectionguid')
  const test_guid = searchParams.get('testguid')
  const { createQuestion, editQuestion, QId, questionTypeFixed } = useQuestionApi()
  const [openQuestionFeedback, setOpenQuestionFeedback] = useState(false)
  const [questionType, setQuestionType] = useState('mcmc')
  const [saveQuestion, setSaveQuestion] = useState(false)
  const [editQuestions, setEditQuestions] = useState(false)
  const [template, setTemplate] = useState('template_1')
  const [unit, setUnit] = useState('second') // Default unit
  const [files, setFiles] = useState([])
  const { addSectionInTest } = useQuestionModuleApi
  const tguid = searchParams.get('tguid')

  console.info(files)
  const theme = useTheme()

  const [mcqFields, setMcqFields] = useState([
    { id: 1, choice: '', correct_answer: false, feedback: '' },
    { id: 2, choice: '', correct_answer: false, feedback: '' }
  ])

  const [choiceFields, setChoiceFields] = useState([
    { id: 1, choice: 'true', correct_answer: false },
    { id: 2, choice: 'false', correct_answer: false }
  ])

  const router = useRouter()

  // const search = useSearchParams()
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
    watch,
    register,
    setValue
  } = useForm({
    defaultValues: {
      type: 'mcmc',
      template: 'template_1',
      marks: '1',
      neg_marks: '0',
      timeValue: 'second',
      time: '',
      difficulty: '',
      importance: '',
      randomize_questions: false
    }
  })

  const fieldValues = watch()
  const selectedValue = watch('type')
  const [nquestion, setNQuestion] = useState('')

  const [feedback, setFeedback] = useState('')
  const [answerFeedback, setAnswerFeedback] = useState('')
  const [saveAsNew, setSaveAsNew] = useState(false)

  // console.info(selectedValue)
  console.log(selectedValue, 'selectedValue')
  console.log(fieldValues?.type, 'field value')

  const handleUnitChange = event => {
    setUnit(event.target.value)
  }

  const handleFormSubmit = async data => {
    if (selectedValue === 'mcmc') {
      const hasCorrectAnswer = mcqFields?.some(choice => choice?.correct_answer)

      if (!hasCorrectAnswer) {
        alertMessages(theme, 'error', 'Choose at least one option')

        return
      }
    }

    // setMcqFields(
    //   mcqFields.map(choice => ({
    //     ...choice,
    //     correct_answer: choice.correct_answer ? 1 : 0
    //   }))
    // )

    // data.choices = data.choices.map(choice => ({
    //   ...choice,
    //   correct_answer: choice.correct_answer ? 1 : 0
    // }));

    try {
      let response

      // if (editQuestions) {
      if (QId && editQuestions) {
        response = await editQuestion(
          {
            guid,
            qId: QId,
            ...data,
            ...(selectedValue === 'essays' && {
              answer: fieldValues?.answer
            }),
            ...((selectedValue === 'mcmc' || selectedValue === 'tf') && {
              choices: selectedValue === 'mcmc' ? mcqFields : choiceFields
            }),
            question: fieldValues?.question,
            answer_feedback: fieldValues?.answer_feedback,
            userfile: files
          },
          saveAsNew ? true : false
        )
      } else {
        response = await createQuestion(
          {
            // guid,
            ...data,
            ...(selectedValue === 'essays' && {
              answer: fieldValues?.answer
            }),
            ...((selectedValue === 'mcmc' || selectedValue === 'tf') && {
              choices: selectedValue === 'mcmc' ? mcqFields : choiceFields
            }),
            question: fieldValues?.question,
            answer_feedback: fieldValues?.answer_feedback,
            userfile: files,
            ...(section_guid && { section_guid }),
            ...(test_guid && { test_guid })
          },
          saveAsNew ? true : false
        )
      }

      // if (response.success) {
      //   toast.success(response.message)
      // } else {
      //   toast.error(response.message)
      // }
    } catch (error) {
      console.error('Error during form submission:', error)

      // toast.error('An unexpected error occurred.')
    }

    if (section_guid) {
      router.push('/question/allquestion')
    }

    if (section_guid && tguid) {
      router.push(`/question/list?testguid=${tguid}`)
    }

    if (test_guid) {
      router.push(`/question/list?testguid=${test_guid}`)
    }
  }

  return (
    <>
      <style>
        {`
          .ql-container {
          in-height: 30%;
          }
          .ql-editor {
            min-height: 30vh; /* Adjust the height */
          }
        `}
      </style>
      <FilterHeader title='Add Question' subtitle='Orders placed across your store' />{' '}
      <Grid container item xs={12}>
        <Grid item container xs={12}>
          <form
            // eslint-disable-next-line lines-around-comment
            // onSubmit={handleSubmit(data =>
            //   console.info({
            //     ...data,
            //     choices: mcqFields,
            //     question: nquestion,
            //     feedback: feedback,
            //     answer_feedback: answerFeedback
            //   })
            // )}
            onSubmit={handleSubmit(handleFormSubmit)}
            style={{
              width: '100vw'
            }}
          >
            <QuestionTypeAndTemplate control={control} errors={errors} questionTypeFixed={questionTypeFixed} />
            {selectedValue != 'section' && (
              <Grid item xs={12} py={4}>
                <Card>
                  <CardHeader title='Question' />
                  <CardContent>
                    <Grid container xs={12}>
                      <Grid item xs={12}>
                        <Controller
                          name='question'
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextEditor
                              {...field}
                              onChange={content => field.onChange(content)} // update the form state
                              value={field.value || ''}
                              setTextValue={setNQuestion}
                              autoFocus
                              fullWidth
                              quilleditor

                              // simpleeditor

                              // mkeditor
                            />
                          )}
                        />
                        {errors.question && <FormHelperText error>This field is required.</FormHelperText>}
                      </Grid>
                      <Grid item xs={12} py={3}>
                        <Typography
                          component='a'
                          target='_blank'
                          rel='noopener noreferrer'
                          style={{ textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }} // Optional: to style the link
                          onClick={() => {
                            setOpenQuestionFeedback(!openQuestionFeedback)
                          }}
                        >
                          Hint
                        </Typography>
                        {openQuestionFeedback && (
                          <Grid item xs={12} py={3}>
                            <Controller
                              name='hint'
                              control={control}
                              rules={{ required: true }}
                              render={({ field }) => (
                                <TextEditor
                                  {...field}
                                  onChange={content => field.onChange(content)} // update the form state
                                  value={field.value || ''}
                                  autoFocus
                                  fullWidth
                                  quilleditor
                                />
                              )}
                            />
                          </Grid>
                        )}
                      </Grid>
                      <Grid item xs={12} py={3}>
                        <QuestionUpload files={files} setFiles={setFiles} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                <Card
                  sx={{
                    marginTop: 3
                  }}
                >
                  <CardContent>
                    <Grid item xs={12} py={3}>
                      <QuestionSettings control={control} errors={errors} />
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
            {selectedValue === 'section' && (
              <Grid item xs={12} py={4}>
                <Card>
                  <CardHeader title='Question' />
                  <CardContent>
                    <Grid container xs={12}>
                      <Grid item xs={12}>
                        <Controller
                          name='question'
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextEditor
                              {...field}
                              onChange={content => field.onChange(content)} // update the form state
                              value={field.value || ''}
                              setTextValue={setNQuestion}
                              autoFocus
                              fullWidth
                              quilleditor

                              // simpleeditor

                              // mkeditor
                            />
                          )}
                        />
                        {errors.question && <FormHelperText error>This field is required.</FormHelperText>}
                      </Grid>
                      <Grid item xs={12} py={3}>
                        <Typography
                          component='a'
                          target='_blank'
                          rel='noopener noreferrer'
                          style={{ textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }} // Optional: to style the link
                          onClick={() => {
                            setOpenQuestionFeedback(!openQuestionFeedback)
                          }}
                        >
                          Hint
                        </Typography>
                        {openQuestionFeedback && (
                          <Grid item xs={12} py={3}>
                            <Controller
                              name='hint'
                              control={control}
                              rules={{ required: true }}
                              render={({ field }) => (
                                <TextEditor
                                  {...field}
                                  onChange={content => field.onChange(content)} // update the form state
                                  value={field.value || ''}
                                  autoFocus
                                  fullWidth
                                  quilleditor
                                />
                              )}
                            />
                          </Grid>
                        )}
                      </Grid>
                      <Grid item xs={12} py={3}>
                        <QuestionUpload files={files} setFiles={setFiles} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                <Card
                  sx={{
                    marginTop: 3
                  }}
                >
                  {/* <CardContent>
                    <Grid item xs={12} py={3}>
                      <QuestionSettings control={control} errors={errors} />
                    </Grid>
                  </CardContent> */}
                </Card>
              </Grid>
            )}
            {selectedValue !== 'section' && (
              <Grid item xs={12}>
                {selectedValue === 'mcmc' && (
                  <McqQuestion mcqFields={mcqFields} setMcqFields={setMcqFields} control={control} />
                )}
                {selectedValue === 'tf' && (
                  <TrueFalseQuestion choiceFields={choiceFields} setChoiceFields={setChoiceFields} />
                )}
                {selectedValue === 'essays' && <EssaysQuestion control={control} errors={errors} />}
                {/* {selectedValue === 'section' && <SectionQuestion control={control} errors={errors} />} */}
              </Grid>
            )}
            <Grid container item xs={12}>
              {selectedValue !== 'section' && (
                <QuestionFeedback
                  control={control}
                  errors={errors}
                  register={register}
                  setValue={setValue}
                  setFeedback={setFeedback}
                  setAnswerFeedback={setAnswerFeedback}
                />
              )}
            </Grid>
            <Grid container item xs={12}>
              <SaveQuestion
                handleSubmit={handleSubmit}
                resetForm={resetForm}
                setSaveQuestion={setSaveQuestion}
                setEditQuestion={setEditQuestions}
                setNQuestion={setNQuestion}
                setFeedback={setFeedback}
                setAnswerFeedback={setAnswerFeedback}
                setSaveAsNew={setSaveAsNew}
              />
            </Grid>
          </form>
        </Grid>
      </Grid>
    </>
  )
}

export default AddQuestion
