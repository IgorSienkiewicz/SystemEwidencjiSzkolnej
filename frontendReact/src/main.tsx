import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Logowanie from './Logowanie.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Logowanie />
  </StrictMode>,
)
