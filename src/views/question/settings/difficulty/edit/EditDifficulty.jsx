'use client'
import React, { useEffect, useState } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import { useForm, Controller } from 'react-hook-form'

import { Box, Card, CardContent, FormControlLabel, Grid, IconButton, Radio, Typography } from '@mui/material'

import Select from '@mui/material/Select'

import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress'

import useCategoryApi from '@/api/useCategoryApi'
import useDifficultiesApi from '@/api/useDifficultiesApi'
import TextEditor from '@/components/Common/TextEditor'

// API import

const EditDifficulty = ({ isLoading = false }) => {
  const [types, setTypes] = useState(null)
  const [parentCategories, setParentCategories] = useState([])
  const searchParams = useSearchParams()
  const guid = searchParams?.get('guid')
  const router = useRouter()
  const [routing, setRouting] = useState(false)

  //   const [data, setData] = useState(null)

  // useForm hook
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm()

  const { viewDifficulty, updateDifficulty } = useDifficultiesApi()

  // Fetch data and populate form on component mount
  useEffect(() => {
    if (guid) {
      viewDifficulty(guid).then(res => {
        reset({
          title: res?.data?.payload?.[0]?.title,
          description: res?.data?.payload?.[0]?.description
        })
      })
    }
  }, [guid, reset])

  const handleFormSubmit = async data => {
    updateDifficulty(guid, data)
    setRouting(true)

    // router.push('/categories/list')
  }

  if (routing) {
    router.push('/question/settings')
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={5} xs={12}>
          <Grid item xs={12} display='flex' alignItems='center'>
            <IconButton onClick={() => router.push('/test/list')}>
              <i class='ri-arrow-left-line'></i>
            </IconButton>
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: 18
              }}
            >
              Edit Category
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Card
              sx={{
                paddingTop: 5,
                paddingBottom: 10
              }}
            >
              <CardContent>
                <Grid item xs={12} py={3}>
                  <Controller
                    name='title'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        label='Title'
                        InputLabelProps={{
                          shrink: true
                        }}
                        {...field}
                        error={Boolean(errors.title)}
                        helperText={errors.title ? errors.title.message : ''}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} py={3}>
                  <Controller
                    name='description'
                    control={control}
                    render={({ field }) => (
                      <TextEditor
                        {...field}
                        onChange={content => field.onChange(content)} // update the form state
                        value={field.value || ''}
                        autoFocus
                        fullWidth
                        width='22vw'
                        quilleditor
                        simpleeditor
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }} py={3}>
                  <Button size='large' type='submit' variant='contained' disabled={isLoading} sx={{ mr: 2 }}>
                    {isLoading && <CircularProgress color='inherit' size={20} sx={{ mr: 2 }} />}
                    Save Changes
                  </Button>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default EditDifficulty
