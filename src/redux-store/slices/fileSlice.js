// fileSlice.js

import useQuestionModuleApi from '@/api/useQuestionModuleApi'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import useQuestionApi from '@/app/[lang]/(pages)/question/Api/useQuestionApi'
// Async action to handle file uploads
export const uploadFilesAsync = createAsyncThunk('file/uploadFiles', async (files, { rejectWithValue }) => {
  const { data: questions, loader, uploadFiles, uploading } = useQuestionModuleApi()
  try {
    // Call your API or upload logic here
    await uploadFiles(files) // Replace this with actual API call
    return files // Return the uploaded files
  } catch (error) {
    return rejectWithValue(error.message) // Return error if upload fails
  }
})

const initialState = {
  files: [],
  uploading: false,
  error: null
}

export const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setFiles: (state, action) => {
      state.files = action.payload
    },
    removeFile: (state, action) => {
      state.files = state.files.filter(file => file.name !== action.payload)
    },
    removeAllFiles: state => {
      state.files = []
    }
  },
  extraReducers: builder => {
    builder
      .addCase(uploadFilesAsync.pending, state => {
        state.uploading = true
        state.error = null
      })
      .addCase(uploadFilesAsync.fulfilled, (state, action) => {
        state.uploading = false
        state.files = action.payload // Update state with uploaded files
      })
      .addCase(uploadFilesAsync.rejected, (state, action) => {
        state.uploading = false
        state.error = action.payload
      })
  }
})

export const { setFiles, removeFile, removeAllFiles } = fileSlice.actions

export default fileSlice.reducer
