'use client'
import { useEffect, useState, useMemo, useCallback } from 'react'

// React Imports

// Next Imports
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import InputLabel from '@mui/material/InputLabel'
import CircularProgress from '@mui/material/CircularProgress'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import { Menu, MenuItem } from '@mui/material'

import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

import OptionMenu from '@core/components/option-menu'

import CustomAvatar from '@core/components/mui/Avatar'

import DialogBoxComponent from './DialogBoxComponent'
import useUserApi from '@/api/useUserApi'
import useDraggableList from './useDraggableList'

// Component Imports
import TableFilters from './TableFilters'
import AddUserDrawer from './AddUserDrawer'

import { getInitials } from '@/utils/getInitials'

// import { getLocalizedUrl } from '@/Utils/i18n'
import '../../style/styles.css'
import tableStyles from '@core/styles/table.module.css'

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// Vars

const userStatusObj = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// Column Definitions
const columnHelper = createColumnHelper()

const UserListTable = ({ tableData }) => {
  // const router = useRouter()
  // States
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState(null) // Track the selected user
  const [selectedStatus, setSelectedStatus] = useState('') // Track the status in the select dropdown

  const statusOptions = ['active', 'inactive', 'pending'] // Define status options

  // Function to open dialog and initialize the selected user's status
  const handleOpenStatusDialog = user => {
    setSelectedUser(user)
    setSelectedStatus(user?.status) // Initialize the status with the user's current status
    setOpenStatusDialog(true)
  }

  // Function to close the dialog
  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false)
  }

  const [selectedRole, setSelectedRole] = useState('') // Track the status in the select dropdown
  const [openRoleDialog, setOpenRoleDialog] = useState(false) // Track dialog open/close
  const RoleOptions = ['admin', 'student', 'teacher'] // Define status options

  // Function to open dialog and initialize the selected user's status
  const handleOpenRoleDialog = user => {
    setSelectedUser(user)
    setSelectedRole(user?.status) // Initialize the status with the user's current status
    setOpenRoleDialog(true)
  }

  // Function to close the dialog
  const handleCloseRoleDialog = () => {
    setOpenRoleDialog(false)
  }

  const { loader, setLoader } = useUserApi()
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [showFilter, setShowFilter] = useState(false) // Managing filter visibility

  const [visibleColumns, setVisibleColumns] = useState({
    user: true,
    email: true,
    role: true,
    status: true,
    phone: false
  })

  //showing rows

  const initialColumns = ['select', 'user', 'email', 'role', 'status', 'phone', 'action']
  const [open, setOpen] = useState(false) // State for delete confirmation dialog
  const [userToDelete, setUserToDelete] = useState(null) // State for the user s
  const [newStatus, setNewStatus] = useState('')
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openStatusDialog, setOpenStatusDialog] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const roleOptions = ['admin', 'user', 'student']

  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false)

  const handleChangeStatus = event => setSelectedStatus(event.target.value)
  const handleChangeRole = event => setSelectedRole(event.target.value)

  const { items: columnOrder, handleDragOver, handleDrop, handleDragStart } = useDraggableList(initialColumns)

  const handleDeleteConfirm = () => {
    // Delete logic here
    handleCloseDeleteDialog()
  }

  const handleSaveStatus = () => {
    // Save status logic here
    handleCloseStatusDialog()
  }

  const handleSaveRole = () => {
    // Save role logic here
    handleCloseRoleDialog()
  }

  // Function to confirm status change
  const handleConfirmStatusChange = () => {
    if (selectedUser) {
      console.log(`User ${selectedUser?.fullName} status changed to ${newStatus}`)
    }

    handleCloseStatusDialog()
  }

  const handleDragEnd = useCallback((fromIndex, toIndex) => {
    setColumnOrder(prevOrder => {
      const newOrder = [...prevOrder]
      const [removed] = newOrder?.splice(fromIndex, 1)

      newOrder?.splice(toIndex, 0, removed)

      return newOrder
    })
  }, [])

  useEffect(() => {
    setData(tableData)
  }, [tableData])

  const FilterDropdown = () => (
    <div className='filter-dropdown'>
      <div className='filter-field'>
        <input
          type='checkbox'
          id='user'
          checked={visibleColumns?.user}
          onChange={() => setVisibleColumns(prev => ({ ...prev, user: !prev?.user }))}
        />
        <label htmlFor='user'>User</label>
      </div>
      <div className='filter-field'>
        <input
          type='checkbox'
          id='email'
          checked={visibleColumns?.email}
          onChange={() => setVisibleColumns(prev => ({ ...prev, email: !prev?.email }))}
        />
        <label htmlFor='email'>Email</label>
      </div>
      <div className='filter-field'>
        <input
          type='checkbox'
          id='role'
          checked={visibleColumns?.role}
          onChange={() => setVisibleColumns(prev => ({ ...prev, role: !prev?.role }))}
        />
        <label htmlFor='role'>Role</label>
      </div>
      <div className='filter-field'>
        <input
          type='checkbox'
          id='status'
          checked={visibleColumns?.status}
          onChange={() => setVisibleColumns(prev => ({ ...prev, status: !prev?.status }))}
        />
        <label htmlFor='status'>Status</label>
      </div>
      <div className='filter-field'>
        <input
          type='checkbox'
          id='phone'
          checked={visibleColumns?.phone}
          onChange={() => setVisibleColumns(prev => ({ ...prev, phone: !prev?.phone }))}
        />
        <label htmlFor='phone'>Phone Number</label>
      </div>
    </div>
  )

  const { lang: locale } = useParams()

  const handleRowClick = userId => {
    const userViewUrl = getLocalizedUrl('/apps/user/view', locale)

    window.location.href = `${userViewUrl}?id=${userId}`
  }

  const handleDeleteClick = (event, userId) => {
    event.stopPropagation() // Prevent row click propagation

    if (isAnyRowSelected) {
      setUserToDelete(userId)
      setOpen(true)
    }
  }

  const handleCancelDelete = () => {
    setUserToDelete(null)
    setOpen(false)
  }

  const handleConfirmDelete = () => {
    if (isAnyRowSelected) {
      setData(data.filter(product => !rowSelection?.[product?.id])) // Assuming rowSelection holds selected rows
      setUserToDelete(null)
      setOpen(false)
    }
  }

  const handleExportClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseExportMenu = () => {
    setAnchorEl(null)
  }

  // Export logic
  const handleExportAll = () => {
    // Logic for exporting all users
    console.log('Exporting all users')
    handleCloseExportMenu()
  }

  const handleExportSelected = () => {
    // Logic for exporting selected users
    const selectedUserIds = Object.keys(rowSelection)

    console.log('Exporting selected users:', selectedUserIds)
    handleCloseExportMenu()
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleColumnToggle = column => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev?.[column] }))
    handleClose()
  }

  const columns = useMemo(
    () =>
      columnOrder
        ?.map(columnId => {
          switch (columnId) {
            case 'select':
              return visibleColumns?.user
                ? {
                    id: 'select',
                    header: ({ table }) => (
                      <Checkbox
                        {...{
                          checked: table.getIsAllRowsSelected(),
                          indeterminate: table.getIsSomeRowsSelected(),
                          onChange: table.getToggleAllRowsSelectedHandler()
                        }}
                      />
                    ),
                    cell: ({ row }) => (
                      <Checkbox
                        {...{
                          checked: row.getIsSelected(),
                          disabled: !row.getCanSelect(),
                          indeterminate: row.getIsSomeSelected(),
                          onChange: row.getToggleSelectedHandler()
                        }}
                        onClick={e => e.stopPropagation()}
                      />
                    )
                  }
                : null
            case 'user':
              return visibleColumns?.user
                ? columnHelper.accessor('fullName', {
                    header: 'User',
                    cell: ({ row }) => (
                      <div className='flex items-center gap-3'>
                        {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })}
                        <div className='flex flex-col'>
                          <Typography color='text.primary' className='font-medium'>
                            {row.original.fullName}
                          </Typography>
                          <Typography variant='body2'>{row.original.username}</Typography>
                        </div>
                      </div>
                    )
                  })
                : null
            case 'email':
              return visibleColumns?.email
                ? columnHelper.accessor('email', {
                    header: 'Email',
                    cell: ({ row }) => <Typography>{row.original.email}</Typography>
                  })
                : null
            case 'role':
              return visibleColumns?.role
                ? columnHelper.accessor('role', {
                    header: 'Role',
                    cell: ({ row }) => (
                      <div className='flex items-center gap-2'>
                        <Icon />
                        <Typography>{capitalizeFirstLetter(row.original.role)}</Typography>
                      </div>
                    )
                  })
                : null
            case 'status':
              return visibleColumns?.status
                ? columnHelper.accessor('status', {
                    header: 'Status',
                    cell: ({ row }) => (
                      <Chip
                        size='small'
                        label={getStatusLabel(row.original.status)}
                        color={userStatusObj?.[getStatusLabel(row.original.status).toLowerCase()]}
                        variant='outlined'
                        sx={{ textTransform: 'capitalize' }}
                      />
                    )
                  })
                : null
            case 'phone':
              return visibleColumns?.phone
                ? columnHelper.accessor('phone', {
                    header: 'Phone',
                    cell: ({ row }) => <Typography>{row.original.mobile}</Typography>
                  })
                : null
            case 'action':
              return {
                id: 'action',
                header: 'Action',
                cell: ({ row }) => (
                  <div className='flex items-center gap-0.5'>
                    <div onClick={e => e.stopPropagation()}>
                      <OptionMenu
                        iconClassName='text-textSecondary'
                        options={[
                          {
                            text: 'Edit',
                            onClick: () => {
                              alert('Hello')
                              console.log('Edit button clicked')
                              router.push(`/user/editUser?guid=${row?.original?.guid}`)
                            }
                          },
                          {
                            text: 'View', // Add the View option
                            onClick: () => {
                              const userId = row.original.id // Assuming `id` is the unique user identifier
                              const userViewUrl = getLocalizedUrl(`/apps/user/view?id=${userId}`, locale) // Create the URL

                              window.location.href = userViewUrl // Redirect to the user view page
                            }
                          },
                          { text: 'Delete' },
                          { text: 'Activate' },
                          { text: 'Deactivate' }
                        ]}
                        onClick={e => e.stopPropagation()}
                      />
                    </div>
                  </div>
                )
              }
            default:
              return null
          }
        })
        .filter(Boolean),
    [columnOrder, visibleColumns, data]
  )

  const getAvatar = ({ avatar, fullName }) => {
    if (avatar) {
      return <CustomAvatar src={avatar} sx={{ height: 32, width: 32 }} />
    } else {
      return (
        <CustomAvatar skin='light' color='info' sx={{ height: 32, width: 32 }}>
          {/* {getInitials(fullName)} */}
        </CustomAvatar>
      )
    }
  }

  // Table
  const table = useReactTable({
    data: filteredData, // <-- Use filteredData here
    columns,
    state: {
      rowSelection,
      globalFilter
    },
    enableRowSelection: true,
    enableMultiRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true
  })

  const isAnyRowSelected = Object.keys(rowSelection)?.length > 0

  const calculateNewIndex = (xPosition, fromIndex) => {
    const columnWidth = 100 // Approximate width of each column, adjust as necessary
    const toIndex = Math.floor(xPosition / columnWidth)

    return Math.max(0, Math.min(toIndex, columnOrder?.length - 1))
  }

  const getStatusLabel = status => {
    switch (status) {
      case '1':
        return 'Active'
      case '0':
        return 'Inactive'
      case '':
        return 'Pending'
      default:
        return 'Pending'
    }
  }

  const capitalizeFirstLetter = string => {
    if (!string) return ''

    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return (
    <Card>
      <div className='flex justify-between gap-2 p-2 flex-col items-start sm:flex-row sm:items-center'>
        {/* Left div with Delete and Checkbox buttons */}
        <div
          className='flex items-center gap-x-4 max-sm:gap-y-4 flex-col max-sm:is-full sm:flex-row'
          style={{ padding: '20px' }}
        >
          <Typography variant='h4'>All Users</Typography>
        </div>

        {/* Right div with Search bar */}
        <div className='flex items-center gap-x-4 max-sm:gap-y-4 flex-col max-sm:is-full sm:flex-row'>
          <Button
            variant='contained'
            onClick={() => {
              router.push('/user/inviteUser')
            }}
            className='max-sm:is-full'
          >
            + Invite User
          </Button>
        </div>
      </div>

      <TableFilters setData={setFilteredData} tableData={data} />
      {/* <Divider /> */}
      <div className='flex justify-between gap-2 p-2 flex-col items-start sm:flex-row sm:items-center'>
        <div
          className='flex items-center gap-x-4 max-sm:gap-y-4 flex-col max-sm:is-full sm:flex-row'
          style={{ paddingLeft: '25px' }}
        >
          <Button
            color='secondary'
            onClick={e => handleDeleteClick(e, 1)}
            style={{
              color: isAnyRowSelected ? '#FFFFFF' : '#8080808C', // Change text color based on selection
              border: isAnyRowSelected ? '1px solid #E7E7E7' : '1px solid #E7E7E7',
              minWidth: '40px',
              paddingLeft: '16px',
              cursor: isAnyRowSelected ? 'pointer' : 'not-allowed', // Change cursor based on selection
              opacity: isAnyRowSelected ? 1 : 0.5 // Change opacity based on selection
            }}
            disabled={!isAnyRowSelected} // Disable the button if no rows are selected
          >
            <i className='ri-delete-bin-6-line' style={{ color: isAnyRowSelected ? '#007AFF' : '#8080808C' }} />
          </Button>
          <Button
            color='secondary'
            style={{ color: '#FFFFFF', border: '1px solid #E7E7E7', minWidth: '40px', paddingLeft: '16px' }}
            onClick={() => handleOpenStatusDialog('active')}
          >
            <i className='ri-checkbox-circle-line' style={{ color: isAnyRowSelected ? '#007AFF' : '#8080808C' }} />
          </Button>

          <Button
            color='secondary'
            style={{ color: '#FFFFFF', border: '1px solid #E7E7E7', minWidth: '40px', paddingLeft: '16px' }}
            onClick={() => handleOpenRoleDialog('active')}
          >
            <i className='ri-user-3-line' style={{ color: isAnyRowSelected ? '#007AFF' : '#8080808C' }} />
          </Button>

          {showFilter && <FilterDropdown />}
        </div>
        <div className='flex items-center gap-x-4 max-sm:gap-y-4 flex-col max-sm:is-full sm:flex-row'>
          <Button
            color='secondary'
            onClick={handleExportClick} // Handle export menu click
            style={{
              color: isAnyRowSelected ? '#6D788D' : '#8080808C',
              border: isAnyRowSelected ? '1px solid #6D788D' : '1px solid #8080808C'
            }}
            variant='outlined'
            startIcon={<i className='ri-upload-2-line' />}
            className='max-sm:is-full'
          >
            Export
          </Button>

          {/* Export Dropdown Menu */}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseExportMenu}>
            <MenuItem onClick={handleExportAll}>Export All</MenuItem>
            <MenuItem onClick={handleExportSelected} disabled={!isAnyRowSelected}>
              Export Selected
            </MenuItem>
          </Menu>
        </div>
      </div>

      <div className='overflow-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups()?.map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    draggable // Makes the column header draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    style={{ cursor: 'grab' }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}

                <th
                  style={{
                    width: '50px',
                    position: 'sticky',
                    right: 0,

                    textAlign: 'center',
                    verticalAlign: 'middle'
                  }}
                >
                  <IconButton onClick={handleClick}>
                    <i className='ri-eye-line text-textSecondary' />
                  </IconButton>

                  {/* Menu for column visibility */}
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    <MenuItem>
                      <Checkbox
                        checked={visibleColumns.user}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, user: !prev?.user }))}
                      />
                      User
                    </MenuItem>
                    <MenuItem>
                      <Checkbox
                        checked={visibleColumns.email}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, email: !prev?.email }))}
                      />
                      Email
                    </MenuItem>
                    <MenuItem>
                      <Checkbox
                        checked={visibleColumns.role}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, role: !prev?.role }))}
                      />
                      Role
                    </MenuItem>
                    <MenuItem>
                      <Checkbox
                        checked={visibleColumns.status}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, status: !prev?.status }))}
                      />
                      Status
                    </MenuItem>
                    <MenuItem>
                      <Checkbox
                        checked={visibleColumns.phone}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, phone: !prev?.phone }))}
                      />
                      Phone Number
                    </MenuItem>
                  </Menu>
                </th>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.map(row => (
              <tr key={row.id} onClick={() => handleRowClick(row.original.id)}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
          {table.getFilteredRowModel().rows?.length === 0 && loader ? (
            <tbody>
              <tr style={{ textAlign: 'center' }}>
                {/* <td colSpan={table.getVisibleFlatColumns().length} className='text-center'> */}
                <CircularProgress className='absolute text-[var(--mui-palette-customColors-trackBg)]' />
                {/* </td> */}
              </tr>
            </tbody>
          ) : (
            <></>
          )}
        </table>
      </div>
      <Divider />
      <TablePagination
        component='div'
        rowsPerPageOptions={[10, 25, 50]}
        count={filteredData?.length} // <-- Ensure this uses filteredData
        rowsPerPage={10}
        page={table.getState().pagination.pageIndex}
        onPageChange={(event, newPage) => table.setPageIndex(newPage)}
        onRowsPerPageChange={event => {
          table.setPageSize(Number(event.target.value))
        }}
      />
      <AddUserDrawer
        // open={addUserOpen}
        handleClose={() => setAddUserOpen(!addUserOpen)}
        userData={data}
        open={addUserOpen}
        toggle={setAddUserOpen}
      />
      <Dialog
        open={open}
        onClose={handleCancelDelete}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: '600px' } }} // Setting the width and maxWidth
      >
        <DialogTitle id='alert-dialog-title'>{'Delete Users'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelDelete}
            style={{ border: '1px solid black', color: 'black', height: '38px', width: '94px' }}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant='contained' style={{ height: '38px', width: '94px' }} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Dialog */}
      <DialogBoxComponent
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        title='Change Status'
        description='Are you sure you want to change the status?'
        confirmText='Save'
        onConfirm={handleSaveStatus}
        statusOptions={statusOptions}
        selectedStatus={selectedStatus}
        onChangeStatus={handleChangeStatus}
        isStatusDialog={true}
      />

      {/* Role Dialog */}
      <DialogBoxComponent
        open={openRoleDialog}
        onClose={handleCloseRoleDialog}
        title='Change Role'
        description='Are you sure you want to change the role?'
        confirmText='Save'
        onConfirm={handleSaveRole}
        roleOptions={roleOptions}
        selectedRole={selectedRole}
        onChangeRole={handleChangeRole}
        isRoleDialog={true}
      />
    </Card>
  )
}

export default UserListTable
