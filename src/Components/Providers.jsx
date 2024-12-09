// Context Imports
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'

import { getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'

import ThemeProvider from '@/Components/theme'

// Util Imports
import ReduxProvider from '@/redux-store/ReduxProvider'
import AppReactToastify from '@/libs/styles/AppReactToastify'

const Providers = props => {
  // Props
  const { children, direction } = props

  // Vars
  const mode = getMode()
  const settingsCookie = getSettingsFromCookie()
  const systemMode = getSystemMode()

  return (
    <VerticalNavProvider>
      <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
        <ThemeProvider direction={direction} systemMode={systemMode}>
          <ReduxProvider>{children}</ReduxProvider>
          <AppReactToastify direction={direction} hideProgressBar />
        </ThemeProvider>
      </SettingsProvider>
    </VerticalNavProvider>
  )
}

export default Providers
