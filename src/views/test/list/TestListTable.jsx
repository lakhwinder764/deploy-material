'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

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
import { Box } from '@mui/material'

import CustomAvatar from '@core/components/mui/Avatar'

import tableStyles from '@core/styles/table.module.css'

import TableFilters from './TableFilters'
import AddTestDrawer from './AddTestDrawer'

// Util Imports
// import { getInitials } from '../../../../../../Utils/getInitials'
// import { getLocalizedUrl } from '../../../../../../Utils/i18n'

// Style Imports

import AlertDialogBox from '@/components/Common/AlertDialogBox'
import DialogBoxComponent from '@/components/Common/DialogBoxComponent'
import FilterHeader from '@/components/globals/FilterHeader'
import { getInitials } from '@/utils/getInitials'
import useDraggableList from '@/components/globals/useDraggableList'
import ColumnVisibility from '@/components/Common/ColumnVisibility'
import PaginationCard from '@/api/Pagination'
import OptionMenu from '@/@core/components/option-menu'

// import DialogBoxComponent from '@/Components/Common/DialogBoxComponent'

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row?.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank?.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Vars
const userRoleObj = {
  admin: { icon: 'ri-vip-crown-line', color: 'error' },
  author: { icon: 'ri-computer-line', color: 'warning' },
  editor: { icon: 'ri-edit-box-line', color: 'info' },
  maintainer: { icon: 'ri-pie-chart-2-line', color: 'success' },
  subscriber: { icon: 'ri-user-3-line', color: 'primary' }
}

const userStatusObj = {
  Published: 'success',
  Unpublished: 'warning'

  // Unpublished: 'secondary'
}

// Column Definitions
const columnHelper = createColumnHelper()

