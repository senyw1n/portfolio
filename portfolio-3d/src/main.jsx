import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import { sayHello } from './hello'

sayHello()

// Без StrictMode: подписи drei <Html> в режиме разработки иначе сыплют предупреждениями
createRoot(document.getElementById('root')).render(<App />)
