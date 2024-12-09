'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  MenuItem,
  InputLabel,
  Select
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

import useCategoryApi from '@/api/useCategoryApi'

const EditCategory = ({ isLoading = false }) => {
  const [categories, setCategories] = useState([{ parent: null, children: [] }])
  const [selectedCategories, setSelectedCategories] = useState([])
  const searchParams = useSearchParams()
  const guid = searchParams.get('guid')
  const router = useRouter()
  const [routing, setRouting] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()
  const { data, viewCategory, updateCategoryData } = useCategoryApi()

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

  // Initialize category hierarchy on component load
  useEffect(() => {
    if (guid) {
      viewCategory(guid).then(res => {
        const category = res?.data?.payload[0]
        const selectedGuids = []
        let currentCategory = category

        // Build hierarchy path from the selected category
        while (currentCategory) {
          selectedGuids.unshift(currentCategory.guid)
          currentCategory = findCategoryByGuid(currentCategory.parent_guid, data)
        }

        setSelectedCategories(selectedGuids)

        // Build dropdown options for each level
        const initialCategories = [{ parent: null, children: data }]
        selectedGuids.forEach((selectedGuid, index) => {
          const selectedCategory = findCategoryByGuid(selectedGuid, initialCategories[index]?.children || [])
          if (selectedCategory?.children?.length) {
            initialCategories.push({
              parent: selectedGuid,
              children: selectedCategory.children
            })
          }
        })

        setCategories(initialCategories)
        reset({
          title: category.title,
          parent_guid: category.parent_guid
        })
      })
    }
  }, [guid, reset, data])

  // Handle category selection at each level
  const handleCategoryChange = (level, selectedGuid) => {
    const updatedSelectedCategories = [...selectedCategories]
    updatedSelectedCategories[level] = selectedGuid
    updatedSelectedCategories.splice(level + 1)
    setSelectedCategories(updatedSelectedCategories)

    const selectedCategory = findCategoryByGuid(selectedGuid, data)

    if (selectedCategory?.children?.length) {
      setCategories(prev =>
        prev.slice(0, level + 1).concat({
          parent: selectedGuid,
          children: selectedCategory.children
        })
      )
    } else {
      setCategories(prev => prev.slice(0, level + 1))
    }
  }

  const handleFormSubmit = async formData => {
    updateCategoryData(guid, { ...formData, parent_guid: selectedCategories[selectedCategories.length - 1] })
    setRouting(true)
  }

  if (routing) {
    router.push('/categories/list')
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Typography variant='h5'>Edit Category</Typography>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name='title'
                    control={control}
                    rules={{ required: 'Title is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={'Title'}
                        fullWidth
                        error={!!errors.title}
                        // helperText={errors.title?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name='details'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Description'
                        fullWidth
                        multiline
                        rows={4}
                        error={!!errors.details}
                        helperText={errors.details?.message}
                      />
                    )}
                  />
                </Grid>
                {categories.map((category, index) => (
                  <Grid item xs={12} key={index}>
                    <FormControl fullWidth>
                      <InputLabel id={`category-label-${index}`}>
                        {index === 0 ? 'Parent Category' : `Subcategory Level ${index}`}
                      </InputLabel>
                      <Select
                        labelId={`category-label-${index}`}
                        value={selectedCategories[index] || ''}
                        onChange={e => handleCategoryChange(index, e.target.value)}
                      >
                        {category.children.map(child => (
                          <MenuItem key={child.guid} value={child.guid}>
                            {child.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button type='submit' variant='contained' disabled={isLoading}>
                    {isLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  )
}

export default EditCategory
