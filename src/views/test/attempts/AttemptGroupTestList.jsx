'use client'

// MUI Imports
import { useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import Grid from '@mui/material/Grid'

// Component Imports
import { TabContext, TabList, TabPanel } from '@mui/lab'

import { Tab } from '@mui/material'

import useTestApi from '@/api/test/useTestApi'
import FilterHeader from '@/components/globals/FilterHeader'
import AttemptGroupTestListTable from './AttemptGroupTestListTable'

const AttemptGroupTestList = () => {
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

  const updatedData = submissionsData?.map(item => ({
    ...item,
    status:
      new Date(item?.expiry_time) > new Date(item?.submit_time)
        ? 'Expired'
        : item?.submit_time
          ? 'Submitted'
          : item?.start_time
            ? 'NotStarted'
            : 'InProgress'
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
      <AttemptGroupTestListTable
        tableData={submissionsData}
        addUserData={addTestData}
        deleteUserData={deleteTestData}
        categories={categories}
        getCategories={getCategories}
        testSubmissions={testSubmissions}
      />
    </>
  )
}

export default AttemptGroupTestList
