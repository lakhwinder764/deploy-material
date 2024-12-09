import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'

// import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import { CardHeader, Button, Typography, DividerMenu, Menu, MenuItem } from '@mui/material'

// import DeleteIcon from '@mui/icons-material/Delete'
// import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
// import AddIcon from '@mui/icons-material/Add';
import AddUserDrawer from './AddUserDrawer'
import DialogBox from './DialogBox'

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)
  const router = useRouter()

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, onChange, debounce])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

const TableFilters = ({
  setData,
  tableData,
  handleExpandAll,
  handleCollapseAll,
  selectedQuestions,
  deleteIconActive,
  onDeleteClick
}) => {
  const isDeleteActive = selectedQuestions && selectedQuestions.length > 0
  const [roles, setRoles] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [statuses, setStatuses] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const router = useRouter()

  const handleImportClick = event => {
    // router.push('/question/import') // Replace with the actual path to the import page
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null) // Close the dropdown
  }

  const handleImportFromBank = () => {
    // Implement your logic for importing from the question bank
    console.log('Importing from question bank')
    handleClose()
  }

  const handleImportFromFile = () => {
    router.push('/question/import')
    console.log('Importing from file')
    handleClose()
  }

  // const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleAddQuestion = () => {
    router.push('/test/questions')
  }

  // const handleClose = () => {
  //   setAnchorEl(null)
  // }
  return (
    <>
      <CardContent style={{ paddingBottom: '5px', height: '80px' }}>
        <Grid container spacing={3} alignItems='center'>
          <Grid item xs={6} alignItems='center' style={{ display: 'flex' }}>
            <i
              className='ri-arrow-left-line'
              style={{ color: '#262B43E5' }}

              // onClick={e => handleDeleteClick(e, 1)}
            />
            <Typography style={{ fontWeight: '500', fontSize: '24px', color: '#262B43E5' }}>All Questions</Typography>
          </Grid>
          <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
            <Button
              variant='outlined'
              aria-controls='basic-menu'
              aria-haspopup='true'
              color='secondary'
              onClick={handleImportClick}
              startIcon={
                <i
                  className='ri-download-line'
                  style={{ color: 'silver' }}

                  // onClick={e => handleDeleteClick(e, 1)}
                />
              }
              endIcon={<i className='ri-arrow-down-s-line' style={{ color: 'silver' }} />}
            >
              Import from Question
            </Button>
            <Menu keepMounted id='basic-menu' anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl)}>
              <MenuItem
                onClick={handleImportFromBank}
                sx={{
                  '&:hover': {
                    backgroundColor: 'primary.main', // Change this to your desired primary color
                    color: 'white' // Optional: Change text color on hover
                  }
                }}
              >
                Import from question bank
              </MenuItem>
              <MenuItem
                onClick={handleImportFromFile}
                sx={{
                  '&:hover': {
                    backgroundColor: 'primary.main', // Change this to your desired primary color
                    color: 'white' // Optional: Change text color on hover
                  }
                }}
              >
                Import from file
              </MenuItem>
            </Menu>

            <Button
              style={{ color: '#007AFF', border: '1px solid #007AFF' }}
              onClick={handleAddQuestion}
              // variant='outlined'
              startIcon={
                <i
                  className='ri-add-fill'
                  style={{ color: '#007AFF' }}

                  // onClick={e => handleDeleteClick(e, 1)}
                />
              }
            >
              Add Question
            </Button>
            <Button
              variant='contained'
              onClick={() => setAddUserOpen(!addUserOpen)}
              startIcon={
                <i
                  className='ri-add-fill'
                  style={{ color: 'white' }}

                  // onClick={e => handleDeleteClick(e, 1)}
                />
              }
            >
              Add Section
            </Button>
          </Grid>
          {/* <Grid item xs={12}>
          <FormControl fullWidth sx={{ marginBottom: '10px' }}>
            <CardHeader title='Filter' />
          </FormControl>
        </Grid> */}

          {/* Filter Controls */}
          <Grid item xs={3}>
            <FormControl fullWidth sx={{ paddingLeft: '15px' }}>
              <DebouncedInput
                value={globalFilter ?? ''}
                onChange={value => setGlobalFilter(String(value))}
                placeholder='Search User'
              />
            </FormControl>
          </Grid>
          {/* <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id='role-select-label'>Select Role</InputLabel>
            <Select
              labelId='role-select-label'
              id='select-role'
              multiple
              value={roles}
              onChange={handleRoleChange}
              renderValue={selected => selected.join(', ')}
            >
              {roleOptions.map(role => (
                <MenuItem key={role} value={role}>
                  <Checkbox checked={roles.indexOf(role) > -1} />
                  <ListItemText primary={role.charAt(0).toUpperCase() + role.slice(1)} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid> */}
          {/* <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id='status-select-label'>Select Status</InputLabel>
            <Select
              labelId='status-select-label'
              id='select-status'
              multiple
              value={statuses}
              onChange={handleStatusChange}
              renderValue={selected => selected.join(', ')}
            >
              {statusOptions.map(status => (
                <MenuItem key={status} value={status}>
                  <Checkbox checked={statuses.indexOf(status) > -1} />
                  <ListItemText primary={status.charAt(0).toUpperCase() + status.slice(1)} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>/ */}

          {/* Buttons */}
          {/* <Button
          color='secondary'
          // variant='outlined'
          // className='max-sm:is-full'
          // onClick={e => handleDeleteClick(e, 1)}
          style={{ color: '#FFFFFF', border: '1px solid #E7E7E7', minWidth: '40px', paddingLeft: '16px' }}
        >
          <i
            className='ri-delete-bin-6-line'
            // style={{ color: isAnyRowSelected ? '#007AFF' : '#8080808C' }}
            // onClick={e => handleDeleteClick(e, 1)}
          />
        </Button> */}
          <hr />
          <Grid item xs={4} style={{ display: 'flex', paddingLeft: '15px', gap: '15px' }}>
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
            {/* <Button
            color='secondary'
            // variant='outlined'
            // className='max-sm:is-full'
            // onClick={e => handleDeleteClick(e, 1)}
            style={{ color: '#FFFFFF', border: '1px solid #E7E7E7', minWidth: '40px', paddingLeft: '16px' }}
          >
            <i
              className='ri-drag-move-2-line'
              style={{ color: '#8080808C' }}
              // onClick={e => handleDeleteClick(e, 1)}
            />
          </Button> */}
            {/* <Button variant='outlined' style={{ marginRight: '10px' }} onClick={handleReset}>
            Reset Filter
          </Button> */}
            {/* <Button variant='contained' style={{ backgroundColor: '#7A6AFE', color: '#fff' }}>
            Add Section
          </Button> */}
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
            <Button
              variant='outlined'
              // startIcon={<DragIndicatorIcon />}
              onClick={handleExpandAll}
            >
              Expand All
            </Button>
            <Button variant='outlined' onClick={handleCollapseAll}>
              Collapse All
            </Button>
            {/* <Button
            style={{ color: '#007AFF', border: '1px solid #007AFF' }}
            // variant='outlined'
            startIcon={
              <i
                className='ri-add-fill'
                style={{ color: '#007AFF' }}
                // onClick={e => handleDeleteClick(e, 1)}
              />
            }
          >

            Add Question
          </Button>
          <Button
            variant='contained'
            startIcon={
              <i
                className='ri-add-fill'
                style={{ color: 'white' }}
                // onClick={e => handleDeleteClick(e, 1)}
              />
            }
          >
            Add Section
          </Button> */}
          </Grid>
        </Grid>
      </CardContent>
      <DialogBox
        open={addUserOpen}
        onClose={() => setAddUserOpen(!addUserOpen)}
        // userData={data}
        // setData={setData}
        edit={false}

        // updateUserData={updateUserData}
        // addUserData={addUserData}
      />
    </>
  )
}

export default TableFilters
