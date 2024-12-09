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

const QuestionMarkingFilters = ({ setData, tableData }) => {
  // States
  const [difficulty, setDifficulty] = useState([])
  const [importance, setImportance] = useState([])

  useEffect(() => {
    const filteredData = tableData?.filter(user => {
      if (difficulty?.length > 0 && !difficulty?.includes(user?.difficulty)) return false
      if (importance?.length > 0 && !importance?.includes(user?.importance)) return false

      return true
    })

    setData(filteredData || [])
  }, [importance, difficulty, tableData, setData])

  const handleDifficultyChange = event => {
    const {
      target: { value }
    } = event

    setDifficulty(typeof value === 'string' ? value.split(',') : value)
  }

  const handleImportanceChange = event => {
    const {
      target: { value }
    } = event

    setImportance(typeof value === 'string' ? value?.split(',') : value)
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
                setImportance([])
                setDifficulty([])
              }}
            >
              Reset Filter
            </a>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6}>
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
            <InputLabel id='type-select'>Difficulty Level</InputLabel>
            <Select
              fullWidth
              size='small'
              id='select-difficulty'
              label='Difficulty Level'
              labelId='difficulty-select'
              value={difficulty}
              multiple
              onChange={handleDifficultyChange}
              renderValue={selected => selected?.join(', ')}
            >
              <MenuItem key='high' value='high'>
                <Checkbox checked={difficulty?.indexOf('high') > -1} />
                <ListItemText primary='High' /> {/* Capitalize first letter */}
              </MenuItem>
              <MenuItem key='medium' value='medium'>
                <Checkbox checked={difficulty?.indexOf('medium') > -1} />
                <ListItemText primary='Medium' /> {/* Capitalize first letter */}
              </MenuItem>
              <MenuItem key='low' value='low'>
                <Checkbox checked={difficulty?.indexOf('low') > -1} />
                <ListItemText primary='Low' /> {/* Capitalize first letter */}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
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
            <InputLabel id='status-select'>Importance</InputLabel>
            <Select
              fullWidth
              id='select-importance'
              label='Importance'
              size='small'
              value={importance}
              labelId='status-importance'
              multiple
              onChange={handleImportanceChange}
              renderValue={selected => selected?.join(', ')}
            >
              <MenuItem key='high' value='high'>
                <Checkbox checked={importance?.indexOf('high') > -1} />
                <ListItemText primary='high' />
              </MenuItem>
              <MenuItem key='medium' value='medium'>
                <Checkbox checked={importance?.indexOf('medium') > -1} />
                <ListItemText primary='Medium' />
              </MenuItem>
              <MenuItem key='low' value='low'>
                <Checkbox checked={importance?.indexOf('low') > -1} />
                <ListItemText primary='Low' />
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default QuestionMarkingFilters
