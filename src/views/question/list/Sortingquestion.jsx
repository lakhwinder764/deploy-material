import { Menu, MenuItem, IconButton, Checkbox, Typography, Button } from '@mui/material'
import React, { useState } from 'react'

const Sortingquestion = ({ onSortChange }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  // State to manage checkbox selections
  const [sortOptions, setSortOptions] = useState({
    creationDateAsc: false,
    creationDateDesc: false,
    questionAsc: false,
    questionDesc: false
  })

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSortChange = sortType => {
    // Update the checkbox state based on the selected sort type
    setSortOptions(prev => ({
      creationDateAsc: sortType === 'creation_date_asc' ? !prev.creationDateAsc : prev.creationDateAsc,
      creationDateDesc: sortType === 'creation_date_desc' ? !prev.creationDateDesc : prev.creationDateDesc,
      questionAsc: sortType === 'question_asc' ? !prev.questionAsc : prev.questionAsc,
      questionDesc: sortType === 'question_desc' ? !prev.questionDesc : prev.questionDesc
    }))

    onSortChange(sortType)
    handleClose()
  }

  return (
    <>
      <Button
        aria-controls='options-menu'
        aria-haspopup='true'
        variant='outlined'
        color='secondary'
        onClick={handleClick}
        endIcon={<i class='ri-arrow-down-s-line' />}
      >
        Sort Question
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleSortChange('creation_date_asc')}>
          <Checkbox checked={sortOptions.creationDateAsc} />
          Creation Date Ascending
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('creation_date_desc')}>
          <Checkbox checked={sortOptions.creationDateDesc} />
          Creation Date Descending
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('question_asc')}>
          <Checkbox checked={sortOptions.questionAsc} />
          Question Ascending
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('question_desc')}>
          <Checkbox checked={sortOptions.questionDesc} />
          Question Descending
        </MenuItem>
      </Menu>
    </>
  )
}

export default Sortingquestion
