import React, { useState, useEffect } from 'react'

// import useQuestionApi from '@/api/useQuestionApi'
import {
  Card,
  Box,
  Button,
  TextField,
  Checkbox,
  Typography,
  Menu,
  MenuItem,
  Grid,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material'

// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

const TopcardTest = ({
  onDeleteClick,
  deleteIconActive,
  searchKeyword,
  handleSearch

  // handleCategoryClick
}) => {
  // const [searchValue, setSearchValue] = React.useState('')

  const [isFilterActive, setIsFilterActive] = useState(false)

  // const router = useRouter()
  //   useEffect(() => {
  //     const hasActiveFilter = searchKeyword || Object.values(sortOptions).some(option => option)
  //     setIsFilterActive(hasActiveFilter)
  //   }, [searchKeyword])

  const handleImport = () => {
    router.push('/question/selectcategory')
  }

  return (
    // <Card
    //   sx={{
    //     padding: '20px',
    //     borderRadius: '15px',
    //     border: '1px solid #d3d3d3',
    //     boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    //     width: '100%',
    //     marginBottom: '20px',
    //     boxSizing: 'border-box'
    //   }}
    // >
    <>
      <Grid item xs={3}>
        <Typography fontWeight='bold' fontSize={18}>
          Filter
        </Typography>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 4 }}>
        {/* Row 1: Search Input */}

        <Grid item xs={12} md={3}>
          <TextField
            sx={{
              '& .MuiInputBase-root': {
                height: '40px',
                minHeight: 'auto'
              },
              '& .MuiInputLabel-root': {
                top: '-7px'
              }
            }}
            // variant='outlined'
            placeholder='Search'
            fullWidth
            value={searchKeyword}
            onChange={handleSearch}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <i className='ri-search-line' style={{ color: '#262B4366' }} />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        {/* Row 1: Action Buttons */}

        {/* Row 2: Options and Sort Questions */}
        <Grid item xs={12}>
          <Box display='flex' justifyContent='space-between' alignItems='center' flexWrap='wrap'>
            <Box display='flex' gap={1}>
              <Button
                color='secondary'
                // variant='outlined'
                // className='max-sm:is-full'
                // onClick={e => handleDeleteClick(e, 1)}
                style={{ color: '#FFFFFF', border: '1px solid #E7E7E7', minWidth: '40px' }}
                onClick={onDeleteClick}
              >
                <i
                  className='ri-delete-bin-6-line'
                  // style={{ color: '#8080808C' }}
                  style={{ color: deleteIconActive ? '#007AFF' : '#8080808C' }}

                  // onClick={e => handleDeleteClick(e, 1)}
                />
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>

    // </Card>
  )
}

export default TopcardTest
