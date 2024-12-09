import React, { useState } from 'react'

import { Menu, MenuItem, IconButton, Checkbox, Typography, Button } from '@mui/material'

const SortingEnrollments = ({ onSortChange }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  // State to manage checkbox selections
  const [sortOptions, setSortOptions] = useState({
    startDateAsc: false,
    startDateDesc: false,
    endDateAsc: false,
    endDateDesc: false
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
      startDateAsc: sortType === 'start_date_asc' ? !prev.startDateAsc : prev.startDateAsc,
      startDateDesc: sortType === 'start_date_desc' ? !prev.startDateDesc : prev.startDateDesc,
      endDateAsc: sortType === 'end_date_asc' ? !prev.endDateAsc : prev.endDateAsc,
      endDateDesc: sortType === 'end_date_desc' ? !prev.endDateDesc : prev.endDateDesc
    }))

    onSortChange(sortType)
    handleClose()
  }

  return (
    <>
      <Button
        aria-controls='options-menu'
        aria-haspopup='true'
        onClick={handleClick}
        endIcon={<i class='ri-arrow-down-s-line' />}
        disableRipple
        variant='text'
      >
        Sort Enrollments
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleSortChange('start_date_asc')}>
          <Checkbox checked={sortOptions.startDateAsc} />
          Start Date Ascending
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('start_date_desc')}>
          <Checkbox checked={sortOptions.startDateDesc} />
          Start Date Descending
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('end_date_asc')}>
          <Checkbox checked={sortOptions.endDateAsc} />
          End Date Ascending
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('end_date_desc')}>
          <Checkbox checked={sortOptions.endDateDesc} />
          End Date Descending
        </MenuItem>
      </Menu>
    </>
  )
}

export default SortingEnrollments
