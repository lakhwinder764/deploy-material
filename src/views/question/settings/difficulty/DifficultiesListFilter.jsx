// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { Checkbox, InputAdornment, ListItemText, TextField, Typography } from '@mui/material'

const DifficultiesListFilter = ({
  setData,
  tableData,
  globalFilter,
  setGlobalFilter,
  type,
  searchKeyword,
  setSearchKeyword,
  searchTrashKeyword,
  setSearchTrashKeyword,
  fetchData,
  mode
}) => {
  // States
  const [types, setTypes] = useState([])
  const [status, setStatus] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [localSearch, setLocalSearch] = useState('')
  const [localTrashSearch, setLocalTrashSearch] = useState('')

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

  // useEffect(() => {
  //   fetchData(searchKeyword)
  // }, [searchKeyword])
  useEffect(() => {
    const filteredData = tableData?.filter(user => {
      // Filter for parent categories where parent_guid is null
      if (user?.guid !== null) return false

      // Find the title of the current user for status filtering
      const userStatusTitle = tableData?.find(item => item?.title === user?.title)

      // Log userStatusTitle to inspect its value

      // Filter by status (title) based on selected status
      if (status?.length > 0) {
        // If no userStatusTitle is found or if it doesn't match selected status, filter out the item
        if (!userStatusTitle || !status?.includes(userStatusTitle?.title)) {
          return false
        }
      }

      return true
    })

    setData(filteredData || [])
  }, [status, types, tableData, setData, searchTerm])

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

    return (
      <TextField
        {...props}
        size='small'
        value={value}
        onChange={e => setValue(e.target.value)}
        InputProps={{
          endAdornment: (
            <i
              class='ri-search-line'
              style={{
                color: '#B3B5BD'
              }}
            ></i>
          )
        }}
      />
    )
  }

  const handleTypeChange = event => {
    const {
      target: { value }
    } = event

    setTypes(typeof value === 'string' ? value.split(',') : value)
  }

  const handleStatusChange = event => {
    const {
      target: { value }
    } = event

    setStatus(typeof value === 'string' ? value.split(',') : value)
  }

  return (
    <CardContent>
      <Grid container spacing={5} xs={12} display='flex' alignItems='center' pr={0}>
        <Grid item container xs={12} display='flex' justifyContent='space-between'>
          <Grid item xs={3}>
            <Typography fontWeight='bold' fontSize={18}>
              Filter
            </Typography>
          </Grid>
          <Grid item xs={9} display='flex' justifyContent='flex-end'>
            <a
              style={{
                cursor: 'pointer',
                color: '#FF4D49',
                textDecoration: 'underline',
                fontWeight: 500,
                fontSize: 15,
                textUnderlineOffset: 3
              }}
              onClick={() => {
                setStatus([])
                setGlobalFilter('')
                setTypes([])
              }}
            >
              Reset Filter
            </a>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            {mode === 'all' ? (
              <TextField
                size='small'
                sx={{
                  '& .MuiInputBase-root': {
                    height: '40px',
                    minHeight: 'auto'
                  },
                  '& .MuiInputLabel-root': {
                    top: '-7px'
                  }
                }}
                placeholder='Search Difficulty'
                fullWidth
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <i
                      class='ri-search-line'
                      style={{
                        color: '#B3B5BD'
                      }}
                    ></i>
                  )
                }}
              />
            ) : (
              <TextField
                size='small'
                sx={{
                  '& .MuiInputBase-root': {
                    height: '40px',
                    minHeight: 'auto'
                  },
                  '& .MuiInputLabel-root': {
                    top: '-7px'
                  }
                }}
                placeholder='Search Difficulty'
                fullWidth
                value={localTrashSearch}
                onChange={e => setLocalTrashSearch(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <i
                      class='ri-search-line'
                      style={{
                        color: '#B3B5BD'
                      }}
                    ></i>
                  )
                }}
              />
            )}
          </FormControl>
        </Grid>
        {/* <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            sx={{
              '& .MuiInputBase-root': {
                height: '40px',
                minHeight: 'auto'
              },
              '& .MuiInputLabel-root': {
                top: '-7px'
              }
            }}
          >
            <InputLabel id='type-select'>Filter by type</InputLabel>
            <Select
              fullWidth
              size='small'
              id='select-type'
              label='Filter by type'
              labelId='type-select'
              value={types}
              multiple
              onChange={handleTypeChange}
              renderValue={selected => selected.join(', ')}
            >
              <MenuItem key='evaluated' value='evaluated'>
                <Checkbox checked={types.indexOf('evaluated') > -1} />
                <ListItemText primary='Evaluated' />
              </MenuItem>
              <MenuItem key='practice' value='practice'>
                <Checkbox checked={types.indexOf('practice') > -1} />
                <ListItemText primary='Practice' />
              </MenuItem>
              <MenuItem key='quiz' value='quiz'>
                <Checkbox checked={types.indexOf('quiz') > -1} />
                <ListItemText primary='Quiz' />
              </MenuItem>
            </Select>
          </FormControl>
        </Grid> */}
      </Grid>
    </CardContent>
  )
}

export default DifficultiesListFilter
