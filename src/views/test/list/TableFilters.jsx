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

const TableFilters = ({
  setData,
  tableData,
  globalFilter,
  setGlobalFilter,
  type,
  searchKeyword,
  localSearch,
  setLocalSearch,
  localTrashSearch,
  setLocalTrashSearch,
  mode
}) => {
  // States
  const [types, setTypes] = useState([])
  const [status, setStatus] = useState([])

  useEffect(() => {
    const filteredData = tableData?.filter(user => {
      if (user?.status === '0' && status?.length) {
        if (status?.length && !status?.includes('Unpublished')) return false
      }

      if (user?.status === '1' && status?.length) {
        if (status?.length && !status?.includes('Published')) return false
      }

      if (types?.length > 0 && !types?.includes(user?.type)) return false

      return true
    })

    setData(filteredData || [])
  }, [type, status, tableData, setData, types])

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

    setTypes(typeof value === 'string' ? value?.split(',') : value)
  }

  const handleStatusChange = event => {
    const {
      target: { value }
    } = event

    setStatus(typeof value === 'string' ? value?.split(',') : value)
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
                sx={{
                  '& .MuiInputBase-root': {
                    height: '40px',
                    minHeight: 'auto'
                  },
                  '& .MuiInputLabel-root': {
                    top: '-7px'
                  }
                }}
                // variant='outlined'
                placeholder='Search'
                fullWidth
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <i className='ri-search-line' style={{ color: '#262B4366' }} />
                    </InputAdornment>
                  )
                }}
              />
            ) : (
              <TextField
                sx={{
                  '& .MuiInputBase-root': {
                    height: '40px',
                    minHeight: 'auto'
                  },
                  '& .MuiInputLabel-root': {
                    top: '-7px'
                  }
                }}
                // variant='outlined'
                placeholder='Search'
                fullWidth
                value={localTrashSearch}
                onChange={e => setLocalTrashSearch(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <i className='ri-search-line' style={{ color: '#262B4366' }} />
                    </InputAdornment>
                  )
                }}
              />
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
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
              renderValue={selected => selected?.join(', ')}

              // inputProps={{ placeholder: 'Filter by type' }}
            >
              <MenuItem key='evaluated' value='evaluated'>
                <Checkbox checked={types?.indexOf('evaluated') > -1} />
                <ListItemText primary='Evaluated' /> {/* Capitalize first letter */}
              </MenuItem>
              <MenuItem key='practice' value='practice'>
                <Checkbox checked={types?.indexOf('practice') > -1} />
                <ListItemText primary='Practice' /> {/* Capitalize first letter */}
              </MenuItem>
              <MenuItem key='quiz' value='quiz'>
                <Checkbox checked={types?.indexOf('quiz') > -1} />
                <ListItemText primary='Quiz' /> {/* Capitalize first letter */}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
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
            <InputLabel id='status-select'>Filter by status</InputLabel>
            <Select
              fullWidth
              id='select-status'
              label='Filter by status'
              size='small'
              value={status}
              labelId='status-select'
              multiple
              onChange={handleStatusChange}
              renderValue={selected => selected?.join(', ')}

              // inputProps={{ placeholder: 'Select Status' }}
            >
              <MenuItem key='Published' value='Published'>
                <Checkbox checked={status?.indexOf('Published') > -1} />
                <ListItemText primary='Published' /> {/* Capitalize first letter */}
              </MenuItem>
              {/* <MenuItem value='Published'>Published</MenuItem> */}
              <MenuItem key='Unpublished' value='Unpublished'>
                <Checkbox checked={status?.indexOf('Unpublished') > -1} />
                <ListItemText primary='Unpublished' /> {/* Capitalize first letter */}
              </MenuItem>
              {/* <MenuItem value='Unpublished'>Unpublished</MenuItem> */}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
