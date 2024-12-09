import React, { useState, useEffect } from 'react'

// import useQuestionApi from '@/api/useQuestionApi'
import { useRouter } from 'next/navigation'

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

import Sortingquestion from './Sortingquestion'
import SortingType from './SortingType'

// import Router, { withRouter } from 'next/router'
// import { useRouter } from 'next/router'
import useCategoryApi from '@/api/useCategoryApi'
import ExportPopup from './ExportPopup'
import TestListTable from '../selectcategory/TestListTable'
import TestList from './TestList'
import useTestApi from '@/api/useTestApi'
import useQuestionApi from '@/api/useQuestionApi'
import useQuestionModuleApi from '@/api/useQuestionModuleApi'

// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
const CategoryItem = ({ category, handleCategoryClick, clickedCategories, handleCategoryTitle }) => {
  // Check if the category is clicked and should display subcategories
  const isCategoryClicked = clickedCategories.includes(category.id)

  console.log(category.title, 'categorytitle')

  return (
    <li
      className='category-item'

      // onClick={() => handleCategoryTitle(category.id)}
    >
      <button
        className='category-button'
        onClick={e => {
          // e.stopPropagation() // Prevents the event from bubbling up unnecessarily
          handleCategoryTitle(category) // Call the function to update the selected category
          // handleCategoryClick(category.id) // Expand/collapse subcategories
        }}
      >
        {category.title}
        {/* Render the icon only if the category has children */}
        {category.children && category.children.length > 0 && (
          <span className='icon' onMouseOver={() => handleCategoryClick(category.id)}>
            &#9656;
          </span>
        )}
      </button>

      {/* Render the subcategory dropdown if the category is clicked */}
      {isCategoryClicked && category.children && category.children.length > 0 && (
        <ul className='subcategory-dropdown'>
          {category.children.map(subCategory => (
            <CategoryItem
              key={subCategory.id}
              category={subCategory}
              handleCategoryClick={handleCategoryClick}
              clickedCategories={clickedCategories} // Pass the updated clicked categories
              handleCategoryTitle={handleCategoryTitle} // Pass as subcategory
            />
          ))}
        </ul>
      )}
    </li>
  )
}

