'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import { useRouter, useSearchParams } from 'next/navigation'

import { useSearchParam } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { useDispatch } from 'react-redux'

// import { setFiles, removeFile, removeAllFiles, uploadFilesAsync } from '@redux-store/slices/fileSlice'
// Third-party Imports
import { useDropzone } from 'react-dropzone'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
import AppReactDropzone from '@/libs/styles/AppReactDropzone'

// import useQuestionApi from '../../Api/useQuestionApi'
import { setFiles, uploadFilesAsync } from '@/redux-store/slices/fileSlice'
import useQuestionModuleApi from '@/api/useQuestionModuleApi'
import FilterHeader from '@/Components/globals/FilterHeader'

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

// const [files, setFiles] = useState([])

// Hooks
const convertFileToBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const convertBase64ToFile = (base64String, filename, mimeType) => {
  const byteString = atob(base64String.split(',')[1])
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  return new File([ab], filename, { type: mimeType })
}

const saveFilesToLocalStorage = async files => {
  try {
    const fileDataPromises = files.map(async file => {
      const base64Data = await convertFileToBase64(file)

      return {
        name: file.name,
        type: file.type,
        size: file.size,
        data: base64Data
      }
    })

    const fileData = await Promise.all(fileDataPromises)

    localStorage.setItem('uploadedFiles', JSON.stringify(fileData))
  } catch (e) {
    console.warn('Could not save files:', e)
  }
}

const loadFilesFromLocalStorage = () => {
  try {
    const fileData = JSON.parse(localStorage.getItem('uploadedFiles'))

    if (fileData === null) {
      return []
    }

    return fileData.map(({ name, type, size, data }) => {
      return convertBase64ToFile(data, name, type)
    })
  } catch (e) {
    console.warn('Could not load files:', e)

    return []
  }
}

