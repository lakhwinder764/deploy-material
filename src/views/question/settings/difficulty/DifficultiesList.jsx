'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports

import useCategoryApi from '@/api/useCategoryApi'
import DifficultiesListTable from './DifficultiesListTable'
import useDifficultiesApi from '@/api/useDifficultiesApi'

const DifficultiesList = () => {
  const {
    data,
    trashedData,
    addDifficultyData,
    trashDifficulties,
    deleteDifficulties,
    restoreTrashDifficulties,
    getTrashedDifficultiesLevel,
    searchKeyword,
    setSearchKeyword,
    fetchData,
    metaData,
    trashMetaData,
    searchTrashKeyword,
    setSearchTrashKeyword
  } = useDifficultiesApi()

  console.info(trashedData?.length)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DifficultiesListTable
          tableData={data}
          trashedData={trashedData}
          deleteDifficulties={deleteDifficulties}
          addDifficultyData={addDifficultyData}
          trashDifficulties={trashDifficulties}
          restoreTrashDifficulties={restoreTrashDifficulties}
          getTrashedDifficultiesLevel={getTrashedDifficultiesLevel}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          fetchData={fetchData}
          metaData={metaData}
          trashMetaData={trashMetaData}
          searchTrashKeyword={searchTrashKeyword}
          setSearchTrashKeyword={setSearchTrashKeyword}
        />
      </Grid>
    </Grid>
  )
}

export default DifficultiesList
