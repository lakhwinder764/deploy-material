'use client'
import React, { useEffect, useState } from 'react'
import { Container, Typography, Box, Grid, Card, CardContent, IconButton, CircularProgress } from '@mui/material'
import FilterHeader from '@/Components/globals/FilterHeader'
import useQuestionModuleApi from '@/api/useQuestionModuleApi'
import { useSearchParams, useRouter } from 'next/navigation'

const ViewQuestion = () => {
  const searchParams = useSearchParams()
  const guid = searchParams.get('guid')
  const [data, setData] = useState({})
  const router = useRouter()
  const { viewQuestion } = useQuestionModuleApi()

  useEffect(() => {
    if (guid) {
      viewQuestion(guid).then(res => {
        const payload = res?.data?.payload
        setData(payload)
      })
    }
  }, [guid])

  const questionTypeMap = {
    mcmc: 'Multiple Choice',
    tf: 'True False'
  }

  const decodeHtmlEntities = html => {
    const txt = document.createElement('textarea')
    txt.innerHTML = html
    return txt.value
  }

  const handleAccordionClick = guid => {
    router.push(`/question/edit?guid=${guid}`)
  }

  return (
    <Container>
      <FilterHeader title='View Question' subtitle='Orders placed across your store' link='/test/list' />
      <Box mt={4}>
        <Card>
          <CardContent>
            {Object.keys(data).length === 0 ? (
              <Box display='flex' justifyContent='center' alignItems='center'>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                  <Typography variant='h6' gutterBottom>
                    {questionTypeMap[data.question_type] || data.question_type}
                  </Typography>
                  <Box>
                    <IconButton color='primary' onClick={() => handleAccordionClick(data.guid)}>
                      <i className='ri-edit-box-line'></i>
                    </IconButton>
                    <IconButton color='secondary'>
                      <i className='ri-delete-bin-line'></i>
                    </IconButton>
                  </Box>
                </Box>

                <Typography
                  variant='h5'
                  gutterBottom
                  style={{ textTransform: 'capitalize' }}
                  dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(data.question || '') }}
                />

                {/* Render image or video based on file_type */}
                {/* Render image or video based on file_type */}
                {data?.file_url_path && data?.file_hash && (
                  <Box mb={2} display='flex'>
                    {data.file_type === 'mp4' ? (
                      <video controls style={{ maxWidth: '100%', height: 'auto' }}>
                        <source src={`${data.file_url_path}/${data.file_hash}`} type='video/mp4' />
                        Your browser does not support the video tag.
                      </video>
                    ) : data.file_type === 'docx' || data.file_type === 'pdf' ? (
                      <Box display='flex' alignItems='center'>
                        <i class='ri-file-download-line' style={{ marginRight: '8px', color: 'blue' }} />{' '}
                        {/* Download Icon */}
                        <a
                          href={`${data.file_url_path}/${data.file_hash}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          style={{ textDecoration: 'none', color: 'blue' }}
                        >
                          {data?.file_name}
                        </a>
                      </Box>
                    ) : (
                      <img
                        src={`${data.file_url_path}/${data.file_hash}`} // Image source with filehash
                        alt='Question related'
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    )}
                  </Box>
                )}

                {/* Render choices */}
                <Grid container spacing={2}>
                  {data.choices &&
                    data.choices.map(choice => (
                      <Grid item xs={12} sm={6} md={3} key={choice.choice_key}>
                        <Card variant='outlined'>
                          <CardContent>
                            <Typography
                              style={{ color: choice.is_correct_answer === 1 ? 'lightgreen' : 'inherit' }}
                              variant='body1'
                              align='center'
                              dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(choice.choice || '') }}
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>

                <Box mt={2}>
                  <Typography variant='body1' gutterBottom>
                    Negative Marks: {data.neg_marks}
                  </Typography>
                  <Typography variant='body1' gutterBottom>
                    Time: {data.time} seconds
                  </Typography>
                  <Typography variant='body1' gutterBottom>
                    Marks: {data.marks}
                  </Typography>

                  {/* Display Answer Feedback if available */}
                  {data?.answer_feedback != 'undefined' && data?.answer_feedback != '' && (
                    <Box display='flex' alignItems='center'>
                      <Typography variant='h6' mr={1}>
                        Answer Feedback:
                      </Typography>
                      <Typography
                        variant='body1'
                        dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(data.answer_feedback) }}
                      />
                    </Box>
                  )}
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

export default ViewQuestion
