import './App.css'
import { Routes, Route } from 'react-router-dom'
import Logowanie from './Logowanie'
import AdminPage from './AdminPage'
import Rejestracja from './Rejestracja'
import MainPage from './MainPage'
import NauczycielPage from './NauczycielPage'
import MagazynierPage from './MagazynierPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Logowanie />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/nauczyciel" element={<NauczycielPage />} />
      <Route path="/magazynier" element={<MagazynierPage />} />
      <Route path="/rejestracja" element={<Rejestracja/>} />
    </Routes>
  )
}

export default App