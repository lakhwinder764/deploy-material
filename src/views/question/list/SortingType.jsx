import { Menu, MenuItem, IconButton, Checkbox, Typography, Button } from '@mui/material'
import React, { useState } from 'react'

const SortingType = ({ onSortChange }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  // State to manage checkbox selections
  const [sortOptions, setSortOptions] = useState({
    multipleChoice: false,
    trueFalse: false
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
      multipleChoice: sortType === 'multiple_choice_question' ? !prev.multipleChoice : prev.multipleChoice,
      trueFalse: sortType === 'true_false' ? !prev.trueFalse : prev.trueFalse
      //   questionAsc: sortType === 'question_asc' ? !prev.questionAsc : prev.questionAsc,
      //   questionDesc: sortType === 'question_desc' ? !prev.questionDesc : prev.questionDesc
    }))

    onSortChange(sortType)
    handleClose()
  }
  return (
    <>
      <Button
        // style={{ border: 'none' }}
        aria-controls='options-menu'
        aria-haspopup='true'
        variant='outlined'
        color='secondary'
        // color='secondary'
        onClick={handleClick}
        endIcon={<i class='ri-arrow-down-s-line' />}
        // sx={{ ml: 3 }}
      >
        Type
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleSortChange('multiple_choice_question')}>
          <Checkbox checked={sortOptions.multipleChoice} />
          MCQ's
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('true_false')}>
          <Checkbox checked={sortOptions.trueFalse} />
          True False
        </MenuItem>
        {/* <MenuItem onClick={() => handleSortChange('question_asc')}>
          <Checkbox checked={sortOptions.questionAsc} />
          Question Ascending
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('question_desc')}>
          <Checkbox checked={sortOptions.questionDesc} />
          Question Descending
        </MenuItem> */}
      </Menu>
    </>
  )
}

export default SortingType
