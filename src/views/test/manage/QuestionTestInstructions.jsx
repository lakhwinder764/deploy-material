import { forwardRef, useState } from 'react'

import {
  Card,
  CardContent,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  TextField,
  Box,
  InputAdornment,
  IconButton,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { Controller, useForm } from 'react-hook-form'

import Reactquill from '@/libs/styles/Reactquill'

const CustomQuill = styled(Reactquill)`
  .ql-container .gl-snow {
    height: 400px !important;
  }
`

const QuestionTestInstructions = () => {
  const [editedText, setEditedText] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    defaultValues: {
      description: ''
    }
  })

  const handleNewSubmit = data => {
    // e
    console.info(data)
  }

  return (
    <>
      <style>
        {`
          .ql-container {
          in-height: 200px;
          }
          .ql-editor {
            min-height: 200px; /* Adjust the height */
          }
        `}
      </style>
      <form onSubmit={handleSubmit(handleNewSubmit)}>
        <Grid container spacing={5} xs={12}>
          <Grid item xs={12}>
            <Card
              sx={{
                marginTop: 3
              }}
            >
              <CardContent>
                <Grid container spacing={5} xs={12}>
                  <Grid item xs={12}>
                    <Typography component='h1' fontWeight='bold'>
                      Test Instruction
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name='description'
                      control={control}
                      render={({ field }) => (
                        <Box minHeight={300}>
                          <CustomQuill
                            {...field}
                            onChange={content => field.onChange(content)} // update the form state
                            value={field.value || ''} // set the value from the form state
                            style={{ backgroundColor: 'white', height: '300px' }}
                            autoFocus
                            fullWidth
                          />
                        </Box>
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }} py={3}>
            <Button size='small' type='submit' variant='contained'>
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default QuestionTestInstructions
