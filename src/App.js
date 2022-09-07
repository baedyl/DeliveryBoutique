import React, { useEffect } from 'react'
import { LogBox } from 'react-native'
import { Provider } from 'react-redux'
import { extendTheme, DNProvider, TranslationProvider } from 'dopenative'
import configureStore from './redux/store'
import AppContent from './AppContent'
import translations from './translations/'
import { ConfigProvider } from './config'
import { AuthProvider } from './Core/onboarding/hooks/useAuth'
import { authManager } from './Core/onboarding/api'
import InstamobileTheme from './theme'
import Geocoder from 'react-native-geocoding';

navigator.geolocation = require('@react-native-community/geolocation');

// Initialize the module (needs to be done only once)
Geocoder.init("AIzaSyBSWfme3FulpbRxcMzQ9JOaRUJPWIn2vKo"); // use a valid API key

const store = configureStore()

const App = () => {
  const theme = extendTheme(InstamobileTheme)

  useEffect(() => {
    LogBox.ignoreAllLogs(true)
  }, [])

  return (
    <Provider store={store}>
      <TranslationProvider translations={translations}>
        <DNProvider theme={theme}>
          <ConfigProvider>
            <AuthProvider authManager={authManager}>
              <AppContent />
            </AuthProvider>
          </ConfigProvider>
        </DNProvider>
      </TranslationProvider>
    </Provider>
  )
}

export default App
