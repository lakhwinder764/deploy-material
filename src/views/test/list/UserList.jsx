'use client'

// MUI Imports
import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'

// Component Imports
import TestListTable from './TestListTable'
import useTestApi from '@/api/test/useTestApi'
import useCategoryApi from '@/api/useCategoryApi'

const UserList = () => {
  const {
    addTestData,
    updateTestData,
    fetchData,
    deleteTestData,
    data,
    testData,
    viewTest,
    getCategories,
    categories,
    metaData,
    searchKeyword,
    setSearchKeyword,
    searchTrashKeyword,
    setSearchTrashKeyword,
    deleteTest,
    restoreTest,
    trashMetaData,
    trashTest,
    getTrashedTests,
    trashedData
  } = useTestApi()

  const { data: categoriesData } = useCategoryApi()

  const [categoriesTableData, setCategoriesTableData] = useState(categoriesData)

  useEffect(() => {
    setCategoriesTableData(categoriesData) // Set initial data on load
  }, [categoriesData])
  console.info(categoriesTableData, 'newtab')

  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12}>
        <UserListCards />
      </Grid> */}
      <Grid item xs={12}>
        <TestListTable
          tableData={data}
          categoriesTableData={categoriesTableData}
          addUserData={addTestData}
          categories={categories}
          getCategories={getCategories}
          fetchData={fetchData}
          metaData={metaData}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          trashedData={trashedData}
          deleteTest={deleteTest}
          trashTest={trashTest}
          restoreTest={restoreTest}
          trashMetaData={trashMetaData}
          searchTrashKeyword={searchTrashKeyword}
          setSearchTrashKeyword={setSearchTrashKeyword}
          getTrashedTests={getTrashedTests}
        />
      </Grid>
    </Grid>
  )
}

export default UserList
