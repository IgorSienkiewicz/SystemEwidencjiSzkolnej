import './App.css'
import { Routes, Route } from 'react-router-dom'
import Logowanie from './Logowanie'
import MainPage from './MainPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Logowanie />} />
      <Route path="/main" element={<MainPage />} />
    </Routes>
  )
}

export default App