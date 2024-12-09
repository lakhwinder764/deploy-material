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

const TestFilters = ({ setData, tableData, globalFilter, setGlobalFilter, type }) => {
  // States
  const [types, setTypes] = useState([])
  const [status, setStatus] = useState([])

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
          {/* <Grid item xs={9} display='flex' justifyContent='flex-end'>
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
          </Grid> */}
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search Test'
              className='max-sm:is-full'
            />
          </FormControl>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TestFilters
