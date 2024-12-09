'use client'

// MUI Imports
import { useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Grid, Button, FormControlLabel, Switch } from '@mui/material'

import { useTheme } from '@mui/material/styles'

import TestCardItems from './TestCardItems'
import QuestionsSection from './QuestionsSection'
import AlertDialogBox from '@/components/Common/AlertDialogBox'
import useTestApi from '@/api/test/useTestApi'
import FilterHeader from '@/components/globals/FilterHeader'
// import useTestApi from '@/api/useTestApi'
import useQuestionModuleApi from '@/api/useQuestionModuleApi'

const UserListCards = () => {
  const theme = useTheme()
  const searchParams = useSearchParams()
  const router = useRouter()
  const guid = searchParams.get('guid')
  const [checked, setChecked] = useState(false)
  const [open, setOpen] = useState(false)
  const { deleteTestData, handleTestPublish } = useTestApi()
  // const { viewTest } = useTestApi()
  const { viewTest, viewTestData } = useQuestionModuleApi()
  const handleChange = event => {
    setChecked(event.target.checked)
    handleTestPublish(guid, Number(event.target.checked))
  }

  const PublishSwitch = () => {
    return (
      <Grid item xs={6} md={6} display='flex' justifyContent='flex-end'>
        <FormControlLabel control={<Switch checked={checked} onChange={handleChange} />} />
      </Grid>
    )
  }
  useEffect(() => {
    viewTest(guid)
  }, [guid])
  console.log(viewTestData, 'viewTestData')
  const data = [
    {
      stats: '7',
      avatarColor: theme.palette.customColors.testCardColors1,
      subtitle: 'Questions',
      linkheading1: 'Preview Question'
    },
    {
      stats: '2/25',
      avatarColor: theme.palette.success.main,
      subtitle: 'Submissions/Users'
    },
    {
      stats: '4/24',
      avatarColor: theme.palette.customColors.testCardColors2,
      subtitle: 'Submissions/Users',
      linkheading1: 'Pending Correction'
    },
    {
      stats: '3',
      avatarColor: theme.palette.warning.main,
      subtitle: 'Questions',
      linkheading1: 'Attempts in progress'
    },
    {
      stats: '2',
      avatarColor: theme.palette.success.main,
      subtitle: 'Attempts Not Submitted'
    },
    {
      stats: '100',
      avatarColor: theme.palette.customColors.testCardColors2,
      subtitle: 'Total Marks'
    },
    {
      stats: '7',
      avatarColor: theme.palette.customColors.testCardColors1,
      subtitle: 'Weightage',
      linkheading1: 'Update weightage'
    }
  ]

  const settingsData = [
    {
      icon: '/images/icons/publish.svg',
      title: 'Publish',
      component: <PublishSwitch />
    },
    {
      icon: '/images/icons/edit.svg',
      title: 'Edit',
      handleClick: () => router.push(`/test/edit?guid=${guid}`)
    },
    {
      icon: '/images/icons/delete.svg',
      title: 'Delete',
      handleClick: () => setOpen(true)
    }
  ]

  const submissionData = [
    {
      icon: '/images/icons/badge.svg',
      title: 'Attempt',
      handleClick: () => router.push(`/attempt?guid=${guid}`)
    },
    {
      icon: '/images/icons/check.svg',
      title: 'Marking',
      handleClick: () => router.push(`/marking?guid=${guid}`)
    }
  ]

  const enrollmentData = [
    {
      icon: '/images/icons/badge.svg',
      title: 'All Enrollments',
      handleClick: () => router.push(`/enrollments/?guid=${guid}`)
    },
    {
      icon: '/images/icons/add.svg',
      title: 'Enroll Student',
      handleClick: () => router.push(`/enrollments/users/?guid=${guid}`)
    }
  ]

  const questionsData = [
    {
      icon: '/images/icons/badge.svg',
      title: 'All Questions',
      handleClick: () => router.push(`/question/list/?testguid=${guid}`)
    },
    {
      icon: '/images/icons/preview.svg',
      title: 'Preview Test',
      handleClick: () => router.push(`/instructions/generalinstructions?guid=${guid}`)
    },
    {
      icon: '/images/icons/import.svg',
      title: 'Import Questions',
      handleClick: () => router.push(`/question/import/?testguid=${guid}`)
    },
    {
      icon: '/images/icons/test.svg',
      title: 'Take test as student',
      handleClick: () => router.push(`/taketest?guid=${guid}`)
    },
    {
      icon: '/images/icons/add.svg',
      title: 'Add Questions',
      handleClick: () => router.push(`/test/questions/?guid=${guid}`)
    }
  ]

  const handleCancelDelete = () => {
    setOpen(false)
  }

  const handleConfirmDelete = () => {
    deleteTestData(guid).then(res => {
      if (res?.success) {
        setOpen(false)
      }
    })
  }

  return (
    <>
      <FilterHeader title='Manage Test'></FilterHeader>
      <Grid container xs={12}>
        <Grid container spacing={6}>
          {data?.map((item, i) => (
            <Grid key={i} item xs={12} sm={6} md={3}>
              <TestCardItems {...item} />
            </Grid>
          ))}
        </Grid>
        <Grid container item xs={12} mt={10} spacing={5}>
          <QuestionsSection title='Questions' subtitle={viewTestData?.title} dummyData={questionsData}>
            <Grid item xs={12} md={2.5}>
              <Button
                fullWidth
                variant='outlined'
                onClick={() => {}}
                className='max-sm:is-full'
                startIcon={
                  <i
                    class='ri-printer-line'
                    style={{
                      width: 18,
                      height: 18
                    }}
                  />
                }
              >
                Print
              </Button>
            </Grid>
            <Grid item xs={12} md={2.5}>
              <Button
                fullWidth
                variant='contained'
                onClick={() => {}}
                className='max-sm:is-full'
                startIcon={
                  <i
                    class='ri-download-line'
                    style={{
                      width: 18,
                      height: 18
                    }}
                  />
                }
              >
                Export
              </Button>
            </Grid>
          </QuestionsSection>
          <QuestionsSection title='Settings' subtitle='Lorem ipsum' dummyData={settingsData} settings={true} />
          <QuestionsSection title='Submission' dummyData={submissionData} settings={true} />
          <QuestionsSection title='Enrollment' dummyData={enrollmentData} settings={true} />
        </Grid>
        {open && (
          <AlertDialogBox
            open={open}
            handleCancel={handleCancelDelete}
            handleConfirm={handleConfirmDelete}
            title='Delete Test'
            textContent='Are you sure you want to delete this test?'
            acceptedButton='Delete'
            rejectedButton='Cancel'
          />
        )}
      </Grid>
    </>
  )
}

export default UserListCards
