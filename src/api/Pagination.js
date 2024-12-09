import React from 'react'

import { Card, CardContent, Typography, Pagination, IconButton, Select, MenuItem, Box } from '@mui/material'

const PaginationCard = ({ rowsPerPage, currentPage, totalPages, onPageChange, onRowsPerPageChange }) => {
  // const handleRowsPerPageChange = event => {
  //   onRowsPerPageChange(event.target.value) // Call the parent handler
  // }

  const handlePageChange = (event, value) => {
    onPageChange(value) // Call the parent handler
  }

  // const handleRowsPerPageChange = event => {
  //   onRowsPerPageChange(event.target.value) // Ensure event is passed correctly
  // }
  const handleRowsPerPageChange = event => {
    // Check if event and event.target are defined
    if (event && event.target) {
      onRowsPerPageChange(event.target.value) // Ensure event is passed correctly
    } else {
      console.error('Event or event.target is undefined')
    }
  }

  return (
    <Card>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Rows per page section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant='body2' sx={{ marginRight: 1 }}>
            Rows per page:
          </Typography>
          <Select value={rowsPerPage} onChange={handleRowsPerPageChange}>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </Box>

        {/* Pagination info section */}
        <Typography variant='body2'>
          {`${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, totalPages * rowsPerPage)} of ${totalPages * rowsPerPage}`}
        </Typography>

        {/* Pagination controls */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant='outlined'
            shape='rounded'
            size='small'
          />
        </Box>
      </CardContent>
    </Card>
  )
}

export default PaginationCard
