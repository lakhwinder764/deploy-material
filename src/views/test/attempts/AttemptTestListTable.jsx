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
import { Box, Tooltip } from '@mui/material'

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
import AttemptTestFilters from './AttemptTestFilters'
import { randomColorGenerator } from '@/Utils/randomColorGenerator'

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

const AttemptTestListTable = ({ tableData, testSubmissions }) => {
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)

  const [editUserOpen, setEditUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [editData, setEditData] = useState()
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [type, setType] = useState('')
  const searchParams = useSearchParams()
  const guid = searchParams?.get('guid')
  const router = useRouter()

  //Dialog states
  const [openStatusDialog, setOpenStatusDialog] = useState(false)
  const statusOptions = ['Unpublished', 'Published']
  const [selectedStatus, setSelectedStatus] = useState('')
  const [open, setOpen] = useState(false)

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

  const hours = data => String(Math.floor(data / 3600)).padStart(2, '0')

  const minutes = data => String(Math.floor((data % 3600) / 60)).padStart(2, '0')

  const seconds = data => String(data % 60).padStart(2, '0')

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
                ? columnHelper.accessor('first_name', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        user name
                      </Typography>
                    ),
                    cell: ({ row }) => (
                      <div className='flex items-center gap-3'>
                        <div className='flex items-center'>
                          {getAvatar({ avatar: row.original?.avatar, fullName: row.original?.first_name })}
                          <Typography color='text.primary' className='font-medium pl-3'>
                            {row?.original?.first_name
                              ? `${row.original?.first_name} ${row.original?.middle_name} ${row.original?.last_name}`
                              : 'N/A'}
                          </Typography>
                        </div>
                      </div>
                    )
                  })
                : null
            case 'start_time':
              return visibleColumns?.start_time
                ? columnHelper.accessor('start_time', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        Attempted date/time
                      </Typography>
                    ),
                    cell: ({ row }) => <Typography>{row.original?.start_time}</Typography>
                  })
                : null
            case 'submit_time':
              return visibleColumns?.submit_time
                ? columnHelper.accessor('submit_time', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        Submission date/time
                      </Typography>
                    ),
                    cell: ({ row }) => <Typography>{row.original?.submit_time}</Typography>
                  })
                : null
            case 'time_taken':
              return visibleColumns?.time_taken
                ? columnHelper.accessor('time_taken', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        Time Taken
                      </Typography>
                    ),
                    cell: ({ row }) => (
                      <Typography className='capitalize' color='primary.main'>
                        {/* {(new Date(row?.original?.submit_time) - new Date(row?.original?.start_time)) / 1000} */}
                        {`${hours((new Date(row?.original?.submit_time) - new Date(row?.original?.start_time)) / 1000)} : ${minutes((new Date(row?.original?.submit_time) - new Date(row?.original?.start_time)) / 1000)} : ${seconds((new Date(row?.original?.submit_time) - new Date(row?.original?.start_time)) / 1000)}`}
                      </Typography>
                    )
                  })
                : null
            case 'marks':
              return visibleColumns?.marks
                ? columnHelper.accessor('marks', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        Marks
                      </Typography>
                    ),
                    cell: ({ row }) => <Typography className='capitalize'>30</Typography>
                  })
                : null
            case 'status':
              return visibleColumns?.status
                ? columnHelper.accessor('status', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        Status
                      </Typography>
                    ),
                    cell: ({ row }) => (
                      <div className='flex items-center gap-3'>
                        <Chip
                          variant='tonal'
                          label={row?.original?.status?.replace(/([a-z])([A-Z])/g, '$1 $2')}
                          size='small'
                          color={userStatusObj[row?.original?.status]}
                          className='capitalize'
                        />
                      </div>
                    )
                  })
                : null
            case 'action':
              return visibleColumns?.action
                ? columnHelper.accessor('action', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        Action
                      </Typography>
                    ),
                    cell: ({ row }) => (
                      <Box display='flex' justifyContent='space-between'>
                        {row?.original?.status === 'Submitted' && (
                          <Button
                            variant='outlined'
                            color='primary'
                            size='small'
                            onClick={() => router.push(`/marking?guid=${guid}`)}
                          >
                            Grading
                          </Button>
                        )}
                        <Button
                          variant='outlined'
                          color='primary'
                          size='small'
                          onClick={() => router.push(`/report?guid=${guid}`)}
                        >
                          Report
                        </Button>
                      </Box>
                    )
                  })
                : null
            default:
              return null
          }
        })
        .filter(Boolean),
    [columnOrder, visibleColumns, data]
  )

  const table = useReactTable({
    data: filteredData,
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
        pageSize: 10
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
            <AttemptTestFilters
              setData={setFilteredData}
              tableData={data}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              type={type}
              setType={setType}
              testSubmissions={testSubmissions}
            />
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
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          className='border-bs'
          count={table.getFilteredRowModel().rows?.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' }
          }}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>
    </>
  )
}

export default AttemptTestListTable
