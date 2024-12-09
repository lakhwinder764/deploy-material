import { Grid, Card } from '@mui/material'

import FilterHeader from '@/Components/globals/FilterHeader'
import AttemptTestFilters from './AttemptTestFilters'

const TestAttempts = () => {
  return (
    <>
      <FilterHeader title='Attempts' subtitle='Mathematics Test' />
      <Card>
        <Grid container item xs={12} display='flex' alignItems='center'>
          <Grid item xs={12}>
            <AttemptTestFilters
              setData={setFilteredData}
              tableData={data}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              type={type}
              setType={setType}
            />
          </Grid>
        </Grid>
      </Card>
    </>
  )
}

export default TestAttempts
