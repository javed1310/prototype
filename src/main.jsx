import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SolarFlowApp from './solarflow-app.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SolarFlowApp />
  </StrictMode>,
)
