'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'

// Third-party Imports
import classnames from 'classnames'
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

// Component Imports
import { Box, Tooltip, DialogTitle } from '@mui/material'

import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
// import { getInitials } from '../../../../../../Utils/getInitials'
// import { getLocalizedUrl } from '../../../../../../Utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import AlertDialogBox from '@/Components/Common/AlertDialogBox'
import DialogBoxComponent from '@/Components/Common/DialogBoxComponent'
import FilterHeader from '@/Components/globals/FilterHeader'
import { getInitials } from '@/Utils/getInitials'
import useDraggableList from '@/Components/globals/useDraggableList'
import EnrollmentTestFilters from './EnrollmentTestFilters'
import { randomColorGenerator } from '@/Utils/randomColorGenerator'
import OptionMenu from '@/@core/components/option-menu'
import PaginationCard from '@/api/Pagination'
import AddEditEnrollmentDialog from './AddEditEnrollmentDialog'

// import DialogBoxComponent from '@/Components/Common/DialogBoxComponent'

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

const userStatusObj = {
  Submitted: 'success',
  InProgress: 'warning',
  NotStarted: 'info',
  Expired: 'error'

  // Unpublished: 'secondary'
}

// Column Definitions

const columnHelper = createColumnHelper()

const EnrollmentTestListTable = ({
  tableData,
  testSubmissions,
  searchKeyword,
  setSearchKeyword = () => {},
  metaData,
  unenrollUsersInTest,
  getEnrollUsersData,
  editUsersEnrollmentInTest,
  getUsersData,
  usersData
}) => {
  // States
  console.info(usersData, 'users')
  const [addUserOpen, setAddUserOpen] = useState(false)

  const [editUserOpen, setEditUserOpen] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [dueDate, setDueDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [mainStartDate, setMainStartDate] = useState(new Date())
  const [mainDueDate, setMainDueDate] = useState(new Date())
  const [mainEndDate, setMainEndDate] = useState(new Date())
  const [enrollmentStatus, setEnrollmentStatus] = useState([])
  const [enrolledUsersData, setEnrolledUsersData] = useState([])
  const [screenReader, setScreenReader] = useState(false)
  const [extraTimeField, setExtraTimeField] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [editData, setEditData] = useState()
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [localSearch, setLocalSearch] = useState('')
  const [singleId, setSingleId] = useState(null)
  const [singleUser, setSingleUser] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedRows, setSelectedRows] = useState([])

  console.info(selectedRows, 'rows')
  console.info(singleId, 'id')
  const [type, setType] = useState('')
  const searchParams = useSearchParams()
  const guid = searchParams?.get('guid')
  const router = useRouter()

  //Dialog states
  const [open, setOpen] = useState(false)
  const [unenrollOpen, setUnenrollOpen] = useState(false)

  const initialColumns = ['select', 'user', 'start_time', 'submit_time', 'time_taken', 'marks', 'status', 'action']

  const [visibleColumns, setVisibleColumns] = useState({
    select: true,
    user: true,
    start_time: true,
    submit_time: true,
    time_taken: true,
    marks: true,
    status: true,
    action: true
  })

  const { items: columnOrder, handleDragOver, handleDrop, handleDragStart } = useDraggableList(initialColumns)

  useEffect(() => {
    setData(tableData)
  }, [tableData])

  useEffect(() => {
    getUsersData(guid, singleId?.[0])
  }, [singleId])

  const changeDateToISO = (year, month, day, hours, minutes, seconds) => {
    // Create a new Date object using the provided parameters
    const inputDate = new Date(year, month, day, hours, minutes, seconds)

    // Return the ISO string representation of the date
    return inputDate.toString() // Adjusted to return the full string representation
  }

  const DateSplitting = date => {
    // Split the date-time string into date and time parts
    const [datePart, timePart] = date.split(' ') // Split at space

    // Destructure year, month, and day from the date part
    const [year, month, day] = datePart.split('-')

    // Destructure hours, minutes, and seconds from the time part
    const [hours, minutes, seconds] = timePart.split(':')

    // Pass all these parts to the changeDateToISO function
    return changeDateToISO(
      parseInt(year), // Convert year to number
      parseInt(month) - 1, // Convert month to 0-indexed number
      parseInt(day), // Convert day to number
      parseInt(hours), // Convert hours to number
      parseInt(minutes), // Convert minutes to number
      parseInt(seconds) // Convert seconds to number
    )
  }

  // Test the function
  console.log(DateSplitting('2025-12-08 10:00:00'))

  useEffect(() => {
    console.info(usersData?.start_date, 'pp')

    setStartDate(usersData?.start_date ? new Date(DateSplitting(usersData?.start_date)) : new Date())
    setDueDate(usersData?.due_date ? new Date(DateSplitting(String(usersData?.due_date))) : new Date())
    setEndDate(usersData?.end_date ? new Date(DateSplitting(usersData?.end_date)) : new Date())
  }, [usersData])

  // Format the date to YYYY-MM-DD hh:mm:ss
  const formattedDate = date =>
    date.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0') +
    ' ' +
    String(date.getHours()).padStart(2, '0') +
    ':' +
    String(date.getMinutes()).padStart(2, '0') +
    ':' +
    String(date.getSeconds()).padStart(2, '0')

  const enrolledData = {
    start_date: formattedDate(new Date(mainStartDate)),
    due_date: formattedDate(new Date(mainDueDate)),
    end_date: formattedDate(new Date(mainEndDate)),
    enrolled_users: enrolledUsersData,
    enrollment_status: enrollmentStatus
  }

  useEffect(() => {
    getEnrollUsersData(guid, currentPage, rowsPerPage, searchKeyword, enrolledData)
  }, [
    currentPage,
    rowsPerPage,
    searchKeyword,
    mainStartDate,
    mainDueDate,
    mainEndDate,
    enrolledUsersData,
    enrollmentStatus
  ])

  useEffect(() => {
    const dataSource = metaData

    console.warn(dataSource?.total_results, 'tin')

    if (dataSource) {
      setTotalPages(Math.ceil(dataSource?.total_results / rowsPerPage))
    }
  }, [metaData, rowsPerPage])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchKeyword(localSearch) // Only set search keyword after delay
    }, 500) // 500ms delay

    return () => clearTimeout(delayDebounceFn) // Cleanup the timeout
  }, [localSearch, setSearchKeyword])

  useEffect(() => {
    const getSelectedRowIds = (rowSelection, tableData) => {
      return Object.keys(rowSelection)
        .filter(key => rowSelection[key]) // Filter out only selected rows
        .map(key => tableData[key]?.guid) // Map to the row IDs or objects
    }

    // Example usage:
    const selectedRowIds = getSelectedRowIds(rowSelection, tableData)

    setSelectedRows(selectedRowIds) // [id1, id2, id3]
  }, [rowSelection])

  const hours = data => String(Math.floor(data / 3600)).padStart(2, '0')

  const minutes = data => String(Math.floor((data % 3600) / 60)).padStart(2, '0')

  const seconds = data => String(data % 60).padStart(2, '0')

  const handlePageChange = page => {
    setCurrentPage(page)
  }

  const handleRowsPerPageChange = rows => {
    setRowsPerPage(rows)
    setCurrentPage(1) // Reset to the first page when changing rows per page
  }

  const handleClose = () => {
    setSingleId(null)
    setOpen(false)
  }

  const handleConfirm = () => {
    singleId
      ? editUsersEnrollmentInTest(guid, singleId, {
          start_date: formattedDate(new Date(startDate)),
          due_date: formattedDate(new Date(dueDate)),
          end_date: formattedDate(new Date(endDate)),
          screen_reader: screenReader,
          extra_time: extraTimeField
        })
      : editUsersEnrollmentInTest(guid, selectedRows, {
          start_date: formattedDate(new Date(startDate)),
          due_date: formattedDate(new Date(dueDate)),
          end_date: formattedDate(new Date(endDate)),
          screen_reader: screenReader,
          extra_time: extraTimeField
        })
    setOpen(false)
    setSingleId(null)
    setRowSelection({})
  }

  const handleUnenrollCancelDelete = () => {
    setSingleId(null)
    setUnenrollOpen(false)
  }

  const handleUnenrollConfirmDelete = () => {
    singleId ? unenrollUsersInTest(guid, singleId) : unenrollUsersInTest(guid, selectedRows)
    setUnenrollOpen(false)
    setSingleId(null)
    setRowSelection({})
  }

  const columns = useMemo(
    () =>
      columnOrder
        ?.map(columnId => {
          switch (columnId) {
            case 'select':
              return visibleColumns?.select
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
                ? columnHelper.accessor('name', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        user
                      </Typography>
                    ),
                    cell: ({ row }) => (
                      <div className='flex items-center gap-3'>
                        <div className='flex items-center'>
                          {getAvatar({ avatar: row.original?.avatar, fullName: row.original?.first_name })}
                          <Typography color='text.primary' className='font-medium pl-3'>
                            {row?.original?.name}
                          </Typography>
                        </div>
                      </div>
                    )
                  })
                : null
            case 'start_time':
              return visibleColumns?.start_time
                ? columnHelper.accessor('start_date', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        Start date/time
                      </Typography>
                    ),
                    cell: ({ row }) => <Typography>{row.original?.enrolment?.start_date ?? 'N/A'}</Typography>
                  })
                : null
            case 'submit_time':
              return visibleColumns?.submit_time
                ? columnHelper.accessor('updated_at', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        End date/time
                      </Typography>
                    ),
                    cell: ({ row }) => <Typography>{row.original?.enrolment?.end_date ?? 'N/A'}</Typography>
                  })
                : null
            case 'action':
              return columnHelper.accessor('action', {
                header: 'Action',
                cell: ({ row }) => (
                  <div className='flex items-center gap-0.5'>
                    <OptionMenu
                      iconClassName='text-textSecondary'
                      data={row}
                      options={[
                        {
                          text: <Typography ml={2}>Submissions</Typography>,
                          onClick: () => {}
                        },
                        {
                          text: <Typography ml={2}>Edit Enrollment</Typography>,
                          onClick: () => {
                            setSingleId(Array(row?.original?.guid))
                            console.info(row?.original?.enrolment?.due_date, 'due')
                            setSingleUser({
                              start_date: row?.original?.start_date,
                              due_date: row?.original?.enrolment?.due_date,
                              end_date: row?.original?.updated_at
                            })
                            setOpen(true)
                          }
                        },
                        {
                          text: <Typography ml={2}>Unenroll</Typography>,
                          onClick: () => {
                            setSingleId(Array(row?.original?.guid))
                            setUnenrollOpen(true)
                          }
                        }
                      ]}
                    />
                  </div>
                ),
                enableSorting: false
              })
            default:
              return null
          }
        })
        .filter(Boolean),
    [columnOrder, visibleColumns, data]
  )

  const table = useReactTable({
    data: tableData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 50
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const getAvatar = params => {
    const { avatar, fullName } = params

    if (avatar) {
      return <CustomAvatar src={avatar} skin='light' size={34} />
    } else {
      return (
        <CustomAvatar skin='light' size={34} color={randomColorGenerator()}>
          {fullName?.slice(0, 2)?.toUpperCase()}
        </CustomAvatar>
      )
    }
  }

  return (
    <>
      {/* <FilterHeade
      
      r title='Attempts' subtitle='Mathematics Test' /> */}
      <Card>
        <Grid container item xs={12} display='flex' alignItems='center'>
          <Grid item xs={12}>
            <EnrollmentTestFilters
              setData={setFilteredData}
              tableData={data}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              type={type}
              setType={setType}
              testSubmissions={testSubmissions}
              localSearch={localSearch}
              setLocalSearch={setLocalSearch}
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
              rowsPerPage={rowsPerPage}
              currentPage={currentPage}
              mainStartDate={mainStartDate}
              setMainStartDate={setMainStartDate}
              mainEndDate={mainEndDate}
              setMainEndDate={setMainEndDate}
              setMainDueDate={setMainDueDate}
              mainDueDate={mainDueDate}
              enrollmentStatus={enrollmentStatus}
              setEnrollmentStatus={setEnrollmentStatus}
              usersData={enrolledUsersData}
              setUsersData={setEnrolledUsersData}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} pl={5}>
          <Grid item xs={11.5}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <IconButton
                  disableRipple
                  disabled={!Object.keys(rowSelection)?.length}
                  sx={{
                    border: `1px solid ${Object.keys(rowSelection)?.length ? '#808080' : '#E7E7E7'}`,
                    borderRadius: 0
                  }}
                  onClick={() => {
                    setUnenrollOpen(true)
                  }}
                >
                  <i
                    class='ri-user-unfollow-line'
                    color={Object.keys(rowSelection)?.length ? '#B5B8FA' : '#808080'}
                    style={{
                      width: 20,
                      height: 20,
                      ...(Object.keys(rowSelection)?.length
                        ? {
                            color: '#B5B8FA'
                          }
                        : { color: '#808080' })
                    }}
                  ></i>
                </IconButton>
                <IconButton
                  disableRipple
                  disabled={!Object.keys(rowSelection)?.length}
                  sx={{
                    border: `1px solid ${Object.keys(rowSelection)?.length ? '#808080' : '#E7E7E7'}`,
                    borderRadius: 0,
                    ml: 2
                  }}
                  onClick={() => {
                    setOpen(true)
                  }}
                >
                  <i
                    class='ri-edit-box-line'
                    color={Object.keys(rowSelection)?.length ? '#B5B8FA' : '#808080'}
                    style={{
                      width: 20,
                      height: 20,
                      ...(Object.keys(rowSelection)?.length
                        ? {
                            color: '#B5B8FA'
                          }
                        : { color: '#808080' })
                    }}
                  ></i>
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <div className='overflow-x-auto pt-5'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups()?.map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers?.map((header, index) => (
                    <th
                      key={header.id}
                      draggable // Makes the column header draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                      style={{ cursor: 'grab' }}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='ri-arrow-up-s-line text-xl' />,
                              desc: <i className='ri-arrow-down-s-line text-xl' />
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows?.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
      </Card>

      <PaginationCard
        rowsPerPage={rowsPerPage} // e.g., 10
        currentPage={currentPage} // e.g., 1
        totalPages={totalPages} // e.g., 5
        onPageChange={handlePageChange} // Your function to handle page changes
        onRowsPerPageChange={handleRowsPerPageChange} // Your function to handle rows per page change
      />
      {open && (
        <AddEditEnrollmentDialog
          mode='edit'
          open={open}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          dueDate={dueDate}
          setDueDate={setDueDate}
          screenReader={screenReader}
          setScreenReader={setScreenReader}
          extraTimeField={extraTimeField}
          setExtraTimeField={setExtraTimeField}
          handleCancel={handleClose}
          handleConfirm={handleConfirm}
        />
      )}
      {unenrollOpen && (
        <AlertDialogBox
          open={unenrollOpen}
          handleCancel={handleUnenrollCancelDelete}
          handleConfirm={handleUnenrollConfirmDelete}
          title={
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <Typography fontSize={20} fontWeight='bold'>
                Unenroll Users{' '}
              </Typography>
              <IconButton onClick={handleUnenrollCancelDelete}>
                <i className='ri-close-line text-actionActive cursor-pointer' />
              </IconButton>
            </Box>
          }
          textContent={`Are you sure you want to unenroll this user?`}
          acceptedButton='Unenroll'
          rejectedButton='Cancel'
        />
      )}
    </>
  )
}

export default EnrollmentTestListTable
