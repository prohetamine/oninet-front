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

    postEvent('web_app_expand')
    postEvent('web_app_setup_main_button', { is_visible: false })
    postEvent('web_app_setup_swipe_behavior', { allow_vertical_swipe: false })
    postEvent('web_app_set_background_color', { color: '#EEEEEE' })
    postEvent('web_app_set_bottom_bar_color', { color: '#FFAA00' })
    
    if (miniApp.ready.isAvailable()) {
      await miniApp.ready()
      console.log('Mini App готово')
    }

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
