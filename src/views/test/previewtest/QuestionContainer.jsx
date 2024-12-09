import React, { useState, useEffect } from 'react'

import { Grid } from '@mui/material'

import QuestionCard from '../testcomponents/QuestionCard'
import QuestionHeader from '../testcomponents/QuestionHeader'
import QuestionFooter from '../testcomponents/QuestionFooter'
import mathTestData from '../data/MockTest'

const QuestionContainer = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const questions = mathTestData?.payload
  const currentQuestion = questions?.[currentQuestionIndex]

  useEffect(() => {
    if (currentQuestion) {
      setTimeLeft(currentQuestion?.time)
    }
  }, [currentQuestionIndex])

  // test timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1)
      }, 1000)

      return () => clearInterval(timer)
    } else {
      handleNextQuestion()
    }
  }, [timeLeft])

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions?.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1)
    }
  }

  return (
    <Grid container sx={{ padding: '16px' }}>
      <Grid item xs={12}>
        <QuestionHeader
          timeLeft={timeLeft}
          currentQuestionNumber={currentQuestionIndex + 1}
          totalQuestions={questions?.length}
          negativeMarking={currentQuestion?.neg_marks}
          questionMarks={currentQuestion?.marks}
        />
      </Grid>

      <Grid item xs={12}>
        <QuestionCard
          questionText={currentQuestion?.question}
          description={currentQuestion?.feedback}
          options={currentQuestion?.choices?.map(choice => choice?.choice)}
        />
      </Grid>
      {/* Question Footer */}
      <Grid item xs={12}>
        <QuestionFooter
          handleNext={handleNextQuestion}
          handlePrevious={handlePreviousQuestion}
          disablePrevious={currentQuestionIndex === 0}
          disableNext={currentQuestionIndex === questions?.length - 1}
        />
      </Grid>
    </Grid>
  )
}

export default QuestionContainer
