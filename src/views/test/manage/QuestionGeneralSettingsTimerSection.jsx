import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Checkbox,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Grid,
  CardContent,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Radio,
  FormControlLabel,
  RadioGroup,
  CircularProgress
} from '@mui/material'
import { Controller } from 'react-hook-form'

const QuestionGeneralSettingsTimingSection = ({ control, heading, children }) => {
  return (
    <Grid item xs={12} sm={6} pt={3}>
      <Box display='flex' flexDirection='column' justifyContent='flex-start' alignItems='flex-start'>
        <Typography component='h3'>{heading}</Typography>
        <Box mt={3} />
        {children}
      </Box>
    </Grid>
  )
}

export default QuestionGeneralSettingsTimingSection