const Topcard = ({
  handleStatusToggle,
  handleSortChange,
  onDeleteClick,
  deleteIconActive,
  searchKeyword,
  handleSearch,
  importanceData,
  showCorrectAnswer,
  setShowCorrectAnswer,
  showCategory,
  setShowCategory,
  showFields,
  setShowFields,
  categories,
  selectedQuestions,
  setCategories,
  selectedCategory,
  setSelectedCategory,
  handleCategoryTitle,
  handleCategoryChange,
  isDropdownOpen,
  trashDatalength,
  showAllQuestion,

  // Sortingquestion,
  setIsDropdownOpen,
  handleDropdownToggle,
  handleCategoryClick,
  clickedCategories,
  allquestionlength,
  trash,
  onResetClick,
  handleSelectAllClick,
  handleNextPage,
  handlePrevPage,
  currentPage,
  totalPages,
  handleFilterChange,
  selectedFilters,
  setSelectedFilters,
  handleDifficultchange,
  difficultData,
  setDifficultSelect,
  difficultSelect

  // handleCategoryClick
}) => {
  const [anchorElOptions, setAnchorElOptions] = React.useState(null)
  const [anchorElSort, setAnchorElSort] = React.useState(null)
  const [searchValue, setSearchValue] = React.useState('')

  const [sortOptions, setSortOptions] = useState({
    creationAsc: false,
    creationDesc: false,
    questionAsc: false,
    questionDesc: false,
    multipleChoice: false,
    trueFalse: false
  })

  console.log(difficultData, 'checkimportance')
  const [isFilterActive, setIsFilterActive] = useState(false)
  const { data } = useCategoryApi()
  const { fetchTestData, testData, addQuestionInTest } = useQuestionModuleApi()

  // const router = useRouter()
  useEffect(() => {
    const hasActiveFilter = searchKeyword || Object.values(sortOptions).some(option => option)

    setIsFilterActive(hasActiveFilter)
  }, [searchKeyword, sortOptions])
  useEffect(() => {
    const savedShowCorrectAnswer = localStorage.getItem('showCorrectAnswer')

    if (savedShowCorrectAnswer !== null) {
      setShowCorrectAnswer(JSON.parse(savedShowCorrectAnswer)) // Parse the string as boolean
    }
  }, [setShowCorrectAnswer])
  useEffect(() => {
    fetchTestData()
  }, [])

  // Save the "showCorrectAnswer" state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('showCorrectAnswer', JSON.stringify(showCorrectAnswer))
  }, [showCorrectAnswer])

  const handleOptionsClick = event => {
    setAnchorElOptions(event.currentTarget)
  }

  const router = useRouter()

  const handleSortClick = event => {
    setAnchorElSort(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorElOptions(null)
    setAnchorElSort(null)
  }

  const handleCheckboxChange = event => {
    const { name, checked } = event.target

    setSortOptions(prevOptions => ({
      ...prevOptions,
      [name]: checked // Only update the checkbox clicked
    }))
  }

  const handleShowCorrectAnswerChange = () => {
    setShowCorrectAnswer(prev => !prev) // Toggle the value of showCorrectAnswer
  }

  const handleShowCategoryChange = () => {
    setShowCategory(prev => !prev) // Toggle the value of showCorrectAnswer
  }

  const handleShowFieldChange = () => {
    setShowFields(prev => !prev) // Toggle the value of showCorrectAnswer
  }

  const handleResetFilters = () => {
    setSearchValue('')
    setSortOptions({
      creationAsc: false,
      creationDesc: false,
      questionAsc: false,
      questionDesc: false,
      multipleChoice: false,
      trueFalse: false
    })
    handleSearch({ target: { value: '' } })
  }

  const handleImport = () => {
    router.push('/question/selectcategory')
  }

  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const handleOpenPopup = () => setIsPopupOpen(true)
  const handleClosePopup = () => setIsPopupOpen(false)

  const handleExport = format => {
    console.log(`Exporting in ${format} format`)

    // Add your export logic here
    setIsPopupOpen(false)
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const [anchorE2, setAnchorE2] = useState(null)

  // const [selectedFilters, setSelectedFilters] = useState([])

  const open = Boolean(anchorEl)
  const open2 = Boolean(anchorE2)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClick2 = event => {
    setAnchorE2(event.currentTarget)
  }

  const handleClosex = () => {
    setAnchorEl(null)
    setAnchorE2(null)
  }

  const [modalOpen, setModalOpen] = useState(false)

  const handleOpenModal = () => {
    if (deleteIconActive) {
      setModalOpen(true)
    }
  }

  const handleCloseModal = () => setModalOpen(false)

  // const handleFilterChange = filter => {
  //   setSelectedFilters(prev => (prev.includes(filter) ? prev.filter(item => item !== filter) : [...prev, filter]))
  // }

  console.log(selectedFilters, 'sec123')

  // const difficultyFilters = ['Low', 'Medium', 'High']

  const importanceFilters = ['Low', 'Medium', 'High']

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
        <Grid item xs={12} md={2}>
          <div className='dropdown-container' style={{ height: '40px' }}>
            <div className='dropdown-toggle' onClick={handleDropdownToggle}>
              {selectedCategory}
            </div>
            {isDropdownOpen && (
              <ul className='category-dropdown'>
                {data.map(category => (
                  <CategoryItem
                    key={category.id}
                    category={category}
                    // handleMouseEnter={handleMouseEnter}
                    // handleMouseLeave={handleMouseLeave}
                    // hoveredCategory={hoveredCategory}
                    handleCategoryClick={handleCategoryClick}
                    clickedCategories={clickedCategories}
                    handleCategoryTitle={handleCategoryTitle}
                  />
                ))}
              </ul>
            )}
          </div>
        </Grid>
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
        <Grid
          item
          xs={12}
          md={7}
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
          <Box display='flex' alignItems='center' justifyContent='flex-end' flexWrap='wrap' gap={2}>
            {/* <FormControl variant='outlined' sx={{ minWidth: 90 }}>
              <InputLabel>Type</InputLabel>
              <Select label='Type' onClick={handleSortClick}>
                <MenuItem onClick={handleClose} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    name='multipleChoice'
                    checked={sortOptions.multipleChoice}
                    onChange={handleCheckboxChange}
                  />
                  Multiple Choice
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox name='trueFalse' checked={sortOptions.trueFalse} onChange={handleCheckboxChange} />
                  True/False
                </MenuItem>
              </Select>
            </FormControl> */}
            {/* <Box display='flex' alignItems='center' flexWrap='wrap' gap={2} sx={{ ml: 2 }}> */}
            {/* Difficulty Filter */}

            <Button
              variant='outlined'
              color='secondary'
              onClick={handleClick2}
              style={{ textTransform: 'none', margin: '8px 0' }}
              endIcon={<i class='ri-arrow-down-s-line'></i>}
            >
              Difficulty
            </Button>
            <Menu anchorEl={anchorE2} open={open2} onClose={handleClosex}>
              {difficultData?.map(filter => (
                <MenuItem key={filter} onClick={() => handleDifficultchange(filter.guid)}>
                  <Checkbox checked={difficultSelect.includes(filter.title)} />
                  <ListItemText primary={filter.title} />
                </MenuItem>
              ))}
            </Menu>

            {/* Importance Filter */}
            {/* <Typography style={{ marginTop: '16px' }}></Typography> */}
            <Button
              variant='outlined'
              color='secondary'
              onClick={handleClick}
              style={{ textTransform: 'none', margin: '8px 0' }}
              endIcon={<i class='ri-arrow-down-s-line'></i>}
            >
              Importance
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClosex}>
              {importanceData?.map(filter => {
                console.log('Current filter:', filter) // Log each filter

                return (
                  <MenuItem key={filter.title} onClick={() => handleFilterChange(filter.guid)}>
                    <Checkbox checked={selectedFilters.includes(filter.guid)} />
                    <ListItemText primary={filter.title} />
                  </MenuItem>
                )
              })}
            </Menu>
            <SortingType onSortChange={handleSortChange} />

            {/* <Button variant='contained' color='primary'> */}
            <Button
              aria-controls='options-menu'
              aria-haspopup='true'
              variant='outlined'
              color='secondary'
              onClick={handleClick}
              endIcon={<i class='ri-arrow-down-s-line' />}
            >
              Test
            </Button>
            <Menu id='options-menu' anchorEl={anchorElOptions} open={Boolean(anchorElOptions)} onClose={handleClose}>
              <MenuItem onClick={handleShowCorrectAnswerChange}>
                <Checkbox /> General Knoledge test
              </MenuItem>
              <MenuItem>
                <Checkbox /> Science Test
              </MenuItem>
              <MenuItem>
                <Checkbox /> Maths Test
              </MenuItem>
              <MenuItem>
                <Checkbox /> English Test
              </MenuItem>
            </Menu>
            {/* </Box> */}
            {/* </Button> */}
            {isFilterActive && (
              <Button variant='text' color='error' onClick={handleResetFilters}>
                Reset Filter
              </Button>
            )}
          </Box>
        </Grid>

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
              {trash && (
                <Button
                  color='secondary'
                  // variant='outlined'
                  // className='max-sm:is-full'
                  // onClick={e => handleDeleteClick(e, 1)}
                  style={{ color: '#FFFFFF', border: '1px solid #E7E7E7', minWidth: '40px' }}
                  onClick={onResetClick}
                >
                  <i
                    className='ri-reset-left-line'
                    // style={{ color: '#8080808C' }}
                    style={{ color: deleteIconActive ? '#007AFF' : '#8080808C' }}

                    // onClick={e => handleDeleteClick(e, 1)}
                  />
                </Button>
              )}
              {!trash && (
                <>
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    className='hover-container'
                    style={{ position: 'relative', width: '40px', height: '40px' }}
                    onClick={handleSelectAllClick}
                  >
                    {/* <i className='ri-menu-add-line' style={{ fontSize: '24px' }} /> */}
                    <i class='ri-checkbox-multiple-line' style={{ fontSize: '24px' }} />
                    <span className='hover-text'>Select All</span>
                  </Box>
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    className='hover-container'
                    style={{ position: 'relative', width: '40px', height: '40px' }}
                    onClick={handleOpenModal}
                  >
                    <i
                      className='ri-menu-add-line'
                      style={{ fontSize: '24px', color: deleteIconActive ? '#007AFF' : '#8080808C' }}
                    />
                    <span className='hover-text'>Add in Test</span>
                  </Box>

                  {/* Import */}
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    className='hover-container'
                    style={{ position: 'relative', width: '40px', height: '40px' }}
                  >
                    <i className='ri-download-2-line' style={{ fontSize: '24px' }} onClick={handleImport} />
                    <span className='hover-text'>Import</span>
                  </Box>

                  {/* Export */}
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    className='hover-container'
                    style={{ position: 'relative', width: '40px', height: '40px' }}
                  >
                    <i className='ri-upload-2-line' style={{ fontSize: '24px' }} onClick={handleOpenPopup} />
                    <span className='hover-text'>Export</span>
                  </Box>
                  <ExportPopup open={isPopupOpen} onClose={handleClosePopup} onExport={handleExport} />
                </>
              )}
            </Box>

            <Box display='flex' alignItems='center' flexWrap='wrap' gap={2}>
              {/* Options Dropdown */}
              <Button
                aria-controls='options-menu'
                aria-haspopup='true'
                variant='outlined'
                color='secondary'
                onClick={handleOptionsClick}
                endIcon={<i class='ri-arrow-down-s-line' />}
              >
                Options
              </Button>
              <Menu id='options-menu' anchorEl={anchorElOptions} open={Boolean(anchorElOptions)} onClose={handleClose}>
                <MenuItem onClick={handleShowCorrectAnswerChange}>
                  <Checkbox checked={showCorrectAnswer} /> Show Correct Answers
                </MenuItem>
                <MenuItem>
                  <Checkbox /> Show Test Name
                </MenuItem>
                <MenuItem onClick={handleShowCategoryChange}>
                  <Checkbox checked={showCategory} /> Show Category
                </MenuItem>
                <MenuItem onClick={handleShowFieldChange}>
                  <Checkbox checked={showFields} /> Show Marks, Negative Marks, Time
                </MenuItem>
              </Menu>

              {/* Sort Questions Dropdown */}
              {/* <FormControl variant='outlined' sx={{ minWidth: 120 }}>
                <InputLabel>Sort Questions</InputLabel>
                <Select
                  label='Sort Questions'
                  onClick={handleSortClick}
                  // IconComponent={ArrowDropDownIcon}
                >
                  <MenuItem onClick={handleClose} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox name='creationAsc' checked={sortOptions.creationAsc} onChange={handleCheckboxChange} />
                    Creation Date Ascending
                  </MenuItem>
                  <MenuItem onClick={handleClose} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox name='creationDesc' checked={sortOptions.creationDesc} onChange={handleCheckboxChange} />
                    Creation Date Descending
                  </MenuItem>
                  <MenuItem onClick={handleClose} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox name='questionAsc' checked={sortOptions.questionAsc} onChange={handleCheckboxChange} />
                    Question Ascending
                  </MenuItem>
                  <MenuItem onClick={handleClose} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox name='questionDesc' checked={sortOptions.questionDesc} onChange={handleCheckboxChange} />
                    Question Descending
                  </MenuItem>
                </Select>
              </FormControl> */}
              <Sortingquestion onSortChange={handleSortChange} />
              {/* Reset Filter Button */}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='flex-end'
            className='hover-container'
            style={{ position: 'relative', padding: '8px' }}
          >
            <div className='pagination-controls' style={{ marginRight: '20px' }}>
              <Button
                variant='outlined'
                onClick={handlePrevPage}
                color='secondary'
                sx={{ height: '30px' }}
                disabled={currentPage === 1}
              >
                <i class='ri-arrow-left-s-line'></i>
              </Button>
              <Button
                variant='outlined'
                onClick={handleNextPage}
                color='secondary'
                sx={{ height: '30px' }}
                disabled={currentPage === totalPages}
              >
                <i class='ri-arrow-right-s-line'></i>
              </Button>
            </div>
            <Typography onClick={showAllQuestion} style={{ marginRight: '20px' }}>
              Show All
            </Typography>
            <Typography
              onClick={() => handleStatusToggle('active')}
              style={{ marginRight: '20px' }} // Add spacing between the elements
            >
              Active {allquestionlength}
            </Typography>
            <Typography onClick={() => handleStatusToggle('trash')}>Trash {trashDatalength}</Typography>
          </Box>
        </Grid>
        <Dialog
          open={modalOpen}
          onClose={handleCloseModal}
          maxWidth='lg'
          fullWidth
          // sx={{ ml: 8 }}
          style={{ marginLeft: '200px' }}
        >
          <DialogTitle>Test List</DialogTitle>
          <DialogContent>
            <TestList
              tableData={testData}
              selectedFilters={selectedFilters}
              selectedQuestions={selectedQuestions}
              addQuestionInTest={addQuestionInTest}

              // tableData={tableData}
              // addUserData={addUserData}
              // deleteUserData={deleteUserData}
              // categories={categories}
              // getCategories={getCategories}
            />
          </DialogContent>
        </Dialog>
      </Grid>
    </>

    // </Card>
  )
}

export default Topcard
