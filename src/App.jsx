import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import UsersPage from './pages/UsersPage.jsx'
import ClientsPage from './pages/ClientsPage.jsx'
import ContractorsPage from './pages/ContractorsPage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import ConsultantsPage from './pages/ConsultantsPage.jsx'
import MainFormPage from './pages/MainFormPage.jsx'
import ProtectedRoute from './utilities/ProtectedRoute.jsx'
import AdminRoute from './utilities/AdminRoute.jsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="users" replace />} />
        <Route path="users" element={<AdminRoute><UsersPage /></AdminRoute>} />
        <Route path="clients" element={<AdminRoute><ClientsPage /></AdminRoute>} />
        <Route path="contractors" element={<AdminRoute><ContractorsPage /></AdminRoute>} />
        <Route path="projects" element={<AdminRoute><ProjectsPage /></AdminRoute>} />
        <Route path="consultants" element={<AdminRoute><ConsultantsPage /></AdminRoute>} />
        <Route path="main-form" element={<AdminRoute><MainFormPage /></AdminRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}


export default App
