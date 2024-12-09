import { useState, useEffect } from 'react'

import {
  Checkbox,
  MenuItem,
  Select,
  ListItemText,
  FormControl,
  InputLabel,
  CardContent,
  Grid,
  TextField,
  Typography
} from '@mui/material'

import useUserApi from '@/api/useUserApi'

const TableFilters = ({ setData, tableData }) => {
  // States
  const { data: userData } = useUserApi() // Fetch user data from API
  const [selectedRoles, setSelectedRoles] = useState([]) // Store selected roles
  const [roles, setRoles] = useState([]) // Store roles dynamically derived from the API
  const [selectedStatuses, setSelectedStatuses] = useState([]) // Store selected statuses
  const statusOptions = ['active', 'inactive', 'pending'] // Status options
  const [searchTerm, setSearchTerm] = useState('') // State for the search box

  // Extract unique roles from user data
  useEffect(() => {
    if (userData?.length > 0) {
      const uniqueRoles = [...new Set(userData?.map(user => user?.role))] // Get unique roles

      setRoles(uniqueRoles)
    }
  }, [userData])

  // Filter data based on search term, selected roles, and statuses
  useEffect(() => {
    const filteredData = tableData?.filter(user => {
      // Filter by search term (by username)
      if (searchTerm && (!user?.username || !user?.username?.toLowerCase()?.includes(searchTerm?.toLowerCase()))) {
        return false
      }

      // Filter by selected roles
      if (selectedRoles?.length > 0 && !selectedRoles?.includes(user?.role)) return false

      // Normalize user status and compare with selectedStatuses
      const userStatus =
        user?.status === '1'
          ? 'active'
          : user?.status === '0'
            ? 'inactive'
            : user?.status === ''
              ? 'pending'
              : 'unknown'

      if (selectedStatuses?.length > 0 && !selectedStatuses?.includes(userStatus?.toLowerCase())) {
        return false
      }

      return true
    })

    setData(filteredData || [])
  }, [searchTerm, selectedRoles, selectedStatuses, tableData, setData])

  // Handle role selection
  const handleRoleChange = event => {
    const { value } = event.target

    setSelectedRoles(typeof value === 'string' ? value?.split(',') : value) // Allow multiple selection
  }

  // Handle status selection
  const handleStatusChange = event => {
    const { value } = event.target

    setSelectedStatuses(typeof value === 'string' ? value?.split(',') : value) // Allow multiple selection
  }

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedRoles([])
    setSelectedStatuses([])
  }

  // Capitalize the first letter of each word
  const capitalizeFirstLetter = string => string?.charAt(0)?.toUpperCase() + string?.slice(1)

  return (
    <CardContent>
      <Grid container spacing={2} alignItems='center' justifyContent='space-between'>
        {/* Search filter */}
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            id='search-user'
            label='Search User'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder='Enter user name'
          />
        </Grid>

        {/* Role filter */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id='role-select'>Select Role</InputLabel>
            <Select
              labelId='role-select'
              id='select-role'
              label='Select Roles'
              multiple
              value={selectedRoles}
              onChange={handleRoleChange}
              renderValue={selected => selected?.join(', ')} // Show selected roles
            >
              {roles?.map(role => (
                <MenuItem key={role} value={role}>
                  <Checkbox checked={selectedRoles?.indexOf(role) > -1} />
                  <ListItemText primary={capitalizeFirstLetter(role)} /> {/* Capitalize first letter */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Status filter */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id='status-select'>Select Status</InputLabel>
            <Select
              labelId='status-select'
              id='select-status'
              label='Select Status'
              multiple
              value={selectedStatuses}
              onChange={handleStatusChange}
              renderValue={selected => selected?.join(', ')} // Show selected statuses
            >
              {statusOptions?.map(status => (
                <MenuItem key={status} value={status}>
                  <Checkbox checked={selectedStatuses?.indexOf(status) > -1} />
                  <ListItemText primary={capitalizeFirstLetter(status)} /> {/* Capitalize first letter */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Reset Filter */}
        <Grid item xs={12} sm={2}>
          <Typography
            style={{
              cursor: 'pointer',
              color: 'red',
              textAlign: 'center',
              marginTop: '8px',
              textDecoration: 'underline'
            }}
            onClick={handleResetFilters}
          >
            Reset Filters
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
