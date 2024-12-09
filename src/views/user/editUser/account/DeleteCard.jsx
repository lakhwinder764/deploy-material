import { Card, CardContent, CardHeader, Button, TextField, MenuItem, Box , FormControl, InputLabel, Select, Typography } from '@mui/material';

const DeleteCard = () => {

return(
  <Card sx={{ width: '100%', padding: 4, marginTop: 10}} >

<div className='flex is-full flex-wrap justify-start flex-col items-center sm:flex-row sm:justify-between sm:items-center gap-5'>
          <div className='flex flex-col items-center sm:items-start gap-2'>
            <Typography variant='h4'>Delete Account</Typography>
            <div className='flex flex-wrap gap-6 gap-y-3 justify-center sm:justify-normal min-bs-[38px]'>
            <Typography variant="caption" color="textSecondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Typography>
            </div>
          </div>

          <div className='flex flex-wrap gap-6 gap-y-3 justify-center sm:justify-normal min-bs-[38px]'>


          <Button variant="outlined" color="error">

            Delete Account
          </Button>
          </div>
        </div>


  </Card>
)

}

export default DeleteCard
