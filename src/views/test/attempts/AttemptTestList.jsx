'use client'

// MUI Imports
import { useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import Grid from '@mui/material/Grid'

// Component Imports
import { TabContext, TabList, TabPanel } from '@mui/lab'

import { Tab } from '@mui/material'

import useTestApi from '@/api/test/useTestApi'
import AttemptTestListTable from './AttemptTestListTable'
import FilterHeader from '@/Components/globals/FilterHeader'
import AttemptGroupTestListTable from './AttemptGroupTestListTable'

const AttemptTestList = () => {
  const {
    addTestData,
    updateTestData,
    deleteTestData,
    data,
    testData,
    viewTest,
    getCategories,
    categories,
    testSubmissions,
    submissionsData
  } = useTestApi()

  const updatedData = submissionsData?.map((item, index) => ({
    ...item,
    status:
      new Date(item?.expiry_time) > new Date(item?.submit_time)
        ? 'Expired'
        : item?.submit_time
          ? 'Submitted'
          : item?.start_time
            ? 'NotStarted'
            : 'InProgress'

    //logic for testing chips

    // index % 2 === 0 ? 'Submitted' : index % 3 === 0 ? 'NotStarted' : index % 1 === 0 ? 'InProgress' : 'Expired'
  }))

  console.info(updatedData)
  const [value, setValue] = useState('1')
  const searchParams = useSearchParams()
  const guid = searchParams?.get('guid')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <>
      <FilterHeader title='Attempts' subtitle='Mathematics Test' />
      <AttemptTestListTable tableData={updatedData} testSubmissions={testSubmissions} />
    </>

    // <Grid container spacing={6}>
    //   <Grid item xs={12}>
    //     <AttemptTestListTable
    //       tableData={data}
    //       addUserData={addTestData}
    //       deleteUserData={deleteTestData}
    //       categories={categories}
    //       getCategories={getCategories}
    //     />
    //   </Grid>
    // </Grid>
  )
}

export default AttemptTestList
