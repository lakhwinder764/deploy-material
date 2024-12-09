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
import EnrollUsersFilters from './EnrollUsersFilters'
import { randomColorGenerator } from '@/Utils/randomColorGenerator'
import OptionMenu from '@/@core/components/option-menu'
import PaginationCard from '@/api/Pagination'

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

const EnrollUsersListTable = ({
  tableData,
  searchKeyword,
  setSearchKeyword = () => {},
  metaData,
  enrollUsersInTest,
  getUnenrollUsersData
}) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [localSearch, setLocalSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [batch, setBatch] = useState([])
  const searchParams = useSearchParams()
  const guid = searchParams?.get('guid')
  const router = useRouter()

  //Dialog states
  const [openStatusDialog, setOpenStatusDialog] = useState(false)
  const statusOptions = ['Unpublished', 'Published']
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  const [open, setOpen] = useState(false)

  const initialColumns = [
    'select',
    'user',
    'start_time',
    'submit_time',
    'time_taken',
    'marks',
    'email',
    'mobile_no',
    'status',
    'action'
  ]

  const [visibleColumns, setVisibleColumns] = useState({
    select: true,
    user: true,
    start_time: true,
    submit_time: true,
    time_taken: true,
    marks: true,
    mobile_no: true,
    email: true,
    status: true,
    action: true
  })

  const { items: columnOrder, handleDragOver, handleDrop, handleDragStart } = useDraggableList(initialColumns)

  useEffect(() => {
    setData(tableData)
  }, [tableData])

  useEffect(() => {
    const dataSource = metaData

    console.warn(dataSource?.total_results, 'tin')

    if (dataSource) {
      setTotalPages(Math.ceil(dataSource?.total_results / rowsPerPage))
    }
  }, [metaData, rowsPerPage])

  useEffect(() => {
    getUnenrollUsersData(guid, currentPage, rowsPerPage, searchKeyword, batch)
  }, [currentPage, rowsPerPage, searchKeyword, batch])

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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchKeyword(localSearch) // Only set search keyword after delay
    }, 500) // 500ms delay

    return () => clearTimeout(delayDebounceFn) // Cleanup the timeout
  }, [localSearch, setSearchKeyword])

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
                            {row?.original?.name ?? 'N/A'}
                          </Typography>
                        </div>
                      </div>
                    )
                  })
                : null
            case 'email':
              return visibleColumns?.email
                ? columnHelper.accessor('email', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        Email
                      </Typography>
                    ),
                    cell: ({ row }) => (
                      <div className='flex items-center gap-3'>
                        <div className='flex items-center'>
                          <Typography color='text.primary' className='font-medium pl-3'>
                            {row?.original?.email}
                          </Typography>
                        </div>
                      </div>
                    )
                  })
                : null
            case 'mobile_no':
              return visibleColumns?.mobile_no
                ? columnHelper.accessor('mobile_no', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        Mobile Number
                      </Typography>
                    ),
                    cell: ({ row }) => (
                      <div className='flex items-center gap-3'>
                        <div className='flex items-center'>
                          <Typography color='text.primary' className='font-medium pl-3'>
                            +565653859264
                          </Typography>
                        </div>
                      </div>
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
      <Card>
        <Grid container item xs={12} display='flex' alignItems='center'>
          <Grid item xs={12}>
            <EnrollUsersFilters
              selectedUsers={selectedRows}
              setGlobalFilter={setGlobalFilter}
              localSearch={localSearch}
              setLocalSearch={setLocalSearch}
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
              rowsPerPage={rowsPerPage}
              currentPage={currentPage}
              batch={batch}
              setBatch={setBatch}
              enrollUsersInTest={enrollUsersInTest}
              setRowSelection={setRowSelection}
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
      </Card>
      <PaginationCard
        rowsPerPage={rowsPerPage} // e.g., 10
        currentPage={currentPage} // e.g., 1
        totalPages={totalPages} // e.g., 5
        onPageChange={handlePageChange} // Your function to handle page changes
        onRowsPerPageChange={handleRowsPerPageChange} // Your function to handle rows per page change
      />
    </>
  )
}

export default EnrollUsersListTable
