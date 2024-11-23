import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CourseProvider } from './context/CourseContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <CourseProvider>
      <App />
    </CourseProvider>
  </BrowserRouter>,
)
