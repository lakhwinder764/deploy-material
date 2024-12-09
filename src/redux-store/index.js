// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // Defaults to localStorage for web

// Slice Imports
// import chatReducer from '@/redux-store/slices/chat'
// import calendarReducer from '@/redux-store/slices/calendar'
// import kanbanReducer from '@/redux-store/slices/kanban'
// import emailReducer from '@/redux-store/slices/email'
import fileReducer from '@/redux-store/slices/fileSlice'

// Persist config for fileReducer
const persistConfig = {
  key: 'file',
  storage, // Using localStorage for persisting
  whitelist: ['fileReducer'] // Only persist the fileReducer slice
}

// Apply persistReducer to the fileReducer
const persistedFileReducer = persistReducer(persistConfig, fileReducer)

// Configure the store with persisted fileReducer and other reducers
export const store = configureStore({
  reducer: {
    // chatReducer, // No persistence for this reducer
    // calendarReducer, // No persistence for this reducer
    // kanbanReducer, // No persistence for this reducer
    // emailReducer, // No persistence for this reducer
    fileReducer: persistedFileReducer // Persisted fileReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false // Disable serializable checks for redux-persist
    })
})

// Create the persistor to persist the store
export const persistor = persistStore(store)
