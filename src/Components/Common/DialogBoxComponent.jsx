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
  FormControl,
  InputLabel,
  IconButton
} from '@mui/material'

const DialogBoxComponent = ({
  open,
  onClose,
  title,
  description,
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
  isTemplateDialog,
  children
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          width: '600px',
          maxWidth: '600px',
          ...(isTemplateDialog && {
            padding: 6
          })
        }
      }}
    >
      <DialogTitle>
        {title}
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
        >
          <i class='ri-close-line'></i>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
        {isStatusDialog && (
          <FormControl
            fullWidth
            sx={{
              marginTop: 5
            }}
          >
            <InputLabel id='type-select'>Change Status</InputLabel>
            <Select
              labelId='type-select'
              value={selectedStatus}
              onChange={onChangeStatus}
              fullWidth
              label='Change Status'
            >
              {statusOptions?.map(status => (
                <MenuItem key={status} value={status}>
                  {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {isRoleDialog && (
          <Select value={selectedRole} onChange={onChangeRole} fullWidth>
            {roleOptions?.map(role => (
              <MenuItem key={role} value={role}>
                {role?.charAt(0)?.toUpperCase() + role?.slice(1)}
              </MenuItem>
            ))}
          </Select>
        )}
        {isTemplateDialog && children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} style={{ border: '1px solid black', color: 'black', height: '38px', width: '94px' }}>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} variant='contained' style={{ height: '38px', width: '94px' }} autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogBoxComponent
