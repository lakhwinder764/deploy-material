import { useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Card,
  Button,
  CardHeader,
  TextField,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material'
import OptionMenu from '@core/components/option-menu'

const PendingUsers = ({ pendingUsers, selectedUsers, setSelectedUsers, onDelete, onResend }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  // Handle selecting a single user row
  const handleSelectUser = email => {
    if (selectedUsers?.includes(email)) {
      setSelectedUsers(selectedUsers?.filter(user => user !== email))
    } else {
      setSelectedUsers([...selectedUsers, email])
    }
  }

  // Handle selecting all user rows
  const handleSelectAll = event => {
    if (event.target.checked) {
      setSelectedUsers(pendingUsers?.map(user => user?.email))
    } else {
      setSelectedUsers([])
    }
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Card>
      <CardHeader title='Pending Users' />

      <div className='flex justify-between gap-2 p-2'>
        <div className='flex items-center gap-x-4'>
          {/* Bulk delete button */}
          <Button
            color='secondary'
            onClick={() => onDelete()} // Handle bulk delete
            style={{
              color: '#FFFFFF',
              border: '1px solid #E7E7E7',
              minWidth: '40px',
              paddingLeft: '16px',
              cursor: 'pointer',
              opacity: selectedUsers?.length > 0 ? 1 : 0.5 // Change opacity based on selection
            }}
            disabled={selectedUsers?.length === 0} // Disable if no rows are selected
          >
            <i className='ri-delete-bin-6-line' style={{ color: '#8080808C' }} />
          </Button>
          <Button
            color='secondary'
            style={{
              color: '#FFFFFF',
              border: '1px solid #E7E7E7',
              minWidth: '40px',
              paddingLeft: '16px'
            }}
            onClick={() => onResend(selectedUsers)} // Handle bulk resend
          >
            <i className='ri-checkbox-circle-line' style={{ color: '#8080808C' }} />
          </Button>
        </div>
        <TextField variant='outlined' placeholder='Search by email' size='small' />
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox'>
                <Checkbox
                  checked={selectedUsers?.length === pendingUsers?.length && pendingUsers?.length > 0}
                  onChange={handleSelectAll}
                  indeterminate={selectedUsers?.length > 0 && selectedUsers?.length < pendingUsers?.length}
                />
              </TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingUsers?.map((user, index) => (
              <TableRow key={user?.email || index}>
                <TableCell padding='checkbox'>
                  <Checkbox
                    checked={selectedUsers?.includes(user?.email)}
                    onChange={() => handleSelectUser(user?.email)}
                  />
                </TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell>{user?.role || 'N/A'}</TableCell>
                <TableCell>{user?.date || 'N/A'}</TableCell>
                <TableCell>
                  <IconButton onClick={handleClick}>
                    <i className='text-textSecondary' />
                  </IconButton>

                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    <MenuItem onClick={() => onDelete(user?.email)}>Delete</MenuItem>
                    <MenuItem>Resend</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default PendingUsers
