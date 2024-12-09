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
import { Box, Tooltip } from '@mui/material'

import CustomAvatar from '@core/components/mui/Avatar'

import tableStyles from '@core/styles/table.module.css'

// Util Imports
// import { getInitials } from '../../../../../../Utils/getInitials'
// import { getLocalizedUrl } from '../../../../../../Utils/i18n'

// Style Imports

import moment from 'moment'

import AlertDialogBox from '@/components/Common/AlertDialogBox'
import DialogBoxComponent from '@/components/Common/DialogBoxComponent'
import FilterHeader from '@/components/globals/FilterHeader'
import { getInitials } from '@/utils/getInitials'
import useDraggableList from '@/components/globals/useDraggableList'
import TableFilters from '../../list/TableFilters'
import AddDifficultiesDrawer from './AddDifficultiesDrawer'
import DifficultiesListFilter from './DifficultiesListFilter'

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

const DifficultiesListTable = ({
  tableData,
  trashedData,

  addDifficultyData,
  deleteUserData,
  trashDifficulties,
  deleteDifficulties,
  restoreTrashDifficulties,
  getTrashedDifficultiesLevel,
  searchKeyword,
  setSearchKeyword,
  fetchData
}) => {
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [categoriesParent, setCategoriesparent] = useState(false)
  const [selectedParentGuid, setSelectedParentGuid] = useState(null)
  const [editUserOpen, setEditUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [selectedRows, setSelectedRows] = useState([])
  const [restore, setRestore] = useState(null)

  const [singleId, setSingleId] = useState(null)

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

  const [data, setData] = useState(...[tableData])
  const [trashData, setTrashData] = useState(...[trashedData])
  const [mode, setMode] = useState('all')

  const [editData, setEditData] = useState()
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [type, setType] = useState('')

  //Dialog states
  const [openStatusDialog, setOpenStatusDialog] = useState(false)
  const statusOptions = ['Unpublished', 'Published']
  const [selectedStatus, setSelectedStatus] = useState('')
  const [open, setOpen] = useState(false)
  const [expandedParents, setExpandedParents] = useState([])
  const initialColumns = ['select', 'title', 'created_by', 'description', 'created_at', 'test', 'action']

  const [visibleColumns, setVisibleColumns] = useState({
    select: true,
    title: true,
    test: true,
    created_by: true,
    description: true,
    created_at: true,
    questions: true,
    enrolment: true,
    submission: true,
    type: true,
    status: true,
    action: false
  })

  const { items: columnOrder, handleDragOver, handleDrop, handleDragStart } = useDraggableList(initialColumns)

  const handleCancelDelete = () => {
    setSingleId(null)
    setOpen(false)
  }

  const handleConfirmDelete = () => {
    mode === 'all'
      ? singleId
        ? trashDifficulties(singleId)
        : trashDifficulties(selectedRows)
      : restore
        ? singleId
          ? restoreTrashDifficulties(singleId)
          : restoreTrashDifficulties(selectedRows)
        : singleId
          ? deleteDifficulties(singleId)
          : deleteDifficulties(selectedRows)
    setOpen(false)
    setSingleId(null)
    setRowSelection({})
  }

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

  const transformPayloadToArray = payload => {
    const resultArray = []

    Object.keys(payload ?? {}).forEach(key => {
      const category = payload?.[key]

      // Only add the parent category if its guid is defined
      if (category?.guid !== undefined) {
        resultArray?.push({
          guid: category?.guid,
          title: category?.title,
          created_by: category?.created_by,
          created_on: category?.created_on,
          updated_by: category?.updated_by,
          updated_on: category?.updated_on,
          parent_guid: category?.parent_guid,
          parent_title: category?.parent_title,
          children: category?.children
        })
      }

      // If the category has children and their guid is defined, add them to the result array
      if (category?.children && category?.children?.length > 0) {
        category?.children?.forEach(child => {
          if (child?.guid !== undefined) {
            resultArray?.push({
              guid: child?.guid,
              title: child?.title,
              created_by: child?.created_by,
              created_on: child?.created_on,
              updated_by: child?.updated_by,
              updated_on: child?.updated_on,
              parent_guid: child?.parent_guid,
              parent_title: child?.parent_title
            })
          }
        })
      }
    })

    return resultArray
  }

  // Apply the transformation
  const transformedPayload = transformPayloadToArray(tableData)

  useEffect(() => {
    setData(transformedPayload)
  }, [tableData])

  useEffect(() => {
    setTrashData(trashedData)
  }, [trashedData])

  // Hooks
  const { lang: locale } = useParams()

  const handleClick = () => {
    setCategoriesparent(true)
  }

  // Filter the displayed categories
  const handleParentClick = parentGuid => {
    if (expandedParents?.includes(parentGuid)) {
      // If already expanded, collapse it
      setExpandedParents(expandedParents?.filter(guid => guid !== parentGuid))
    } else {
      // Otherwise, expand it
      setExpandedParents([...expandedParents, parentGuid])
    }
  }

  // Adjust filteredCategories to include children of expanded parents
  const filteredCategories = useMemo(() => {
    const result = []

    transformedPayload?.forEach(item => {
      if (item?.parent_guid === null) {
        // Add parent category
        result.push(item)

        // If the parent is expanded, add its children
        if (expandedParents?.includes(item?.guid)) {
          const children = transformedPayload?.filter(child => child?.parent_guid === item?.guid)

          result?.push(...children)
        }
      }
    })

    return result
  }, [tableData, expandedParents, mode])

  const hasChildren = guid => {
    return transformedPayload?.some(category => category?.parent_guid === guid)
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
            case 'title':
              return visibleColumns?.title
                ? columnHelper.accessor('title', {
                    header: 'Title',
                    cell: ({ row }) => {
                      return <Typography>{row?.original?.title}</Typography>
                    }
                  })
                : null
            case 'description':
              return visibleColumns?.description
                ? columnHelper.accessor('description', {
                    header: 'Description',
                    cell: ({ row }) => {
                      // return <Typography>{row?.original?.description ? row?.original?.description : 'N/A'}</Typography>

                      return row?.original?.description ? (
                        <div dangerouslySetInnerHTML={{ __html: row.original.description }} />
                      ) : (
                        'N/A'
                      )
                    }
                  })
                : null
            case 'created_at':
              return visibleColumns?.created_at
                ? columnHelper.accessor('created_at', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        Created On
                      </Typography>
                    ),
                    cell: ({ row }) => (
                      <Typography>{moment(row.original?.created_at).format('DD-MM-YYYY hh:mm:ss')}</Typography>
                    )
                  })
                : null

            case 'action':
              return columnHelper.accessor('action', {
                header: 'Action',
                cell: ({ row }) => (
                  <div className='flex items-center gap-0.5'>
                    <IconButton
                      size='small'
                      onClick={() => {
                        setSingleId(Array(row?.original?.guid))

                        if (mode === 'all') {
                          setOpen(true)
                        }

                        if (mode === 'trash') {
                          setOpen(true)
                          setRestore(true)
                        }
                      }}
                    >
                      {mode === 'all' ? (
                        <i className='ri-delete-bin-7-line text-textSecondary' />
                      ) : (
                        <i className='ri-reset-left-line' />
                      )}
                    </IconButton>

                    <IconButton
                      size='small'
                      onClick={() => {
                        setSingleId(Array(row?.original?.guid))

                        if (mode === 'trash') {
                          setOpen(true)
                          setRestore(false)
                        }

                        // mode === 'trash' && deleteDifficulties(Array(row?.original?.guid))
                      }}
                    >
                      {mode === 'all' ? (
                        <Link href={`/difficulty/edit?guid=${row?.original?.guid}`} className='flex'>
                          <i className='ri-edit-box-line text-textSecondary' />
                        </Link>
                      ) : (
                        <i className='ri-delete-bin-7-line text-textSecondary' />
                      )}
                    </IconButton>
                  </div>
                ),
                enableSorting: false
              })
            default:
              return null
          }
        })
        .filter(Boolean),
    [columnOrder, visibleColumns, data, expandedParents, mode]
  )

  const table = useReactTable({
    data: mode === 'all' ? tableData : trashData,
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

  return (
    <>
      <Box display='flex' justifyContent='flex-end' my={5}>
        <Button
          // fullWidth
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
          Add Difficulty Level
        </Button>
      </Box>
      <Card>
        <Grid container item xs={12} display='flex' alignItems='center'>
          <Grid item xs={12}>
            <DifficultiesListFilter
              setData={setFilteredData}
              tableData={data}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              type={type}
              setType={setType}
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
              fetchData={fetchData}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} pl={5}>
          <Grid item xs={11.5}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <Box display='flex' justifyContent='space-between'>
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
                  <Typography>{`Active (${data?.length})`}</Typography>
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
                  <Typography>{`Trash (${trashData?.length})`}</Typography>
                </IconButton>
              </Box>
            </Box>
          </Grid>
          <Grid container pr={8} item xs={11} spacing={3} display='flex' alignItems='center' justifyContent='flex-end'>
            <Grid item xs={3.5}></Grid>
          </Grid>
        </Grid>

        <div className='overflow-x-auto pt-5'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
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
            {table.getFilteredRowModel().rows.length === 0 ? (
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
        />
      </Card>
      <AddDifficultiesDrawer
        open={addUserOpen}
        handleClose={() => setAddUserOpen(!addUserOpen)}
        difficultiesData={data}
        setDifficultiesData={setData}
        addDifficultyData={addDifficultyData}
      />
      {open && (
        <AlertDialogBox
          open={open}
          handleCancel={handleCancelDelete}
          handleConfirm={handleConfirmDelete}
          title={`${mode === 'all' ? 'Trash' : restore ? 'Restore' : 'Delete'} Difficulty`}
          textContent={`Are you sure you want to ${mode === 'all' ? 'trash' : restore ? 'restore' : 'delete'} this difficulty?`}
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
    </>
  )
}

export default DifficultiesListTable
