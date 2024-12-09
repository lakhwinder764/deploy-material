'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

// Component Imports
import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, Backdrop } from '@mui/material'

import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
import AppReactDropzone from '@/Components/globals/AppReactDropzone'
import Link from '@/Components/globals/Link'

// Styled Dropzone Component
const Dropzone = styled(AppReactDropzone)(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(12),
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(5)
    },
    '&+.MuiList-root .MuiListItem-root .file-name': {
      fontWeight: theme.typography.body1.fontWeight
    }
  }
}))

const QuestionUpload = ({ files, setFiles }) => {
  // States

  const [uploadFile, setUploadFile] = useState(false)

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFiles(prevFiles => [...prevFiles, ...acceptedFiles])
    }
  })

  const renderFilePreview = file => {
    if (file?.type?.startsWith('image')) {
      return <img width={38} height={38} alt={file?.name} src={URL.createObjectURL(file)} />
    } else {
      return <i className='ri-file-text-line' />
    }
  }

  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles?.filter(i => i?.name !== file?.name)

    setFiles([...filtered])
  }

  const fileList = files?.map(file => (
    <ListItem
      key={file?.name}
      className='pis-4 plb-3'
      sx={{
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      <div
        className='file-details'
        style={{
          display: 'flex'
        }}
      >
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div
          style={{
            marginLeft: 10
          }}
        >
          <Typography className='file-name font-medium' color='text.primary'>
            {file?.name}
          </Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file?.size / 100) / 10 > 1000
              ? `${(Math.round(file?.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file?.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <i className='ri-close-line text-xl' />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  const handleClose = () => setUploadFile(false)

  return (
    // eslint-disable-next-line lines-around-comment
    // <Dropzone>
    //   <div {...getRootProps({ className: 'dropzon' })}>
    //     <input {...getInputProps()} />
    //     <div
    //     // className='flex items-center flex-col gap-2 text-center'
    //     >
    //       {/* <CustomAvatar variant='rounded' skin='light' color='secondary'>
    //         <i className='ri-upload-2-line' />
    //       </CustomAvatar>
    //       <Typography variant='h4'>Attach File.</Typography>
    //       <Typography color='text.disabled'>Allowed file type are image, video, audio and pdf</Typography>
    //       <Typography color='text.disabled'>or</Typography> */}
    //       <Button variant='outlined' size='small'
    //       onClick={() => setUploadFile(true)}
    //       >
    //         Browse File
    //       </Button>
    //     </div>
    //   </div>
    //   {files.length ? (
    //     <>
    //       <List>{fileList}</List>
    //       <div className='buttons'>
    //         <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
    //           Remove All
    //         </Button>
    //         <Button variant='contained'>Upload Files</Button>
    //       </div>
    //     </>
    //   ) : null}
    // </Dropzone>
    <>
      <Button variant='outlined' size='small' onClick={() => setUploadFile(true)}>
        Attach File
      </Button>
      <Dialog
        open={uploadFile}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: '600px', padding: 10 } }} // Setting the width and maxWidth
      >
        <DialogTitle>
          <IconButton
            aria-label='close'
            onClick={handleClose}
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
          <div className='flex items-center flex-col gap-2 text-center'>
            <CustomAvatar variant='rounded' skin='light' color='secondary'>
              <i className='ri-upload-2-line' />
            </CustomAvatar>
            <Typography variant='h4'>Attach File.</Typography>
            <Typography color='text.disabled'>Allowed file type are image, video, audio and pdf</Typography>
            <Typography color='text.disabled'>or</Typography>
            <Box display='flex' justifyContent='space-between' flexGrow={1}>
              <Dropzone>
                <div {...getRootProps({ className: 'dropzon' })}>
                  <input {...getInputProps()} />
                  <Button
                    variant='contained'
                    size='small'
                    sx={{
                      margin: 2
                    }}
                  >
                    Browse File
                  </Button>
                </div>
              </Dropzone>
              <Button
                variant='outlined'
                color='primary'
                size='small'
                type='reset'
                onClick={() => setUploadFile(false)}
                sx={{
                  margin: 2
                }}
              >
                Cancel
              </Button>
            </Box>
          </div>
          {files?.length ? (
            <>
              <List>{fileList}</List>
              <div
                className='buttons'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Button
                  color='error'
                  variant='outlined'
                  onClick={handleRemoveAllFiles}
                  style={{
                    margin: 5
                  }}
                >
                  Remove All
                </Button>
                <Button
                  variant='contained'
                  style={{
                    margin: 5
                  }}
                  onClick={() => {
                    setUploadFile(false)
                  }}
                >
                  Upload Files
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default QuestionUpload
