import React from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Select,
  MenuItem,
  TextField,
  IconButton
} from '@mui/material'

// import { Bold, Italic, FormatSize } from '@mui/icons-material'
import Reactquill from './Reactquill'

const DialogBox = ({
  open,
  onClose,
  title,
  confirmText,
  cancelText = 'Cancel',
  onConfirm,
  statusOptions = [],
  roleOptions = [],
  selectedStatus,
  selectedRole,
  onChangeStatus,
  onChangeRole,
  isDeleteDialog,
  isStatusDialog,
  isRoleDialog,
  onSubmit,
  handleSubmit,
  handleReset,
  description,
  setDescription,
  edit
}) => {
  // const handleSubmit = () => {
  //   console.log('hye')
  // }
  return (
    <Dialog open={open} onClose={handleReset} sx={{ '& .MuiDialog-paper': { width: '1000px', maxWidth: '1000px' } }}>
      <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-5'>
        <DialogTitle>Update Section</DialogTitle>
        <DialogContent>
          {/* Title Field */}
          {/* <TextField label='Title *' variant='outlined' fullWidth sx={{ marginBottom: '16px' }} /> */}

          {/* Toolbar for formatting options */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            {/* <IconButton><FormatSize /></IconButton>
          <IconButton><Bold /></IconButton>
          <IconButton><Italic /></IconButton>
          <Select defaultValue="Sans Serif" sx={{ marginRight: '8px', width: '120px' }}>
            <MenuItem value="Sans Serif">Sans Serif</MenuItem>
            <MenuItem value="Serif">Serif</MenuItem>
          </Select>
          <Select defaultValue="Normal" sx={{ width: '120px' }}>
            <MenuItem value="Normal">Normal</MenuItem>
            <MenuItem value="Bold">Bold</MenuItem>

          </Select> */}
            <Reactquill
              value={description} // Pass description as value
              onChange={setDescription}
              label={'Description'}
            />
          </div>

          {/* Details Text Area */}
          {/* <TextField label='Details' multiline rows={4} variant='outlined' fullWidth sx={{ marginBottom: '16px' }} /> */}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleReset}
            // type='submit'
            type='reset'
            variant='outlined'
            color='error'
            sx={{ height: '38px', width: '94px' }}
          >
            {cancelText}
          </Button>
          <Button
            type='submit'
            // onClick={() => handleReset()}
            variant='contained'
            sx={{ height: '38px', width: '94px' }}
            autoFocus
          >
            {edit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default DialogBox
