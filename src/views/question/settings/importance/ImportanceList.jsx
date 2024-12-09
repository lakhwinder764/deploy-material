'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports

import ImportanceListTable from './ImportanceListTable'
import useImportanceApi from '@/api/useImportanceApi'

const ImportanceList = () => {
  const {
    data,
    trashedData,
    addImportanceData,
    trashImportance,
    deleteImportance,
    restoreTrashImportance,
    searchKeyword,
    setSearchKeyword,
    fetchData,
    metaData,
    getTrashedImportanceLevel,
    trashMetaData,
    searchTrashKeyword,
    setSearchTrashKeyword
  } = useImportanceApi()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ImportanceListTable
          tableData={data}
          trashedData={trashedData}
          deleteImportance={deleteImportance}
          addImportanceData={addImportanceData}
          trashImportance={trashImportance}
          restoreTrashImportance={restoreTrashImportance}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          fetchData={fetchData}
          metaData={metaData}
          trashMetaData={trashMetaData}
          searchTrashKeyword={searchTrashKeyword}
          setSearchTrashKeyword={setSearchTrashKeyword}
          getTrashedImportanceLevel={getTrashedImportanceLevel}
        />
      </Grid>
    </Grid>
  )
}

export default ImportanceList
