import './App.css'
import { Routes, Route } from 'react-router-dom'
import Logowanie from './Logowanie'
import Rejestracja from './Rejestracja'
import NauczycielMainPage from './NauczycielMainPage'
import MagazynierMainPage from './MagazynierMainPage'
import AdminMainPage from './AdminMainPage'
import AdminRoleChange from './AdminRoleChange'
import ProtectedRoute from './ProtectedRoute'
import NauczycielSalaPage from './NauczycielSalaPage'
import MagazynierEquipmentPage from './MagazynierEquipmentPage'
import AdminEquipmentManagement from './AdminEquipmentManagment'
import MagazynierAddEquipment from './MagazynierAddEquipmentPage'
import MagazynierDeleteEquipment from './MagazynierDeleteEquipment'
import NauczycielReserveEquipment from './NauczycielReserveEquipment'

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
    <Route path="/nauczyciel/rezerwacja" element={
    <ProtectedRoute dozwoloneRole={['Nauczyciel']}>
        <NauczycielReserveEquipment />
    </ProtectedRoute>
} />
    <Route path="/nauczyciel/sala/:id" element={
    <ProtectedRoute dozwoloneRole={['Nauczyciel']}>
        <NauczycielSalaPage />
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