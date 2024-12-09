import React, { useState, useEffect } from 'react'

import { useSearchParams } from 'next/navigation'

import { Grid, Typography } from '@mui/material'

import useTakeTestApi from '@/api/useTakeTestApi'
import QuestionCard from '../testcomponents/QuestionCard'
import QuestionHeader from '../testcomponents/QuestionHeader'
import QuestionFooter from '../testcomponents/QuestionFooter'
import ProgressCard from '../testcomponents/ProgressCard'

const QuestionContainer = ({ collapseCard }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [markForReview, setMarkForReview] = useState({})

  const searchParams = useSearchParams()
  const guid = searchParams.get('guid')
  const { questions: questions, loading, error, fetchData } = useTakeTestApi()

  useEffect(() => {
    if (guid) {
      fetchData(guid)
    }
  }, [guid])

  const currentQuestion = questions ? questions?.[currentQuestionIndex] : null

  useEffect(() => {
    if (currentQuestion) {
      const fetchedTime = currentQuestion?.time

      setTimeLeft(fetchedTime !== null && fetchedTime !== undefined ? fetchedTime : 0)
    }
  }, [currentQuestionIndex, currentQuestion])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1)
      }, 1000)

      return () => clearInterval(timer)
    } else if (timeLeft === 0) {
      handleNextQuestion()
    }
  }, [timeLeft])

  const handleNextQuestion = () => {
    if (questions && currentQuestionIndex < questions?.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1)
    }
  }

  const handleOptionChange = (questionIndex, option) => {
    setSelectedOptions(prev => ({ ...prev, [questionIndex]: option }))
  }

  const handleMarkForReviewChange = (questionIndex, isMarked) => {
    setMarkForReview(prev => ({ ...prev, [questionIndex]: isMarked }))
  }

  if (loading) {
    return <div>Loading questions...</div>
  }

  if (error) {
    return <div>Error fetching questions: {error}</div>
  }

  return (
    <Grid container sx={{ padding: '16px' }}>
      <Grid container spacing={2}>
        {/* Question Card Grid */}
        <Grid
          item
          style={{
            width: collapseCard ? '75%' : '100%',
            transition: 'width 0.5s ease'
          }}
        >
          <Grid item xs={12}>
            {currentQuestion ? (
              <QuestionHeader
                timeLeft={timeLeft}
                currentQuestionNumber={currentQuestionIndex + 1}
                totalQuestions={questions?.length} // Safely access questions.length
                negativeMarking={currentQuestion?.neg_marks ?? 0}
                questionMarks={currentQuestion?.marks ?? 0}
              />
            ) : (
              <Typography variant='h6'>No question available</Typography>
            )}
          </Grid>

          {/* Question Card */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            {currentQuestion ? (
              <QuestionCard
                totalQuestions={questions?.length}
                currentQuestionIndex={currentQuestionIndex}
                questionText={currentQuestion?.question ?? 'No question available'}
                description={currentQuestion?.feedback ?? 'No description available'}
                options={currentQuestion?.choices?.map(choice => choice?.choice) ?? []}
                selectedOption={selectedOptions?.[currentQuestionIndex] || ''}
                onOptionChange={option => handleOptionChange(currentQuestionIndex, option)}
                onMarkForReviewChange={isMarked => handleMarkForReviewChange(currentQuestionIndex, isMarked)}
              />
            ) : (
              <div>Loading question...</div>
            )}
          </Grid>
        </Grid>

        {/* Progress Card Grid */}
        <Grid
          item
          style={{
            width: collapseCard ? '25%' : '0%',
            overflow: 'hidden',
            transition: 'width 0.5s ease'
          }}
        >
          {collapseCard && questions && (
            <ProgressCard
              totalQuestions={questions?.length} // Safely access questions.length
              currentQuestionIndex={currentQuestionIndex}
              selectedOptions={selectedOptions}
              markForReview={markForReview}
            />
          )}
        </Grid>
      </Grid>

      {/* Question Footer */}
      <Grid item xs={12} sx={{ mt: 2 }}>
        <QuestionFooter
          handleNext={handleNextQuestion}
          handlePrevious={handlePreviousQuestion}
          disablePrevious={currentQuestionIndex === 0}
          disableNext={currentQuestionIndex === (questions ? questions?.length - 1 : -1)} // Adjust disable logic
        />
      </Grid>
    </Grid>
  )
}

export default QuestionContainer
