import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import BackendWarmupGate from './components/BackendWarmupGate/BackendWarmupGate'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BackendWarmupGate>
      <App />
    </BackendWarmupGate>
  </StrictMode>,
)