const TestListTable = ({
  tableData,
  metaData,
  addUserData,
  deleteTest,
  fetchData,
  categories,
  getCategories,
  searchKeyword,
  setSearchKeyword,
  trashedData,
  trashTest,
  restoreTest,
  trashMetaData,
  searchTrashKeyword,
  setSearchTrashKeyword,
  getTrashedTests,
  categoriesTableData
}) => {
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)

  const [editUserOpen, setEditUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [categoriesData, setCategoriesData] = useState(...[categoriesTableData])

  console.info(categoriesData, 'uuu')
  const [trashData, setTrashData] = useState(...[trashedData])
  const [localSearch, setLocalSearch] = useState('')
  const [localTrashSearch, setLocalTrashSearch] = useState('')
  const [selectedRows, setSelectedRows] = useState([])

  const [editData, setEditData] = useState()
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [type, setType] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  //Dialog states
  const [openStatusDialog, setOpenStatusDialog] = useState(false)
  const statusOptions = ['Unpublished', 'Published']
  const [selectedStatus, setSelectedStatus] = useState('')
  const [open, setOpen] = useState(false)

  //trash functionality changes
  const [currentTrashPage, setCurrentTrashPage] = useState(1)
  const [trashRowsPerPage, setTrashRowsPerPage] = useState(5)
  const [totalTrashPages, setTotalTrashPages] = useState(1)
  const [mode, setMode] = useState('all')
  const [restore, setRestore] = useState(null)
  const [singleId, setSingleId] = useState(null)

  const initialColumns = [
    'select',
    'title',
    'created_by',
    'questions',
    'enrolment',
    'submission',
    'type',
    'status',
    'action'
  ]

  const [visibleColumns, setVisibleColumns] = useState({
    select: true,
    title: true,
    created_by: true,
    questions: true,
    enrolment: true,
    submission: true,
    type: true,
    status: true,
    action: true
  })

  const { items: columnOrder, handleDragOver, handleDrop, handleDragStart } = useDraggableList(initialColumns)

  const handleCancelDelete = () => {
    setSingleId(null)
    setOpen(false)
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchKeyword(localSearch) // Only set search keyword after delay
    }, 500) // 500ms delay

    return () => clearTimeout(delayDebounceFn) // Cleanup the timeout
  }, [localSearch, setSearchKeyword])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTrashKeyword(localTrashSearch) // Only set search keyword after delay
    }, 500) // 500ms delay

    return () => clearTimeout(delayDebounceFn) // Cleanup the timeout
  }, [localTrashSearch, setSearchTrashKeyword])

  useEffect(() => {
    setTrashData(trashedData)
  }, [trashedData])
  useEffect(() => {
    const getSelectedRowIds = (rowSelection, tableData) => {
      return Object.keys(rowSelection)
        .filter(key => rowSelection[key]) // Filter out only selected rows
        .map(key => tableData[key]?.guid) // Map to the row IDs or objects
    }

    // Example usage:
    const selectedRowIds = getSelectedRowIds(rowSelection, mode === 'all' ? tableData : trashData)

    setSelectedRows(selectedRowIds) // [id1, id2, id3]
  }, [rowSelection])

  const handleConfirmDelete = () => {
    mode === 'all'
      ? singleId
        ? trashTest(singleId)
        : trashTest(selectedRows)
      : restore
        ? singleId
          ? restoreTest(singleId)
          : restoreTest(selectedRows)
        : singleId
          ? deleteTest(singleId)
          : deleteTest(selectedRows)
    setOpen(false)
    setSingleId(null)
    setRowSelection({})
  }

  const handlePageChange = page => {
    setCurrentPage(page)
  }

  const handleRowsPerPageChange = rows => {
    setRowsPerPage(rows)
    setCurrentPage(1) // Reset to the first page when changing rows per page
  }

  // trashed pagination functions

  const handleTrashPageChange = page => {
    setCurrentTrashPage(page)
  }

  const handleTrashRowsPerPageChange = rows => {
    setTrashRowsPerPage(rows)
    setCurrentTrashPage(1) // Reset to the first page when changing rows per page
  }

  useEffect(() => {
    fetchData(currentPage, rowsPerPage, searchKeyword)
    getTrashedTests(currentTrashPage, trashRowsPerPage, searchTrashKeyword)
  }, [currentPage, rowsPerPage, searchKeyword, searchTrashKeyword, mode, currentTrashPage, trashRowsPerPage])

  useEffect(() => {
    const dataSource = metaData

    console.warn(dataSource.total_results, 'tin')

    if (dataSource) {
      setTotalPages(Math.ceil(dataSource.total_results / rowsPerPage))
    }
  }, [metaData, rowsPerPage])

  useEffect(() => {
    const dataSource = trashMetaData

    if (dataSource) {
      setTotalTrashPages(Math.ceil(dataSource.total_results / trashRowsPerPage))
    }
  }, [trashMetaData, trashRowsPerPage])

  const handleChangeStatus = event => setSelectedStatus(event.target.value)

  // Function to open dialog and initialize the selected user's status
  const handleOpenStatusDialog = user => {
    setSelectedStatus('Published') // Initialize the status with the user's current status
    setOpenStatusDialog(true)
  }

  // Function to close the dialog
  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false)
  }

  const handleSaveStatus = () => {
    // Save status logic here
    handleCloseStatusDialog()
  }

  useEffect(() => {
    setData(tableData)
  }, [tableData])

  useEffect(() => {
    setCategoriesData(categoriesTableData)
  }, [categoriesTableData])

  // Hooks
  const { lang: locale } = useParams()

  // const columns = useMemo(
  //   () => [
  //     {
  //       id: 'select',
  //       header: ({ table }) => (
  //         <Checkbox
  //           {...{
  //             checked: table.getIsAllRowsSelected(),
  //             indeterminate: table.getIsSomeRowsSelected(),
  //             onChange: table.getToggleAllRowsSelectedHandler()
  //           }}
  //         />
  //       ),
  //       cell: ({ row }) => (
  //         <Checkbox
  //           {...{
  //             checked: row.getIsSelected(),
  //             disabled: !row.getCanSelect(),
  //             indeterminate: row.getIsSomeSelected(),
  //             onChange: row.getToggleSelectedHandler()
  //           }}
  //         />
  //       )
  //     },
  //     columnHelper.accessor('title', {
  //       header: 'Test Name',
  //       cell: ({ row }) => (
  //         <div className='flex items-center gap-3'>
  //           <div className='flex flex-col'>
  //             <Typography color='text.primary' className='font-medium'>
  //               {row.original.title}
  //             </Typography>
  //             {/* <Typography variant='body2'>{row.original.username}</Typography> */}
  //           </div>
  //         </div>
  //       )
  //     }),
  //     columnHelper.accessor('created_by', {
  //       header: 'Creator',
  //       cell: ({ row }) => <Typography>{row.original.created_by}</Typography>
  //     }),
  //     columnHelper.accessor('questions', {
  //       header: 'Questions',
  //       cell: ({ row }) => <Typography>10</Typography>
  //     }),
  //     columnHelper.accessor('enrolment', {
  //       header: 'Enrolment',
  //       cell: ({ row }) => <Typography>10</Typography>
  //     }),
  //     columnHelper.accessor('submission', {
  //       header: 'Submission',
  //       cell: ({ row }) => <Typography>10</Typography>
  //     }),

  //     // columnHelper.accessor('created_on', {
  //     //   header: 'Date of Creation',
  //     //   cell: ({ row }) => (
  //     //     <div className='flex items-center gap-2'>
  //     //       <Typography className='capitalize' color='text.primary'>
  //     //         {row.original.created_on}
  //     //       </Typography>
  //     //     </div>
  //     //   )
  //     // }),
  //     columnHelper.accessor('type', {
  //       header: 'Type',
  //       cell: ({ row }) => (
  //         <Typography className='capitalize' color='text.primary'>
  //           {row.original.type}
  //         </Typography>
  //       )
  //     }),
  //     columnHelper.accessor('status', {
  //       header: 'Status',
  //       cell: ({ row }) => (
  //         <div className='flex items-center gap-3'>
  //           <Chip
  //             variant='tonal'
  //             label={row?.original?.status === '1' ? 'Published' : 'Unpublished'}
  //             size='small'
  //             color={userStatusObj[row?.original?.status === '1' ? 'Published' : 'Unpublished']}
  //             className='capitalize'
  //           />
  //         </div>
  //       )
  //     }),
  //     columnHelper.accessor('action', {
  //       header: 'Action',
  //       cell: ({ row }) => (
  //         <div className='flex items-center gap-0.5'>
  //           <IconButton
  //             size='small'
  //             onClick={() => {
  //               deleteTest(row?.original?.guid)
  //             }}
  //           >
  //             <i className='ri-delete-bin-7-line text-textSecondary' />
  //           </IconButton>
  //           <IconButton size='small'>
  //             <Link
  //               href={getLocalizedUrl(`/apps/test/questions/?guid=${row?.original?.guid}`, locale)}
  //               className='flex'
  //             >
  //               <i className='ri-eye-line text-textSecondary' />
  //             </Link>
  //           </IconButton>
  //           <IconButton size='small'>
  //             <Link href={getLocalizedUrl(`/apps/test/edit?guid=${row?.original?.guid}`, locale)} className='flex'>
  //               <i className='ri-edit-box-line text-textSecondary' />
  //             </Link>
  //           </IconButton>
  //           {/* <OptionMenu
  //             iconClassName='text-textSecondary'
  //             data={row}
  //             options={[
  //               {
  //                 text: 'Download',
  //                 icon: 'ri-download-line'
  //               },
  //               {
  //                 text: 'Edit',
  //                 icon: 'ri-edit-box-line'
  //               }
  //             ]}
  //           /> */}
  //         </div>
  //       ),
  //       enableSorting: false
  //     })
  //   ],
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [data, filteredData]
  // )

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
            case 'title':
              return visibleColumns?.title
                ? columnHelper.accessor('title', {
                    header: 'Test Name',
                    cell: ({ row }) => (
                      <div className='flex items-center gap-3'>
                        <div className='flex flex-col'>
                          <Typography color='text.primary' className='font-medium'>
                            {row.original?.title}
                          </Typography>
                          {/* <Typography variant='body2'>{row.original.username}</Typography> */}
                        </div>
                      </div>
                    )
                  })
                : null
            case 'created_by':
              return visibleColumns?.created_by
                ? columnHelper.accessor('created_by', {
                    header: 'Creator',
                    cell: ({ row }) => <Typography>{row.original?.created_by}</Typography>
                  })
                : null
            case 'questions':
              return visibleColumns?.questions
                ? columnHelper.accessor('questions', {
                    header: 'Questions',
                    cell: ({ row }) => <Typography>10</Typography>
                  })
                : null
            case 'enrolment':
              return visibleColumns?.enrolment
                ? columnHelper.accessor('enrolment', {
                    header: 'Enrolment',
                    cell: ({ row }) => <Typography>10</Typography>
                  })
                : null
            case 'submission':
              return visibleColumns?.submission
                ? columnHelper.accessor('submission', {
                    header: 'Submission',
                    cell: ({ row }) => <Typography>10</Typography>
                  })
                : null
            case 'type':
              return visibleColumns?.type
                ? columnHelper.accessor('type', {
                    header: 'Type',
                    cell: ({ row }) => (
                      <Typography className='capitalize' color='text.primary'>
                        {row.original?.type}
                      </Typography>
                    )
                  })
                : null
            case 'status':
              return visibleColumns?.status
                ? columnHelper.accessor('status', {
                    header: 'Status',
                    cell: ({ row }) => (
                      <div className='flex items-center gap-3'>
                        <Chip
                          variant='tonal'
                          label={row?.original?.status === 1 ? 'Published' : 'Unpublished'}
                          size='small'
                          color={userStatusObj?.[row?.original?.status === 1 ? 'Published' : 'Unpublished']}
                          className='capitalize'
                        />
                      </div>
                    )
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
                          text: <Typography>{mode === 'all' ? 'Trash' : 'Restore'}</Typography>,
                          icon: mode === 'all' ? 'ri-delete-bin-7-line text-textSecondary' : 'ri-reset-left-line',
                          onClick: () => {
                            setSingleId(Array(row?.original?.guid))

                            if (mode === 'all') {
                              setOpen(true)
                            }

                            if (mode === 'trash') {
                              setOpen(true)
                              setRestore(true)
                            }
                          }
                        },
                        {
                          text: <Typography ml={2}>View</Typography>,
                          icon: 'ri-eye-line text-textSecondary',
                          href: `/test/questions/?guid=${row?.original?.guid}`
                        },
                        ...(mode === 'all'
                          ? [
                              {
                                text: <Typography ml={2}>Edit</Typography>,
                                icon: 'ri-edit-box-line text-textSecondary',
                                href: `/test/edit?guid=${row?.original?.guid}`
                              },
                              {
                                text: <Typography ml={2}>Manage</Typography>,
                                icon: 'ri-tools-line',
                                href: `/test/manage?guid=${row?.original?.guid}`
                              }
                            ]
                          : []),
                        ...(mode === 'trash'
                          ? [
                              {
                                text: <Typography ml={2}>Delete</Typography>,
                                icon: 'ri-delete-bin-7-line text-textSecondary',
                                onClick: () => {
                                  setSingleId(Array(row?.original?.guid))

                                  if (mode === 'trash') {
                                    setOpen(true)
                                    setRestore(false)
                                  }
                                }
                              }
                            ]
                          : [])
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
        ?.filter(Boolean),
    [columnOrder, visibleColumns, data]
  )

  const table = useReactTable({
    data: mode === 'all' ? filteredData : trashData,
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

  console.info(Object.keys(rowSelection)?.length)

  const getAvatar = params => {
    const { avatar, fullName } = params

    if (avatar) {
      return <CustomAvatar src={avatar} skin='light' size={34} />
    } else {
      return (
        <CustomAvatar skin='light' size={34}>
          {getInitials(fullName)}
        </CustomAvatar>
      )
    }
  }

  return (
    <>
      <FilterHeader title='All Tests' subtitle='Orders placed across your store' link='/test/list'>
        <Grid item xs={6} md={2} display='flex' alignItems='center' pb={3}>
          <Button
            fullWidth
            variant='contained'
            onClick={() => setAddUserOpen(!addUserOpen)}
            className='max-sm:is-full'
            startIcon={
              <i
                class='ri-add-fill'
                style={{
                  width: 21.6,
                  height: 21.6
                }}
              />
            }
          >
            Add New Test
          </Button>
        </Grid>
      </FilterHeader>
      <Card>
        <Grid container item xs={12} display='flex' alignItems='center'>
          <Grid item xs={12}>
            <TableFilters
              setData={setFilteredData}
              tableData={data}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              type={type}
              setType={setType}
              searchKeyword={searchKeyword}
              localSearch={localSearch}
              setLocalSearch={setLocalSearch}
              localTrashSearch={localTrashSearch}
              setLocalTrashSearch={setLocalTrashSearch}
              mode={mode}
              searchTrashKeyword={searchTrashKeyword}
              setSearchTrashKeyword={setSearchTrashKeyword}
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
                    setRestore(false)
                    setOpen(true)
                  }}
                >
                  {/* <CustomTooltip title='Add' arrow> */}
                  <i
                    class='ri-delete-bin-6-fill'
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
                  {/* </CustomTooltip> */}
                </IconButton>
                {mode === 'all' && (
                  <IconButton
                    disableRipple
                    disabled={!Object.keys(rowSelection)?.length}
                    sx={{
                      border: `1px solid ${Object.keys(rowSelection)?.length ? '#808080' : '#E7E7E7'}`,
                      borderRadius: 0,
                      ml: 2
                    }}
                    onClick={() => handleOpenStatusDialog('Published')}
                  >
                    <i
                      class='ri-checkbox-circle-line'
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
                )}
                {mode === 'trash' && (
                  <IconButton
                    disableRipple
                    disabled={!Object.keys(rowSelection)?.length}
                    sx={{
                      border: `1px solid ${Object.keys(rowSelection)?.length ? '#808080' : '#E7E7E7'}`,
                      borderRadius: 0,
                      ml: 2
                    }}
                    onClick={() =>
                      (() => {
                        setRestore(true)
                        setOpen(true)
                      })()
                    }
                  >
                    <i
                      className='ri-reset-left-line'
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
                )}
              </Box>
              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <IconButton
                  disableRipple
                  disabled={!data?.length}
                  onClick={() => {
                    setMode('all')
                    setSingleId(null)
                    setSelectedRows(null)
                  }}
                >
                  <Typography>{`Active (${metaData?.total_results})`}</Typography>
                </IconButton>
                <IconButton
                  disableRipple
                  disabled={!trashData?.length}
                  onClick={() => {
                    setMode('trash')
                    setSingleId(null)
                    setSelectedRows(null)
                  }}
                >
                  <Typography>{`Trash (${trashMetaData?.total_results})`}</Typography>
                </IconButton>
              </Box>
            </Box>
          </Grid>
          <Grid
            container
            pr={8}
            item
            xs={11}
            spacing={3}
            display='flex'
            alignItems='center'
            justifyContent='flex-end'
          ></Grid>
        </Grid>
        <div className='overflow-x-auto pt-5'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups()?.map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers?.map((header, index) => (
                    <th
                      key={header?.id}
                      draggable // Makes the column header draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                      style={{ cursor: 'grab' }}
                    >
                      {header?.isPlaceholder ? null : (
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
                  <ColumnVisibility visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} />
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
        {/* <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          className='border-bs'
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' }
          }}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        /> */}
      </Card>
      {
        <AddTestDrawer
          open={addUserOpen}
          handleClose={() => setAddUserOpen(!addUserOpen)}
          userData={data}
          categoriesTableData={categoriesData}
          setData={setData}
          addUserData={addUserData}
          categories={categories}
          getCategories={getCategories}
        />
      }
      {open && (
        <AlertDialogBox
          open={open}
          handleCancel={handleCancelDelete}
          handleConfirm={handleConfirmDelete}
          title={`${mode === 'all' ? 'Trash' : restore ? 'Restore' : 'Delete'} Test`}
          textContent={`Are you sure you want to ${mode === 'all' ? 'trash' : restore ? 'restore' : 'delete'} this test?`}
          acceptedButton={mode === 'all' ? 'Trash' : restore ? 'Restore' : 'Delete'}
          rejectedButton='Cancel'
        />
      )}
      {/* status Dialog */}
      <DialogBoxComponent
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        title='Change Status'
        description='Are you sure you want to change status?'
        confirmText='Save'
        onConfirm={handleSaveStatus}
        statusOptions={statusOptions}
        selectedStatus={selectedStatus}
        onChangeStatus={handleChangeStatus}
        isStatusDialog={true}
      />
      <Grid item xs={12} md={12}>
        {mode === 'all' ? (
          <PaginationCard
            rowsPerPage={rowsPerPage} // e.g., 10
            currentPage={currentPage} // e.g., 1
            totalPages={totalPages} // e.g., 5
            onPageChange={handlePageChange} // Your function to handle page changes
            onRowsPerPageChange={handleRowsPerPageChange} // Your function to handle rows per page change
          />
        ) : (
          <PaginationCard
            rowsPerPage={trashRowsPerPage} // e.g., 10
            currentPage={currentTrashPage} // e.g., 1
            totalPages={totalTrashPages} // e.g., 5
            onPageChange={handleTrashPageChange} // Your function to handle page changes
            onRowsPerPageChange={handleTrashRowsPerPageChange} // Your// Your function to handle rows per page change
          />
        )}
      </Grid>
    </>
  )
}

export default TestListTable
