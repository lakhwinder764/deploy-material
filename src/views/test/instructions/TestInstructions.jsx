'use client'
import React from 'react'

import { Typography, Divider, Box, Card, CardContent, List, ListItem, Button } from '@mui/material'
import { useRouter } from 'next/navigation'

const TestInstructions = () => {
  const router = useRouter()
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, padding: 20 }}>
        <Typography variant='h4'>Test Instructions</Typography>
      </div>
      <Divider></Divider>
      <Card style={{ padding: 30, marginTop: 20, marginBottom: 30 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '30px 0px',
            backgroundColor: '#fff',
            width: '100%'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='body1'> All Questiions : 20</Typography>
          </Box>

          <Divider orientation='vertical' flexItem sx={{ margin: '0 16px' }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='body1'>Negative Marking : </Typography>
          </Box>

          <Divider orientation='vertical' flexItem sx={{ margin: '0 16px' }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='body1'>Question Marks</Typography>
          </Box>
          <Divider orientation='vertical' flexItem sx={{ margin: '0 16px' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='body1'>Negative Marking : </Typography>
          </Box>

          <Divider orientation='vertical' flexItem sx={{ margin: '0 16px' }} />
        </Box>

        <Divider sx={{ marginBottom: 10 }} />

        <Box>
          <Typography variant='h6' gutterBottom>
            Exam Instructions
          </Typography>

          <Typography variant='subtitle1' gutterBottom>
            1. The clock will be set at the server. The countdown timer at the top right corner of the screen will
            display the remaining time available for you to complete the examination. When the timer reaches zero, the
            examination will end by itself. You need not terminate the examination or submit your paper.
          </Typography>

          <Typography variant='subtitle1' gutterBottom>
            2. The Question Palette displayed on the right side of the screen will show the status of each question
            using one of the following symbols:
          </Typography>

          <List>
            <ListItem>• You have not visited the question yet.</ListItem>
            <ListItem>• You have not answered the question.</ListItem>
            <ListItem>• You have answered the question.</ListItem>
            <ListItem>• You have NOT answered the question, but have marked the question for review.</ListItem>
          </List>

          <Typography variant='subtitle1' gutterBottom>
            The Mark For Review status for a question simply indicates that you would like to look at that question
            again. If a question is answered, but marked for review, then the answer will be considered for evaluation
            unless the status is modified by the candidate.
          </Typography>
        </Box>
      </Card>

      <div style={{ display: 'flex', gap: 30 }}>
        <Button variant='contained' color='primary'>
          Back
        </Button>
        <Button variant='outlined' color='primary' onClick={() => router.push('/previewtest')}>
          Begin Test
        </Button>
      </div>
    </div>
  )
}

export default TestInstructions
