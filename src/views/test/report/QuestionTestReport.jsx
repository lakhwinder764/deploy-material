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
import { styled, useTheme } from '@mui/material/styles'
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

import AlertDialogBox from '@/components/Common/AlertDialogBox'
import DialogBoxComponent from '@/components/Common/DialogBoxComponent'
import FilterHeader from '@/components/globals/FilterHeader'
import { getInitials } from '@/utils/getInitials'
import useDraggableList from '@/components/globals/useDraggableList'
import AttemptTestFilters from '../attempts/AttemptTestFilters'
import QuestionMarkingFilters from '../marking/QuestionMarkingFilters'
import QuestionHeader from './QuestionHeader'

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

// Column Definitions
const columnHelper = createColumnHelper()

const IconButtonWrapper = props => {
  // Props
  const { tooltipProps, children } = props
  const [open, setOpen] = useState(false)

  return tooltipProps?.title ? <Tooltip {...tooltipProps}>{children}</Tooltip> : children
}

const QuestionTestReport = () => {
  // States
  const [rowId, setRowId] = useState('')
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const theme = useTheme()
  const [openTextFieldIds, setOpenTextFieldIds] = useState([])

  console.info(openTextFieldIds)

  const initialData = [
    {
      id: 1,
      question:
        'A car covers a distance of 40 km in 24 minutes. If its speed is decreased by 40 km/hr, then what will be the time taken by it to cover the same distance?',
      remark: true,
      time: 0.5,
      marks: 1,
      importance: 'high',
      difficulty: 'high',
      choices: [
        {
          choice: '18 minutes',
          correct_answer: '1',
          position: '1',
          choice_key: 'choice_0'
        },
        {
          choice: '28 minutes',
          correct_answer: '0',
          position: '2',
          choice_key: 'choice_1'
        },
        {
          choice: '38 minutes',
          correct_answer: '0',
          position: '3',
          choice_key: 'choice_2'
        }
      ],
      feedback: 'feedback1'
    },
    {
      id: 2,

      question:
        'A car covers a distance of 40 km in 24 minutes. If its speed is decreased by 40 km/hr, then what will be the time taken by it to cover the same distance?',
      remark: true,
      time: 0.5,
      marks: 1,
      importance: 'low',
      difficulty: 'high',
      choices: [
        {
          choice: '28 minutes',
          correct_answer: '1',
          position: '1',
          choice_key: 'choice_0'
        },
        {
          choice: '38 minutes',
          correct_answer: '0',
          position: '2',
          choice_key: 'choice_1'
        },
        {
          choice: '78 minutes',
          correct_answer: '0',
          position: '3',
          choice_key: 'choice_2'
        }
      ],
      feedback: 'feedback2'
    },
    {
      id: 3,

      question:
        'A car covers a distance of 40 km in 24 minutes. If its speed is decreased by 40 km/hr, then what will be the time taken by it to cover the same distance?',
      remark: false,
      time: 0.6,
      marks: 2,
      importance: 'high',
      difficulty: 'low',
      choices: [
        {
          choice: '48 minutes',
          correct_answer: '1',
          position: '1',
          choice_key: 'choice_0'
        },
        {
          choice: '28 minutes',
          correct_answer: '0',
          position: '2',
          choice_key: 'choice_1'
        },
        {
          choice: '38 minutes',
          correct_answer: '0',
          position: '3',
          choice_key: 'choice_2'
        }
      ],
      feedback: 'feedback3'
    },
    {
      id: 4,

      question:
        'A car covers a distance of 40 km in 24 minutes. If its speed is decreased by 40 km/hr, then what will be the time taken by it to cover the same distance?',
      remark: true,
      time: 0.2,
      marks: 6,
      importance: 'high',
      difficulty: 'high',
      choices: [
        {
          choice: '48 minutes',
          correct_answer: '1',
          position: '1',
          choice_key: 'choice_0'
        },
        {
          choice: '28 minutes',
          correct_answer: '0',
          position: '2',
          choice_key: 'choice_1'
        },
        {
          choice: '38 minutes',
          correct_answer: '0',
          position: '3',
          choice_key: 'choice_2'
        }
      ],
      feedback: 'feedback4'
    },
    {
      id: 5,

      // question:"A car covers a distance of 40 km in 24 minutes. If its speed is decreased by 40 km/hr, then what will be the time taken by it to cover the same distance?",
      question: 'this is my name ',
      remark: false,
      time: 0.1,
      marks: 3,
      importance: 'low',
      difficulty: 'low',
      choices: [
        {
          choice: '48 minutes',
          correct_answer: '1',
          position: '1',
          choice_key: 'choice_0'
        },
        {
          choice: '28 minutes',
          correct_answer: '0',
          position: '2',
          choice_key: 'choice_1'
        },
        {
          choice: '38 minutes',
          correct_answer: '0',
          position: '3',
          choice_key: 'choice_2'
        }
      ],
      feedback: 'feedback5'
    }
  ]

  const [rowSelection, setRowSelection] = useState({})

  // const [data, setData] = useState(...[tableData])
  const [data, setData] = useState(initialData)

  const [filteredData, setFilteredData] = useState(data)

  const initialColumns = ['serialno', 'question', 'remark', 'mark', 'time']

  const [visibleColumns, setVisibleColumns] = useState({
    sno: true,
    question: true,
    remark: true,
    time: true,
    mark: true
  })

  const { items: columnOrder, handleDragOver, handleDrop, handleDragStart } = useDraggableList(initialColumns)

  // useEffect(() => {
  //   setData(tableData)
  // }, [tableData])

  const toggleTextField = itemId => {
    setOpenTextFieldIds(prevIds => {
      if (prevIds?.includes(itemId)) {
        // If the text field for this item is open, remove it from the state
        return prevIds?.filter(id => id !== itemId)
      } else {
        // If it's not open, add the item ID to the state
        return [...prevIds, itemId]
      }
    })
  }

  const columns = useMemo(
    () =>
      columnOrder
        .map(columnId => {
          switch (columnId) {
            case 'serialno':
              return visibleColumns.sno
                ? columnHelper.accessor('id', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        SR NO.
                      </Typography>
                    ),
                    cell: info => info.getValue()
                  })
                : null
            case 'question':
              return visibleColumns.question
                ? columnHelper.accessor('question', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        question
                      </Typography>
                    ),
                    cell: ({ row }) => (
                      <div
                        className='flex items-center flex-wrap'
                        style={{
                          maxWidth: '700px'
                        }}
                      >
                        <div
                          className='flex items-center flex-wrap'
                          style={{
                            wordBreak: 'break-word',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'

                            // textOverflow: 'ellipsis'
                          }}
                        >
                          <Typography
                            color='text.primary'
                            className='font-medium pl-3'
                            sx={{
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {row.original.question}
                          </Typography>
                        </div>
                      </div>
                    )
                  })
                : null
            case 'remark':
              return visibleColumns.remark
                ? columnHelper.accessor('remark', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        remark
                      </Typography>
                    ),
                    cell: ({ row }) =>
                      row.original.remark ? (
                        <img
                          src='/images/icons/remark-check.svg'
                          alt='no_img'
                          style={{
                            width: '20px',
                            height: '20px',
                            marginRight: 10
                          }}
                        />
                      ) : (
                        <img
                          src='/images/icons/remark-close.svg'
                          alt='no_img'
                          style={{
                            width: '20px',
                            height: '20px',
                            marginRight: 10
                          }}
                        />
                      )
                  })
                : null
            case 'mark':
              return visibleColumns.mark
                ? columnHelper.accessor('marks', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        Mark
                      </Typography>
                    ),
                    cell: info => info.getValue()
                  })
                : null
            case 'time':
              return visibleColumns.time
                ? columnHelper.accessor('time', {
                    header: (
                      <Typography fontWeight='bold' fontSize={13}>
                        Time taken (in sec)
                      </Typography>
                    ),
                    cell: ({ row }) => <Typography>{row.original.time}</Typography>
                  })
                : null

            default:
              return null
          }
        })
        .filter(Boolean),
    [columnOrder, visibleColumns, data]
  )

  // Function to handle marks change
  const handleMarksChange = (e, id) => {
    const newMarks = e.target.value

    setData(oldData => oldData?.map(row => (row?.id === id ? { ...row, marks: newMarks } : row)))
  }

  const dialogData = [
    {
      question: 'Study the information given below and answer the questions based on it?',
      choices: [
        {
          choice: '48 minutes',
          correct_answer: '1',
          position: '1',
          choice_key: 'choice_0'
        },
        {
          choice: '28 minutes',
          correct_answer: '0',
          position: '2',
          choice_key: 'choice_1'
        },
        {
          choice: '38 minutes',
          correct_answer: '0',
          position: '3',
          choice_key: 'choice_2'
        }
      ],
      feedback: 'this is not correct answer'
    }
  ]

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection
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

    // onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const handleCancelDelete = () => {
    setOpen(false)
  }

  const handleConfirmDelete = () => {
    setOpen(false)
  }

  return (
    <>
      <Card
        sx={{
          my: 5
        }}
      >
        <Grid item xs={12}>
          <QuestionHeader attemptQuestions={3} notAnsweredQuestions={10} wrongQuestions={3} correctQuestions={4} />
        </Grid>
      </Card>
      <Card>
        <Grid item xs={12}>
          <QuestionMarkingFilters setData={setFilteredData} tableData={data} />
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
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns()?.length} className='text-center'>
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
                      <>
                        <tr
                          key={row.id}
                          className={classnames({ selected: row.getIsSelected() })}
                          style={{
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            setOpen(!open)
                          }}
                        >
                          {row.getVisibleCells().map(cell => {
                            console.info(cell?.column?.id === 'question')

                            return (
                              <IconButtonWrapper
                                tooltipProps={
                                  cell?.column?.id === 'question' && {
                                    title: row?.original?.question,
                                    placement: 'top',
                                    arrow: true
                                  }
                                }
                                key={cell?.id}
                              >
                                <td
                                  key={cell.id}
                                  style={{
                                    ...(cell?.column?.id === 'question' && {
                                      width: '700px'
                                    }),
                                    ...(cell?.column?.id === 'id' && {
                                      width: '100px'
                                    })
                                  }}
                                  onClick={() => {
                                    setRowId(row?.id)
                                    toggleTextField(row?.id)
                                    setExpanded(!expanded)
                                  }}
                                >
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                              </IconButtonWrapper>
                            )
                          })}
                        </tr>
                        <tr>
                          <td
                            colSpan={6}
                            style={{
                              height: '0px',
                              padding: '0px',
                              margin: '0px'
                            }}
                          >
                            {openTextFieldIds?.includes(row?.id) && (
                              // && rowId === row?.id && expanded
                              <Box key={row} p={6}>
                                <Box display='flex' flexDirection='column' pb={4}>
                                  <Typography variant='h5' fontWeight='bold'>
                                    Question
                                  </Typography>
                                  <Typography py={2}>{row?.original?.question}</Typography>
                                  <Box display='flex' flexDirection='column'>
                                    {row?.original?.choices?.map(item => (
                                      <Box key={item}>
                                        <Typography
                                          fontSize={13}
                                          color={item?.correct_answer === '1' ? 'success.main' : 'secondary.main'}
                                        >
                                          {item?.choice}
                                        </Typography>
                                      </Box>
                                    ))}
                                  </Box>
                                </Box>
                                <Box display='flex' flexDirection='column' pb={5}>
                                  <Typography variant='h5' fontWeight='bold'>
                                    Solutions
                                  </Typography>
                                  <Box display='flex' alignItems='center'>
                                    <Typography color='common.black' fontSize={12} fontWeight='bold'>
                                      Correct Answer :{''}
                                    </Typography>
                                    <Typography color='success.main' pl={1} pt={2}>
                                      "A" is Correct
                                    </Typography>
                                  </Box>
                                  <Box display='flex' alignItems='center'>
                                    <Typography color='common.black' fontSize={12} fontWeight='bold'>
                                      Your Answer :{' '}
                                    </Typography>
                                    <Typography color='error.main' pl={1}>
                                      "D" is wrong
                                    </Typography>
                                  </Box>
                                </Box>
                                <Typography fontWeight='bold' fontSize={12} color='common.black'>
                                  Why it is wrong
                                </Typography>
                                <Box display='flex' pt={3}>
                                  <Box>
                                    <i
                                      class='ri-circle-fill'
                                      style={{
                                        color: theme?.palette?.common?.grey,
                                        width: '8px',
                                        height: '8px'
                                      }}
                                    ></i>
                                  </Box>
                                  <Typography pl={2} fontSize={14}>
                                    {row?.original?.feedback}
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                          </td>
                        </tr>
                      </>
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
    </>
  )
}

export default QuestionTestReport
