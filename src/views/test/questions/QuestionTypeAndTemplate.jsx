import { Grid, Card, CardContent, FormControl, Select, MenuItem, FormHelperText, InputLabel } from '@mui/material'
import { Controller } from 'react-hook-form'

const QuestionTypeAndTemplate = ({ control, errors, questionTypeFixed }) => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Grid container spacing={5} xs={12}>
            <Grid item xs={12} sm={6}>
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
                <InputLabel id='country'>Question Type</InputLabel>
                <Controller
                  name='type'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label='Question Type'
                      size='small'
                      disabled={questionTypeFixed}
                      error={Boolean(errors.type)}
                      fullWidth
                    >
                      <MenuItem value='mcmc'>Multiple Choice Questions</MenuItem>
                      <MenuItem value='tf'>True False</MenuItem>
                      <MenuItem value='essays'>Essays</MenuItem>
                      <MenuItem value='section'>Section</MenuItem>
                    </Select>
                  )}
                />
                {errors.type && <FormHelperText error>This field is required.</FormHelperText>}
              </FormControl>
            </Grid>

            {/* <Grid item xs={12} sm={6}>
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
                <Controller
                  name='template'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      size='small'
                      error={Boolean(errors.template)}
                      fullWidth
                      inputProps={{ placeholder: 'Select Template' }}
                    >
                      <MenuItem value='template_1'>Template 1</MenuItem>
                      <MenuItem value='template_2'>Template 2</MenuItem>
                      <MenuItem value='template_3'>Template 3</MenuItem>
                    </Select>
                  )}
                />
                {errors.template && <FormHelperText error>This field is required.</FormHelperText>}
              </FormControl>
            </Grid> */}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default QuestionTypeAndTemplate
