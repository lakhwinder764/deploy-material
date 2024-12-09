'use client'

import { useState } from 'react'

import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Grid, Tab } from '@mui/material'

import { useTheme } from '@mui/material/styles'

import FilterHeader from '@/components/globals/FilterHeader'
import UserListCards from '../manage/UserListCards'
import TestCardItems from '../manage/TestCardItems'
import TestChartReport from './TestChartReport'
import QuestionMarking from '../marking/QuestionMarking'
import QuestionHeader from './QuestionHeader'
import QuestionTestReport from './QuestionTestReport'

const TestReport = () => {
  const theme = useTheme()
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const data = [
    {
      stats: '1/100',
      avatarColor: theme.palette.customColors.testCardColors1,
      subtitle: 'Total Marks Score'
    },
    {
      stats: '1',
      avatarColor: theme.palette.success.main,
      subtitle: 'Correct'
    },
    {
      stats: '3',
      avatarColor: theme.palette.customColors.testCardColors2,
      subtitle: 'Incorrect'
    },
    {
      stats: '97',
      avatarColor: theme.palette.warning.main,
      subtitle: 'Unanswered'
    }
  ]

  return (
    <>
      <FilterHeader title='Test Report' subtitle='Mathematics Test' />

      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label='simple tabs example'>
          <Tab value='1' label='Summary' />
          <Tab value='2' label='Details' />
        </TabList>
        <TabPanel value='1'>
          <Grid container xs={12}>
            <Grid container spacing={6}>
              {data?.map((item, i) => (
                <Grid key={i} item xs={12} sm={6} md={3}>
                  <TestCardItems {...item} report={true} />
                </Grid>
              ))}
            </Grid>
            <Grid container item xs={12} pt={10}>
              <TestChartReport />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value='2'>
          {/* <QuestionMarking /> */}
          <QuestionTestReport />
        </TabPanel>
      </TabContext>
    </>
  )
}

export default TestReport
