'use client'

// MUI Imports
import { useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import Grid from '@mui/material/Grid'

import { Button } from '@mui/material'

import useTestApi from '@/api/test/useTestApi'
import EnrollmentTestListTable from './EnrollmentTestListTable'
import FilterHeader from '@/Components/globals/FilterHeader'
import useEnrollmentsApi from '@/api/enrollments/useEnrollmentsApi'

const EnrollmentTestList = () => {
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
    submissionsData,
    submissionsMetaData,
    searchSubmissionsKeyword,
    setSearchSubmissionsKeyword
  } = useTestApi()

  const router = useRouter()

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

  const {
    enrollUsersInTest,
    unenrollUsersInTest,
    getEnrollUsersData,
    getUnenrollUsersData,
    enrolledUsersMetaData,
    enrolledUsersData,
    unenrolledUsersData,
    unenrolledUsersMetaData,
    editUsersEnrollmentInTest,
    getUsersData,
    usersData,
    searchKeyword,
    setSearchKeyword
  } = useEnrollmentsApi()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    getEnrollUsersData(guid)
  }, [])

  return (
    <>
      <FilterHeader title='Enrollment' subtitle={enrolledUsersData?.title}>
        <Grid item xs={8} md={3} display='flex' alignItems='end' justifyContent='flex-end' pb={3}>
          <Button
            variant='contained'
            onClick={() => {
              router.push(`/enrollments/users/?guid=${guid}`)
            }}
            className='max-sm:is-full'
          >
            Enroll Student
          </Button>
        </Grid>
      </FilterHeader>
      <EnrollmentTestListTable
        tableData={enrolledUsersData?.users ?? []}
        getEnrollUsersData={getEnrollUsersData}
        unenrollUsersInTest={unenrollUsersInTest}
        editUsersEnrollmentInTest={editUsersEnrollmentInTest}
        testSubmissions={testSubmissions}
        metaData={enrolledUsersMetaData}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        getUsersData={getUsersData}
        usersData={usersData}
      />
    </>
  )
}

export default EnrollmentTestList
