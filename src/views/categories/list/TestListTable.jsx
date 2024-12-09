'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

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
// import { useRouter } from 'next/router'
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

import TableFilters from './TableFilters'
import AddTestDrawer from './AddTestDrawer'
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
  addCategoryData,
  deleteUserData,
  trashCategoryData,
  handleTrashClick,
  trashView,
  resetCategoryData,
  trashDataLength,
  activeDataLength,
  handleActiveClick
}) => {
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [categoriesParent, setCategoriesparent] = useState(false)
  const [selectedParentGuid, setSelectedParentGuid] = useState(null)
  const [editUserOpen, setEditUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(tableData)
  const [editData, setEditData] = useState()
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [type, setType] = useState('')
  console.log(data, 'filterte')
  //Dialog states
  const [openStatusDialog, setOpenStatusDialog] = useState(false)
  const [trashOpen, setTrashOpen] = useState(false)
  const statusOptions = ['Unpublished', 'Published']
  const [selectedStatus, setSelectedStatus] = useState('')
  const [open, setOpen] = useState(false)
  const [trashid, setTrashId] = useState(null)
  const [resetId, setResetId] = useState(null)
  const [expandedParents, setExpandedParents] = useState([])
  const initialColumns = ['select', 'title', 'created_by', 'test', 'action']
  const router = useRouter()
  // const router = useRouter()
  // const selectCategoriesPage = () => {
  //   console.log('Navigating to categories list with category:', 'check')
  //   router.push({
  //     pathname: '/categories/list',
  //     query: { category: 'check' }
  //   })
  // }
  // console.log(selectedCategory, 'ssss')
  const [visibleColumns, setVisibleColumns] = useState({
    select: true,
    title: true,
    test: true,
    created_by: true,
    questions: true,
    enrolment: true,
    submission: true,
    type: true,
    status: true,
    action: false
  })

  const { items: columnOrder, handleDragOver, handleDrop, handleDragStart } = useDraggableList(initialColumns)
  console.log(data, 'datachecking')
  const handleCancelDelete = () => {
    setOpen(false)
  }

  // const handleConfirmDelete = () => {
  //   setOpen(false)
  //   trashCategoryData(deleteId) // Call the delete function with the stored ID
  //   setDeleteId(null) // Reset th
  // }

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
  const categories = Object.values(tableData)
  console.log(categories, 'checkinggggggggggg')
  const flattenData = categories => {
    return categories.map(category => {
      // Check if the category has children
      if (category.children && category.children.length > 0) {
        return {
          ...category,
          children: flattenData(category.children) // Recursively flatten children
        }
      }
      return category
    })
  }
  console.log(flattenData, 'flatten')
  function formatCategoriesResponse(categories) {
    // Helper function to build a nested structure
    const buildHierarchy = (parentId = null) =>
      categories
        .filter(category => category.parent_id === parentId)
        .map(category => ({
          ...category,
          children: buildHierarchy(category.id)
        }))

    // Build the hierarchical structure starting with top-level categories
    const bata = buildHierarchy()

    // Return the structured response object
    return {
      success: true,
      message: 'RECORDS_FOUND',
      payload: {
        meta: {
          first_page: 1,
          last_page: 1,
          current_page: 1,
          num_results: categories.length,
          total_results: categories.length
        },
        bata
      }
    }
  }
  console.log(formatCategoriesResponse, 'format')
  // const transformPayloadToArray = data => {
  //   const resultArray = []

  //   // Recursive helper function to process a category and its children
  //   const processCategory = (category, parentTitle = null, parentGuid = null) => {
  //     // Add the current category to the result array
  //     resultArray.push({
  //       guid: category.guid,
  //       title: category.title,
  //       created_by: category.created_by,
  //       created_on: category.created_at,
  //       updated_by: category.updated_by,
  //       updated_on: category.updated_at,
  //       parent_guid: parentGuid,
  //       parent_title: parentTitle,
  //       id: category.id
  //     })

  //     // If there are children, recursively process each child
  //     if (category.children && category.children.length > 0) {
  //       category.children.forEach(child => {
  //         processCategory(child, category.title, category.parent_id)
  //       })
  //     }
  //   }

  // Start processing each top-level category
  //   data.forEach(category => {
  //     if (category.parent_id === null) {
  //       // This is a parent category
  //       processCategory(category)
  //     }
  //   })

  //   return resultArray
  // }
  const handlemultipletrashDelete = id => {
    setOpen(false)
    console.log(id, 'idsss')
    trashCategoryData(trashid)
  }
  const handlemultipletrashRecover = id => {
    setOpen(false)
    console.log(id, 'idsss')
    resetCategoryData(resetId)
  }
  // Usage:
  // const transformedPayload = transformPayloadToArray(tableData)
  // useEffect(() => {
  //   setData(transformedPayload)
  // }, [tableData])
  console.log(data, 'checkingparent')
  const trashData = id => {
    setOpen(true)
    setTrashId(id)
    // trashCategoryData(id)

    console.log(id, 'odsss')
  }
  const resetData = id => {
    setOpen(true)
    setResetId(id)
  }
  const renderCategories = categories => {
    // Group categories by parent and child based on parent_id
    console.log(categories, 'sssstest')
    const parents = categories.filter(category => category.parent_id === null)
    const children = categories.filter(category => category.parent_id !== null)

    return parents.map(parent => ({
      id: parent.id,
      title: parent.title,
      childs: children
        .filter(child => child.parent_id === parent.id)
        .map(child => ({
          id: child.id,
          title: child.title
        }))
    }))
  }
  console.log(renderCategories, 'sssssss')
  const handleConfirmDelete = () => {
    setOpen(false)
    trashCategoryData(trashid) // Call the delete function with the stored ID
    setTrashId(null) // Reset th
  }
  const handleConfirmRecover = () => {
    setOpen(false)
    resetCategoryData(resetId) // Call the delete function with the stored ID
    setResetId(null) // Reset th
  }

  // // Apply the transformation
  // const transformedPayload = transformPayloadToArray(tableData)
  useEffect(() => {
    setData(tableData)
  }, [tableData])

  // Hooks
  const { lang: locale } = useParams()

  console.log(categories, 'check')
  // console.log(transformedPayload, 'check1')
  const handleClick = () => {
    setCategoriesparent(true)
  }
  // Filter the displayed categories

  console.log(tableData, 'datachecking123')
  console.log(expandedParents, 'expandedparentsss')
  // Adjust filteredCategories to include children of expanded parents
  const selectedGuids = useMemo(() => {
    return Object.keys(rowSelection)
      .filter(key => rowSelection[key])
      .map(key => data[key]?.guid)
  }, [rowSelection, data, tableData])
  console.info(selectedGuids, 'selectedGuids')
  const filteredCategories = useMemo(() => {
    const result = []

    // transformedPayload.forEach(item => {
    //   if (item.parent_guid === null) {
    //     // Add parent category
    //     result.push(item)

    //     // If the parent is expanded, add its children
    //     if (expandedParents.includes(item.guid)) {
    //       const children = transformedPayload.filter(child => child.parent_guid === item.guid)
    //       result.push(...children)
    //     }
    //   }
    // })
    setFilteredData(result)
    return result
  }, [tableData, expandedParents])
  const hasChildren = guid => {
    console.log(guid, 'guid')
    return transformedPayload.some(category => category.id === guid)
  }
  console.log(expandedParents, 'kkkkkk')
  //need to create a global component for this Date format function so that we can use in dfferent components
  function formatDate(inputDate) {
    const date = new Date(inputDate)
    console.log(inputDate, 'sssss')
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', inputDate)
      return '' // Return an empty string or handle the error as needed
    }

    // Options for formatting the date
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }

    return new Intl.DateTimeFormat('en-GB', options).format(date).replace(',', ',') // Ensure the format is "DD Mon, YYYY HH:MM"
  }
  console.log('123456')
  const handleExpandCollapse = parentId => {
    setExpandedParents(
      prevState =>
        prevState.includes(parentId)
          ? prevState.filter(id => id !== parentId) // Collapse if already expanded
          : [...prevState, parentId] // Expand if not in the list
    )
  }

  // Flatten tree data for the table
  const flattenTreeData = (data, expandedParents) => {
    const flatten = (items, level = 0) => {
      return items.flatMap(item => {
        const isExpanded = expandedParents.includes(item.id)
        return [
          { ...item, level }, // Include the parent item
          ...(isExpanded && item.children ? flatten(item.children, level + 1) : []) // Include children if expanded
        ]
      })
    }
    return flatten(data)
  }

  const tableDatas = useMemo(
    () => (tableData.length > 0 ? flattenTreeData(tableData, expandedParents) : tableData),
    [tableData, expandedParents, data]
  )
  console.log(tableData, 'table123')
  // console.log(hasChildCategories, 'cccccc')
  const columns = useMemo(
    () =>
      columnOrder
        .map(columnId => {
          switch (columnId) {
            case 'select':
              return visibleColumns.select
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
              return visibleColumns.title
                ? columnHelper.accessor('title', {
                    header: 'Title',
                    cell: ({ row }) => {
                      const isParent = row.original.parent_guid === null
                      const hasChildCategories = isParent && hasChildren(row.original.parent_guid)
                      // const isExpanded = expandedParents.includes(row.original.id)
                      const hasChildren = row.original.children && row.original.children.length > 0
                      const isExpanded = expandedParents.includes(row.original.id)
                      console.log(row.original.title, 'cccc')
                      // console.log(hasChildren(row.original.parent_guid), 'hassss')
                      return (
                        <div className='flex items-center gap-3'>
                          <Typography
                            color='text.primary'
                            className='font-medium'
                            style={{
                              marginLeft: `${row.original.level * 20}px`,
                              cursor: hasChildren ? 'pointer' : 'default'
                            }}
                          >
                            {row.original.title}
                          </Typography>
                          {hasChildren && (
                            <button
                              className='expand-collapse-button'
                              style={{ background: 'none' }}
                              onClick={e => {
                                e.stopPropagation() // Prevent row click events
                                handleExpandCollapse(row.original.id)
                              }}
                            >
                              {isExpanded ? (
                                <i className='ri-arrow-down-s-line' />
                              ) : (
                                <i className='ri-arrow-right-s-line' />
                              )}
                            </button>
                          )}
                        </div>
                      )
                    }
                  })
                : null
            case 'created_by':
              if (trashView) {
                return visibleColumns.created_by
                  ? columnHelper.accessor('parent_guid', {
                      header: 'Deleted Date',
                      cell: ({ row }) => {
                        const parentCategory = data.find(item => item.guid === row.original.parent_guid)
                        {
                          console.log(row?.original, 'wos')
                        }
                        const formattedDate = formatDate(row?.original?.deleted_at)
                        return <Typography>{formattedDate}</Typography>
                      }
                    })
                  : null
              }
              return visibleColumns.created_by
                ? columnHelper.accessor('parent_guid', {
                    header: 'Creation Date',
                    cell: ({ row }) => {
                      const parentCategory = data.find(item => item.guid === row.original.parent_guid)
                      {
                        console.log(row?.original, 'wos')
                      }
                      const formattedDate = formatDate(row?.original?.created_at)
                      return <Typography>{formattedDate}</Typography>
                    }
                  })
                : null

            case 'test':
              if (trashView) {
                return null
              }

              return visibleColumns.test
                ? columnHelper.accessor('test', {
                    header: ' number of Questions',
                    cell: ({ row }) => (
                      <Typography>
                        <a href='#' style={{ textDecoration: 'underline', color: '#5C61E6', cursor: 'pointer' }}>
                          10
                        </a>
                      </Typography>
                    )
                  })
                : null

            case 'action':
              return columnHelper.accessor('action', {
                header: 'Action',
                cell: ({ row }) => (
                  <div className='flex items-center gap-0.5'>
                    {!trashView ? (
                      <>
                        <IconButton
                          size='small'
                          onClick={() => {
                            // deleteUserData(row?.original?.guid)
                            trashData(row?.original?.guid)
                          }}
                        >
                          <i className='ri-delete-bin-7-line text-textSecondary' />
                        </IconButton>

                        <IconButton size='small'>
                          <Link href={`/categories/edit?guid=${row?.original?.guid}`} className='flex'>
                            <i className='ri-edit-box-line text-textSecondary' />
                          </Link>
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton
                          size='small'
                          onClick={() => {
                            // deleteUserData(row?.original?.guid)
                            // trashData(row?.original?.guid)
                            resetData(row?.original?.guid)
                          }}
                        >
                          <i className='ri-reset-left-line' />
                        </IconButton>
                        <IconButton
                          size='small'
                          onClick={() => {
                            // deleteUserData(row?.original?.guid)
                            trashData(row?.original?.guid)
                          }}
                        >
                          <i className='ri-delete-bin-7-line text-textSecondary' />
                        </IconButton>
                      </>
                    )}
                  </div>
                ),
                enableSorting: false
              })
            default:
              return null
          }
        })
        .filter(Boolean),
    [columnOrder, visibleColumns, expandedParents, tableDatas, data]
  )

  const table = useReactTable({
    data: tableDatas,
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

  console.info(rowSelection, 'row')
  const [addData, setAddData] = useState(tableData)
  console.log(data, 'ssssscheck')
  return (
    <>
      <FilterHeader title='All Category' subtitle='Orders placed across your store' link='/test/list'>
        <Grid
          item
          xs={8}
          md={3}
          display='flex'
          alignItems='end'
          justifyContent='flex-end'
          /* Aligns the button to the right */ pb={3}
        >
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
            Add New Category
          </Button>
        </Grid>
      </FilterHeader>
      <Card>
        <Grid container item xs={12} display='flex' alignItems='center'>
          <Grid item xs={12}>
            <TableFilters
              setData={setFilteredData}
              tableData={filteredCategories}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              type={type}
              setType={setType}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} pl={5} alignItems='center' justifyContent='space-between'>
          <Grid item>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              {!trashView ? (
                <IconButton
                  disableRipple
                  disabled={!Object.keys(rowSelection)?.length}
                  sx={{
                    border: `1px solid ${Object.keys(rowSelection)?.length ? '#808080' : '#E7E7E7'}`,
                    borderRadius: 0
                  }}
                  onClick={() => trashData(selectedGuids)}
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
              ) : (
                <>
                  <IconButton
                    disableRipple
                    disabled={!Object.keys(rowSelection)?.length}
                    sx={{
                      border: `1px solid ${Object.keys(rowSelection)?.length ? '#808080' : '#E7E7E7'}`,
                      borderRadius: 0
                    }}
                    onClick={() => resetData(selectedGuids)}
                  >
                    {/* <CustomTooltip title='Add' arrow> */}
                    <i
                      class='ri-reset-left-line'
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
                  <IconButton
                    disableRipple
                    disabled={!Object.keys(rowSelection)?.length}
                    sx={{
                      border: `1px solid ${Object.keys(rowSelection)?.length ? '#808080' : '#E7E7E7'}`,
                      borderRadius: 0
                    }}
                    onClick={() => setOpen(true)}
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
                </>
              )}
            </Box>
          </Grid>
          {/* <Grid container item xs={6} spacing={3} display='flex' alignItems='center' justifyContent='flex-end'> */}
          <Grid item pr={8}>
            <Box display='flex' alignItems='center' justifyContent='flex-end'>
              <Typography style={{ cursor: 'pointer' }} onClick={handleActiveClick}>
                Active {activeDataLength}
              </Typography>
              <Typography style={{ cursor: 'pointer' }} sx={{ ml: 3 }} onClick={handleTrashClick}>
                Trash {trashDataLength}
              </Typography>
            </Box>
          </Grid>
          {/* </Grid> */}
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
      {data.length > 0 && (
        <AddTestDrawer
          open={addUserOpen}
          handleClose={() => setAddUserOpen(!addUserOpen)}
          userData={data}
          setData={setData}
          addUserData={addCategoryData}
        />
      )}
      {/* {open && (
        <AlertDialogBox
          open={open}
          handleCancel={handleCancelDelete}
          handleConfirm={handleConfirmDelete}
          title='Delete Users'
          textContent='Are you sure you want to delete this user?'
          acceptedButton='Delete'
          rejectedButton='Cancel'
        />
      )} */}
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
      {open && (
        <AlertDialogBox
          open={open}
          handleCancel={handleCancelDelete}
          handleConfirm={!trashView ? handleConfirmDelete : handleConfirmRecover}
          title='Delete Category'
          textContent={
            !trashView
              ? 'Are you sure you want to move this category to the trash?'
              : 'Are you sure you want to restore this category !'
          }
          acceptedButton={!trashView ? 'Delete' : 'Restore'}
          rejectedButton='Cancel'
        />
      )}
      {open && selectedGuids.length > 1 && (
        <AlertDialogBox
          open={open}
          handleCancel={handleCancelDelete}
          handleConfirm={!trashView ? handlemultipletrashDelete : handlemultipletrashRecover}
          title='Delete Category'
          textContent={
            !trashView
              ? 'Are you sure you want to move this category to the trash?'
              : 'Are you sure you want to restore this category !'
          }
          acceptedButton={!trashView ? 'Delete' : 'Restore'}
          rejectedButton='Cancel'
        />
      )}
    </>
  )
}

export default TestListTable
