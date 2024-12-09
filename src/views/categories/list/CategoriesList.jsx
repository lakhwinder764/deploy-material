'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import React, { useEffect, useState } from 'react'
// Component Imports
import TestListTable from './TestListTable'
import useTestApi from '@/api/useTestApi'
import useCategoryApi from '@/api/useCategoryApi'

const CategoriesList = () => {
  const { data, addCategoryData, trashCategoryData, trashData, trashDifficultyData, resetCategoryData } =
    useCategoryApi()
  const [tableData, setTableData] = useState(data)
  const [trashView, setTrashView] = useState(false)
  useEffect(() => {
    if (trashView) {
      setTableData(trashData) // Set trash data when in trash view
    } else {
      setTableData(data) // Set active data when not in trash view
    }
  }, [trashView, data, trashData])

  // useEffect(() => {
  //   if (trashData) {
  //     setTableData(trashData) // Set trash data when it changes
  //   }
  // }, [trashData])

  // Handler for the trash button click
  const handleActiveClick = () => {
    setTrashView(false)
  }
  const handleTrashClick = () => {
    setTrashView(true)
  }
  useEffect(() => {
    trashDifficultyData()
  }, [])
  console.log(trashView, 'checking')
  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12}>
        <UserListCards />
      </Grid> */}
      <Grid item xs={12}>
        <TestListTable
          tableData={tableData}
          addCategoryData={addCategoryData}
          trashCategoryData={trashCategoryData}
          handleTrashClick={handleTrashClick}
          trashView={trashView}
          resetCategoryData={resetCategoryData}
          trashDataLength={trashData.length}
          activeDataLength={data.length}
          handleActiveClick={handleActiveClick}
        />
      </Grid>
    </Grid>
  )
}

export default CategoriesList
