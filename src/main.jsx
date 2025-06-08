import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { init, miniApp, postEvent } from '@telegram-apps/sdk'

const initializeTelegramSDK = async () => {
  try {
    await init({
      disableVerticalSwipes: true,
      allow_vertical_swipe: false
    })

    if (miniApp.ready.isAvailable()) {
      await miniApp.ready()
      console.log('Mini App готово')
    }


    postEvent('allow_vertical_swipe', false);

  } catch (error) {
    console.error('Ошибка инициализации:', error)
  }
}

initializeTelegramSDK()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
