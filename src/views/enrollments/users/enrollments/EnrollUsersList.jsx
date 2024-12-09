'use client'

// MUI Imports
import { useEffect } from 'react'

import { useSearchParams } from 'next/navigation'

import EnrollUsersListTable from './EnrollUsersListTable'
import FilterHeader from '@/components/globals/FilterHeader'
import useEnrollmentsApi from '@/api/enrollments/useEnrollmentsApi'

const EnrollUsersList = () => {
  const {
    enrollUsersInTest,
    getUnenrollUsersData,
    unenrolledUsersData,
    unenrolledUsersMetaData,
    usersSearchKeyword,
    setUsersSearchKeyword
  } = useEnrollmentsApi()

  const searchParams = useSearchParams()
  const guid = searchParams?.get('guid')

  useEffect(() => {
    getUnenrollUsersData(guid)
  }, [])

  return (
    <>
      <FilterHeader title='Enrollment' subtitle='Mathematics Test' />
      <EnrollUsersListTable
        tableData={unenrolledUsersData}
        metaData={unenrolledUsersMetaData}
        searchKeyword={usersSearchKeyword}
        setSearchKeyword={setUsersSearchKeyword}
        enrollUsersInTest={enrollUsersInTest}
        getUnenrollUsersData={getUnenrollUsersData}
      />
    </>
  )
}

export default EnrollUsersList
