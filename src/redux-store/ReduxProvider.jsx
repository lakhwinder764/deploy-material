'use client'

// Third-party Imports
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
// import { persistor } from './index'
import { store, persistor } from '@/redux-store'

const ReduxProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}

export default ReduxProvider
