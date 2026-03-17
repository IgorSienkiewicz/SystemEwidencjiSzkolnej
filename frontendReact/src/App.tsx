import './App.css'
import { Routes, Route } from 'react-router-dom'
import Logowanie from './Logowanie'
import Rejestracja from './Rejestracja'
import MainPage from './MainPage'
import NauczycielMainPage from './NauczycielMainPage'
import MagazynierMainPage from './MagazynierMainPage'
import AdminMainPage from './AdminMainPage'
import AdminRoleChange from './AdminRoleChange'
import ProtectedRoute from './ProtectedRoute'
import MagazynierEquipmentPage from './MagazynierEquipmentPage'
import AdminEquipmentManagement from './AdminEquipmentManagment'
import MagazynierAddEquipment from './MagazynierAddEquipmentPage'
import MagazynierDeleteEquipment from './MagazynierDeleteEquipment'

function App() {
  return (
    <Routes>
    <Route path="/" element={<Logowanie />} />
    <Route path="/rejestracja" element={<Rejestracja />} />

    <Route path="/admin" element={
        <ProtectedRoute dozwoloneRole={['Admin']}>
            <AdminMainPage />
        </ProtectedRoute>
    } />
    <Route path="/admin/RoleChange" element={
        <ProtectedRoute dozwoloneRole={['Admin']}>
            <AdminRoleChange />
        </ProtectedRoute>
    } />
    <Route path="/nauczyciel" element={
        <ProtectedRoute dozwoloneRole={['Nauczyciel']}>
            <NauczycielMainPage />
        </ProtectedRoute>
    } />
    <Route path="/magazynier" element={
        <ProtectedRoute dozwoloneRole={['Magazynier']}>
            <MagazynierMainPage />
        </ProtectedRoute>
    } />
    <Route path="/main" element={
        <ProtectedRoute dozwoloneRole={['Admin', 'Nauczyciel', 'Magazynier']}>
            <MainPage />
        </ProtectedRoute>
    } />
    <Route path="/magazynier" element={
        <ProtectedRoute dozwoloneRole={['Magazynier']}>
            <MagazynierMainPage/>
        </ProtectedRoute>
    }/>
    <Route path='/magazynier/ewidencjaSprzetu' element={
        <ProtectedRoute dozwoloneRole={['Magazynier']}>
            <MagazynierEquipmentPage />
        </ProtectedRoute>
    }/>
    <Route path='/admin/equipmentManagement' element={
        <ProtectedRoute dozwoloneRole={['Admin']}>
            <AdminEquipmentManagement />
        </ProtectedRoute>
    }/>
    <Route path="/magazynier/addEquipment" element={
        <ProtectedRoute dozwoloneRole={['Magazynier']}>
            <MagazynierAddEquipment />
        </ProtectedRoute>
    } />
    <Route path="/magazynier/deleteEquipment" element={
        <ProtectedRoute dozwoloneRole={['Magazynier']}>
            <MagazynierDeleteEquipment />
        </ProtectedRoute>
    } />
</Routes>
  )
}

export default App