const ImportQuestion = () => {
  const searchParams = useSearchParams()
  const categoryGuid = 'guid'
  const testGuid = searchParams.get('testguid')
  const sectionGuid = searchParams.get('sectionguid')
  const guid = searchParams.get('guid')
  const router = useRouter()

  // States
  const { data: questions, loader, uploadFiles, uploading, uploadData } = useQuestionModuleApi()

  // const [uploadData, setUploadData] = useState([])
  const dispatch = useDispatch()

  // const [localfile, setLocalFiles] = useState([])
  const [files, setLocalFiles] = useState([])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      const newFiles = acceptedFiles.map(file => Object.assign(file))

      setLocalFiles(newFiles)
    },
    accept: {
      'text/plain': ['.txt'], // Text files
      'text/csv': ['.csv'], // CSV files
      'application/msword': ['.doc', '.docx'] // DOC files (includes .docx for more compatibility)
    }
  })

  useEffect(() => {
    // Load files from localStorage when the component mounts
    const loadedFiles = loadFilesFromLocalStorage()

    setLocalFiles(loadedFiles)
  }, [])

  useEffect(() => {
    // Save files to localStorage when files change
    saveFilesToLocalStorage(files)
  }, [files])

  // localStorage.setItem('uploadedFiles', files)
  // Hooks
  //   const { getRootProps, getInputProps } = useDropzone({
  //     onDrop: acceptedFiles => {
  //       setFiles(acceptedFiles.map(file => Object.assign(file)))
  //     }
  //   })
  useEffect(() => {
    localStorage.setItem(
      'uploadedFiles',
      JSON.stringify(
        files.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size,

          // Convert Blob to Base64 for storage
          data: file.data
        }))
      )
    )
  }, [files])
  const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles'))

  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file)} />
    } else {
      return <i className='ri-file-text-line' />
    }
  }

  console.log(files, 'jjjjj')

  const handleUploadFiles = async () => {
    if (!files.length) {
      alert('Please select files to upload.')

      return
    }

    console.log(questions, 'uploaddd')

    try {
      await uploadFiles(files) // Call the uploadFiles function from the hook
      // handleRemoveAllFiles() // Clear files after successful upload

      // const fileNames = files.map(file => file.name).join(',')
      dispatch(setFiles(files))
      dispatch(uploadFilesAsync(files))

      // alert()
      // toast.success('Files uploaded successfully!')
      if (guid) {
        router.push(`/question/import/view?guid=${guid}`)
      } else if (testGuid) {
        router.push(`/question/import/view?testguid=${testGuid}`)
      } else if (sectionGuid) {
        router.push(`/question/import/view?sectionguid=${sectionGuid}`)
      } else {
        router.push('/question/import/view')
      }
    } catch (error) {
      console.error('Error during file upload:', error)
    }
  }

  console.log(uploadData, 'checking')

  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)

    setFiles([...filtered])
  }

  const questionss = Object.keys(uploadData)
    .filter(key => uploadData[key].question !== null) // Filter out items with a null question
    .map((key, index) => {
      const item = uploadData[key]

      // Extract the values from each question object
      const { choice, correct_answer, question, parent_id, created_by, order, question_type } = item

      // If choices exist (i.e., a multiple-choice question)
      if (choice) {
        return {
          id: index + 1,
          text: question,
          options: choice, // Use 'choice' for options
          correctanswer: correct_answer, // Use 'correct_answer' from the object
          order, // Optionally include order if needed
          created_by, // Include the created_by field
          parent_id, // Include the parent_id field
          question_type // Include the question_type field (e.g., "mcq", "mcma")
        }
      }

      // For other question types that may not have choices
      return {
        id: index + 1,
        text: question,
        correctanswer: correct_answer,
        parent_id,
        created_by,
        question_type
      }
    })

  console.log(questionss, 'ssssss')

  const fileList = files.map(file => (
    <ListItem key={file.name} className='pis-4 plb-3'>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name font-medium' color='text.primary'>
            {file.name}
          </Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
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

  return (
    <Dropzone>
      {/* <CardHeader
          avatar={
            <IconButton color='primary'>
              <i className='ri-arrow-left-line' style={{ color: '#262B43E5' }} />
            </IconButton>
          }
          titleTypographyProps={{ fontSize: '24px' }}
          title='Import Wizard Step 1'
          sx={{ '& .MuiCardHeader-action': { alignSelf: 'center' } }}
        /> */}
      <FilterHeader title='Upload Questions' subtitle='Step 2' link='/test/list'></FilterHeader>
      <Card>
        <CardContent>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div className='flex items-center flex-col gap-2 text-center'>
              <CustomAvatar variant='rounded' skin='light' color='secondary'>
                <i className='ri-upload-2-line' />
              </CustomAvatar>
              <Typography variant='h5' align='center' gutterBottom>
                Attach File
              </Typography>
              <Typography variant='body2' align='center' color='textSecondary' style={{ fontSize: '15px' }}>
                All imported questions will be added into existing questions.
              </Typography>
              <Typography align='center' style={{ color: '#8080808C', fontSize: '12px' }}>
                Download sample file (
                <a href='#' className='text-blue-500' style={{ fontSize: '12px' }}>
                  text format
                </a>
                ,{' '}
                <a href='#' className='text-blue-500' style={{ fontSize: '12px' }}>
                  csv format
                </a>
                ,{' '}
                <a href='#' className='text-blue-500' style={{ fontSize: '12px' }}>
                  word format
                </a>
                ,{' '}
                <a href='#' className='text-blue-500' style={{ fontSize: '12px' }}>
                  QTI
                </a>
                )
              </Typography>
              <Typography color='text.disabled'>or</Typography>
              <Button variant='outlined' size='small'>
                Browse File
              </Button>
            </div>
          </div>
          {files.length ? (
            <>
              <List>{fileList}</List>
              <div className='buttons'>
                <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
                  Remove All
                </Button>
                <Button
                  variant='contained'
                  size='small'
                  onClick={handleUploadFiles}
                  disabled={uploading}

                  // variant='contained'
                >
                  Upload Files
                </Button>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </Dropzone>
  )
}

export default ImportQuestion
