import { Grid, Card, CardContent, Button, InputLabel, FormControl, MenuItem, Select } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

const WeightedMarksSettings = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const handleFormSubmit = data => {
    // e
    console.info(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={5} xs={12}>
        <Grid item xs={12}>
          <Card
            sx={{
              marginTop: 3,
              paddingTop: 5,
              paddingBottom: 5
            }}
          >
            <CardContent>
              <Grid container spacing={5} xs={12}>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiInputBase-root': {
                        height: '40px',
                        minHeight: 'auto'
                      },
                      '& .MuiInputLabel-root': {
                        top: '-7px'
                      }
                    }}
                  >
                    <InputLabel id='country' error={Boolean(errors.type)}>
                      Weighted Marks
                    </InputLabel>
                    <Controller
                      name='weighted_marks'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          size='small'
                          fullWidth
                          label='Weighted Marks'
                          inputProps={{ placeholder: 'Weighted Marks' }}
                        >
                          <MenuItem value='50'>50</MenuItem>
                          <MenuItem value='20'>20</MenuItem>
                          <MenuItem value='30'>30</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }} py={3}>
          <Button size='small' type='submit' variant='contained' onClick={handleFormSubmit}>
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default WeightedMarksSettings
