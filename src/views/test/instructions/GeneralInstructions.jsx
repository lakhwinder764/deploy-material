'use client'
import { List, ListItem, Card, Typography, Button, Divider } from '@mui/material'
import React from 'react'
import { useRouter } from 'next/navigation'

const GeneralInstructions = () => {
  const router = useRouter()

  return (
    <div style={{ padding: 30 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, padding: 20 }}>
        <Typography variant='h4'>General Instructions</Typography>
        <Button variant='contained' color='primary' onClick={() => router.push('/instructions/testinstructions')}>
          Next
        </Button>
      </div>
      <Divider></Divider>
      <Card style={{ padding: 30, marginTop: 20 }}>
        <Typography variant='h6' gutterBottom>
          Exam Instructions
        </Typography>

        <Typography variant='subtitle1' gutterBottom>
          1. The clock will be set at the server. The countdown timer at the top right corner of the screen will display
          the remaining time available for you to complete the examination. When the timer reaches zero, the examination
          will end by itself. You need not terminate the examination or submit your paper.
        </Typography>

        <Typography variant='subtitle1' gutterBottom>
          2. The Question Palette displayed on the right side of the screen will show the status of each question using
          one of the following symbols:
        </Typography>

        <List>
          <ListItem>• You have not visited the question yet.</ListItem>
          <ListItem>• You have not answered the question.</ListItem>
          <ListItem>• You have answered the question.</ListItem>
          <ListItem>• You have NOT answered the question, but have marked the question for review.</ListItem>
        </List>

        <Typography variant='subtitle1' gutterBottom>
          The Mark For Review status for a question simply indicates that you would like to look at that question again.
          If a question is answered, but marked for review, then the answer will be considered for evaluation unless the
          status is modified by the candidate.
        </Typography>

        <Typography variant='h6' gutterBottom>
          Navigating to a Question:
        </Typography>

        <Typography variant='subtitle1' gutterBottom>
          To answer a question, do the following:
        </Typography>

        <List>
          <ListItem>
            • Click on the question number in the Question Palette at the right of your screen to go to that numbered
            question directly. Note that using this option does NOT save your answer to the current question.
          </ListItem>
          <ListItem>
            • Click on
            <Button variant='contained' color='primary' size='small'>
              Next
            </Button>{' '}
            to save your answer for the current question and then go to the next question.
          </ListItem>
          <ListItem>
            • Click on 'Mark for Review' to save your answer for the current question and also mark it for review, and
            then go to the next question.
          </ListItem>
        </List>

        <Typography variant='subtitle1' gutterBottom>
          Note that your answer for the current question will not be saved, if you navigate to another question directly
          by clicking on a question number.
        </Typography>

        <Typography variant='h6' gutterBottom>
          Answering Multiple Choice Questions (MCQs):
        </Typography>

        <List>
          <ListItem>
            • Choose one answer from the 4 options (A, B, C, D) given below the question, and click on the bubble placed
            before the chosen option.
          </ListItem>
          <ListItem>
            • To deselect your chosen answer, click on the bubble of the chosen option again or click on the Clear
            Response button.
          </ListItem>
          <ListItem>• To change your chosen answer, click on the bubble of another option.</ListItem>
          <ListItem>
            • To save your answer, you MUST click on the{' '}
            <Button variant='contained' color='primary' size='small'>
              Next
            </Button>{' '}
            button.
          </ListItem>
        </List>

        <Typography variant='subtitle1' gutterBottom>
          After clicking the{' '}
          <Button variant='contained' color='primary' size='small'>
            Next
          </Button>{' '}
          button for the last question in a Section, you will automatically be taken to the first question of the next
          Section in sequence.
        </Typography>

        <Typography variant='subtitle1'>
          You can move the mouse cursor over the name of a Section to view the answering status for that Section.
          itself. You need not terminate the examination or submit your paper.
        </Typography>
      </Card>
    </div>
  )
}

export default GeneralInstructions
