import React, { useState, useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Card, CardContent, Typography, Switch, Grid, Chip, Divider } from '@mui/material'

import useTestApi from '@/api/test/useTestApi'

const TestCard = ({ testQuestionData, isPublished, setIsPublished, getTestQuestion, searchkeyword }) => {
  // State to track if the test is published or unpublished

  const { handleTestPublish } = useTestApi()
  const search = useSearchParams()
  const testguid = search.get('testguid')

  useEffect(() => {
    // Update the isPublished state when testQuestionData changes
    if (testQuestionData) {
      setIsPublished(testQuestionData.status === 1)
    }
  }, [testQuestionData])

  // Function to handle switch toggle
  const handleSwitchChange = async event => {
    const newPublishState = event.target.checked

    setIsPublished(newPublishState)

    try {
      // Call the API with 1 for published and 0 for unpublished
      const publishStatus = newPublishState ? 1 : 0

      await handleTestPublish(testguid, publishStatus)
      console.log('Test publish state updated:', publishStatus)
      await getTestQuestion(testguid, searchkeyword)
    } catch (error) {
      console.error('Failed to update publish state:', error)

      // Revert the switch state in case of an error
      setIsPublished(!newPublishState)
    }
  }

  return (
    <Card style={{ margin: '0 auto', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Test Title
        </Typography>
        <Typography variant='body2' color='textSecondary'>
          {testQuestionData?.title}
        </Typography>
        <Divider style={{ marginTop: '10px' }} />
        <Grid container style={{ marginTop: 10 }}>
          <Grid item xs={6}>
            <Typography variant='body2' style={{ color: '#262B43B2' }}>
              Sections
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body2' align='right'>
              5
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6}>
            <Typography variant='body2'>Questions</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body2' align='right'>
              50
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6}>
            <Typography variant='body2'>Total Marks</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body2' align='right'>
              100
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6}>
            <Typography variant='body2'>Time</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body2' align='right'>
              60m
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6}>
            <Typography variant='body2'>Negative Marking</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body2' align='right'>
              -0.5
            </Typography>
          </Grid>
        </Grid>

        <Grid container style={{ marginTop: 10 }}>
          <Grid item xs={6}>
            <Typography variant='body2'>Test Type</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body2' align='right' style={{ color: '#4caf50' }}>
              <Chip label='Practice' variant='tonal' color='success' size='small' />
            </Typography>
          </Grid>
        </Grid>

        <Grid container alignItems='center' style={{ marginTop: 10 }}>
          <Grid item xs={6}>
            <Typography variant='body2'>{isPublished ? 'Published' : 'Unpublished'}</Typography>
          </Grid>
          <Grid item xs={6} align='right'>
            <Switch checked={isPublished} onChange={handleSwitchChange} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default TestCard
