import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { StudentProvider } from './store/StudentContext.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <StudentProvider>
        <App />
      </StudentProvider>
    </HashRouter>
  </React.StrictMode>
)
