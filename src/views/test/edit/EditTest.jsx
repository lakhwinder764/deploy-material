'use client'
import React, { useEffect, useState } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import { useForm, Controller } from 'react-hook-form'

import { Box, Card, CardContent, FormControlLabel, Grid, IconButton, Radio, Tab, Typography } from '@mui/material'

import Select from '@mui/material/Select'

import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

import CustomTabList from '@core/components/mui/TabList'

import useTestApi from '@/api/test/useTestApi'
import FilterHeader from '@/components/globals/FilterHeader'
import QuestionGeneralSettings from '../manage/QuestionGeneralSettings'
import QuestionGeneralSettingsTimingSection from '../manage/QuestionGeneralSettingsTimerSection'
import QuestionResultSettings from '../manage/QuestionResultSettings'
import QuestionTestInstructions from '../manage/QuestionTestInstructions'
import WeightedMarksSettings from '../attempts/WeightedMarksSettings'
import useCategoryApi from '@/api/useCategoryApi'

// API import

const EditTest = ({ isLoading = false, categoriesTableData, categories, setCategories }) => {
  const [types, setTypes] = useState(null)
  const [activeTab, setActiveTab] = useState('edit_details') // Ensure activeTab is initialized properly
  const [formState, setFormState] = useState(null)
  const { fetchData } = useCategoryApi()
  const searchParams = useSearchParams()
  const guid = searchParams.get('guid')
  const router = useRouter()

  // const [categories, setCategories] = useState([{ parent: null, children: categoriesTableData }])
  const [selectedCategories, setSelectedCategories] = useState([])

  //   const [data, setData] = useState(null)

  // useForm hook
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm()

  const { data, testData, viewTest, updateTestData, testSettings } = useTestApi()

  // Fetch data and populate form on component mount
  useEffect(() => {
    if (guid) {
      viewTest(guid).then(res => {
        setTypes(String(res?.data?.payload?.type))
        reset({
          title: res?.data?.payload?.title,
          type: res?.data?.payload?.type,
          details: res?.data?.payload?.details
        })
      })
    }

    fetchData()
  }, [guid, reset])

  // Function to handle tab change
  const handleChange = (event, newValue) => {
    setActiveTab(newValue) // Update activeTab when a tab is clicked
  }

  const handleFormSubmit = async data => {
    updateTestData(guid, { ...data, type: types, category: selectedCategories[selectedCategories.length - 1] })
  }

  const findCategoryByGuid = (guid, data) => {
    for (const category of data) {
      if (category.guid === guid) return category

      if (category.children?.length) {
        const found = findCategoryByGuid(guid, category.children)

        if (found) return found
      }
    }

    return null
  }

  const handleCategoryChange = (level, selectedGuid) => {
    console.info(level, 'level')
    const updatedSelectedCategories = [...selectedCategories]

    updatedSelectedCategories[level] = selectedGuid
    updatedSelectedCategories.splice(level + 1) // Remove selections for deeper levels
    setSelectedCategories(updatedSelectedCategories)

    const selectedCategory = findCategoryByGuid(selectedGuid, categoriesTableData)

    if (selectedCategory?.children?.length) {
      setCategories(prev =>
        prev.slice(0, level + 1).concat({
          parent: selectedGuid,
          children: selectedCategory.children
        })
      )
    } else {
      // Remove deeper levels if no children exist
      setCategories(prev => prev.slice(0, level + 1))
    }
  }

  return (
    <>
      <FilterHeader title='Test Settings' subtitle='Mathematics Test' />
      <Grid container xs={12}>
        <Grid item xs={12}>
          <TabContext value={activeTab}>
            <CustomTabList value={activeTab} onChange={handleChange} variant='scrollable' pill='true'>
              <Tab
                label={
                  <div className='flex items-center gap-2'>
                    <i class='ri-file-list-line' />
                    Edit Details
                  </div>
                }
                value='edit_details'
              />
              <Tab
                label={
                  <div className='flex items-center gap-2'>
                    <i class='ri-lock-2-line' />
                    General Settings
                  </div>
                }
                value='general_settings'
              />
              <Tab
                label={
                  <div className='flex items-center gap-2'>
                    <i class='ri-bookmark-line' />
                    Result Setings
                  </div>
                }
                value='result_settings'
              />
              <Tab
                label={
                  <div className='flex items-center gap-2'>
                    <i class='ri-file-list-line' />
                    Test Instructions
                  </div>
                }
                value='test_instructions'
              />
              <Tab
                label={
                  <div className='flex items-center gap-2'>
                    <i class='ri-file-list-line' />
                    Weighted Marks
                  </div>
                }
                value='weighted_marks'
              />
            </CustomTabList>
            <Grid item xs={12}>
              {/* TabPanels to render content for each tab */}
              <TabPanel value='edit_details' sx={{ marginTop: 10 }} spacing={6}>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                  <Grid container spacing={5} xs={12}>
                    <Grid item xs={12}>
                      <Card
                        sx={{
                          paddingTop: 5,
                          paddingBottom: 5
                        }}
                      >
                        <CardContent>
                          <Grid item xs={12} py={1}>
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
                          <Grid item xs={12} py={2}>
                            <FormControl fullWidth sx={{ mb: 6 }}>
                              <label>Description</label>
                              <Controller
                                name='details'
                                control={control}
                                render={({ field }) => <TextField {...field} multiline rows={4} />}
                              />
                            </FormControl>
                          </Grid>

                          {/* <Grid item xs={12} py={1}>
                            {categories.map((category, index) => (
                              <FormControl key={index} fullWidth sx={{ marginBottom: 5 }}>
                                <InputLabel
                                  id={`category-label-${index}`}
                                  error={!selectedCategories[index]}
                                  style={{ color: 'silver' }}
                                >
                                  {index === 0 ? 'Parent Category' : `Subcategory Level ${index}`}
                                </InputLabel>
                                <Select
                                  labelId={`category-label-${index}`}
                                  value={selectedCategories[index] || ''}
                                  onChange={e => handleCategoryChange(index, e.target.value)}
                                  label={index === 0 ? 'Parent Category' : `Subcategory Level ${index}`} // Add the label prop
                                >
                                  {category.children.map(child => (
                                    <MenuItem key={child.guid} value={child.guid}>
                                      {child.title}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            ))}
                          </Grid> */}
                        </CardContent>
                      </Card>
                      <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }} py={3}>
                        <Button size='small' type='submit' variant='contained' disabled={isLoading} sx={{ mr: 2 }}>
                          {isLoading && <CircularProgress color='inherit' size={20} sx={{ mr: 2 }} />}
                          Save Changes
                        </Button>
                        {/* <Button size='large' variant='outlined' color='secondary' onClick={() => {}}>
              Cancel
            </Button> */}
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              </TabPanel>
              <TabPanel value='general_settings' sx={{ marginTop: 10 }}>
                <QuestionGeneralSettings testSettings={testSettings} guid={guid} setFormState={setFormState} />
              </TabPanel>
              <TabPanel value='result_settings' sx={{ marginTop: 10 }}>
                <QuestionResultSettings
                  formState={formState}
                  guid={guid}
                  testSettings={testSettings}
                  setFormState={setFormState}
                />
              </TabPanel>
              <TabPanel value='test_instructions' sx={{ marginTop: 10 }}>
                <QuestionTestInstructions />
              </TabPanel>
              <TabPanel value='weighted_marks' sx={{ marginTop: 10 }}>
                <WeightedMarksSettings />
              </TabPanel>
            </Grid>
          </TabContext>
        </Grid>
      </Grid>
    </>
  )
}

export default EditTest
