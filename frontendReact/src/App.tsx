import './App.css'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Logowanie from './Logowanie'
import Rejestracja from './Rejestracja'
import MainPage from './MainPage'
import NauczycielPage from './NauczycielPage'
import MagazynierPage from './MagazynierPage'
import AdminMainPage from './AdminMainPage'
import AdminRoleChange from './AdminRoleChange'
import ProtectedRoute from './ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Logowanie />} />
      <Route path="/rejestracja" element={<Rejestracja />} />
      
      <Route path="/main" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminMainPage /></ProtectedRoute>} />
      <Route path="/adminRoleChange" element={<ProtectedRoute><AdminRoleChange /></ProtectedRoute>} />
      <Route path="/nauczyciel" element={<ProtectedRoute><NauczycielPage /></ProtectedRoute>} />
      <Route path="/magazynier" element={<ProtectedRoute><MagazynierPage /></ProtectedRoute>} />
    </Routes>
  )
}

export default App