// MUI Imports
import React, { useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import { useDropzone } from 'react-dropzone'
import Link from '@mui/material/Link'

// Styled Dropzone Component
const Dropzone = styled('div')(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(12),
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(5)
    }
  }
}))

const UploadInviteDialog = () => {
  // State for dialog visibility
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState([])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles?.map(file => Object.assign(file)))
    }
  })

  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles?.filter(i => i?.name !== file?.name)

    setFiles([...filtered])
  }

  const fileList = files?.map(file => (
    <ListItem key={file?.name}>
      <div className='file-details'>
        <Typography className='file-name' color='text.primary'>
          {file?.name}
        </Typography>
        <Typography variant='body2'>
          {Math.round(file?.size / 100) / 10 > 1000
            ? `${(Math.round(file?.size / 100) / 10000).toFixed(1)} mb`
            : `${(Math.round(file?.size / 100) / 10).toFixed(1)} kb`}
        </Typography>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <i className='ri-close-line' />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  return (
    <>
      {/* Button to open the dialog */}
      <Button variant='contained' onClick={() => setOpen(true)}>
        Upload Invite
      </Button>

      {/* Upload Invite Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='sm'>
        <DialogContent>
          <Dropzone>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <div className='flex items-center flex-col gap-2 text-center'>
                <Typography variant='h4'>Upload File</Typography>
                <i className='ri-upload-2-line text-[28px]' />
                <Typography variant='h6'>Drag and Drop Your File Here</Typography>
                {/* <Typography color='text.disabled'>or</Typography>
                <Button variant='outlined' size='small'>
                  Browse File
                </Button> */}
                <Typography variant='caption' color='textSecondary' className='text-center'>
                  Upload CSV file
                </Typography>
              </div>
            </div>
          </Dropzone>
          <div className='flex justify-center gap-2 items-center'>
            <Button variant='contained' color='primary' onClick={() => setOpen(false)}>
              Upload
            </Button>
            <Button variant='outlined' color='secondary' onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
          <Typography className='text-center mt-2'>
            <Link href='/path-to-sample.csv' download>
              Download sample CSV file
            </Link>
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UploadInviteDialog
