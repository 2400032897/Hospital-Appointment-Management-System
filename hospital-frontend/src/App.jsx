import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard'
import PatientProfile from './pages/patient/PatientProfile'
import BookAppointment from './pages/patient/BookAppointment'
import AppointmentHistory from './pages/patient/AppointmentHistory'
import UploadReport from './pages/patient/UploadReport'

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorProfile from './pages/doctor/DoctorProfile'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import ManageAvailability from './pages/doctor/ManageAvailability'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageDoctors from './pages/admin/ManageDoctors'
import ManagePatients from './pages/admin/ManagePatients'
import ManageDepartments from './pages/admin/ManageDepartments'
import ManageAppointments from './pages/admin/ManageAppointments'
import GenerateReports from './pages/admin/GenerateReports'

import Loader from './components/Loader'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, token, loading } = useAuth()
  if (loading) return <Loader fullPage />
  if (!token) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />
  }
  return children
}

function AppRoutes() {
  const { user, token, loading } = useAuth()
  if (loading) return <Loader fullPage />

  const defaultRoute = () => {
    if (!token) return '/login'
    if (user?.role === 'PATIENT') return '/patient/dashboard'
    if (user?.role === 'DOCTOR') return '/doctor/dashboard'
    if (user?.role === 'ADMIN') return '/admin/dashboard'
    return '/login'
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!token ? <Login /> : <Navigate to={defaultRoute()} />} />
      <Route path="/register" element={!token ? <Register /> : <Navigate to={defaultRoute()} />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Patient Routes */}
      <Route path="/patient/dashboard" element={
        <ProtectedRoute allowedRoles={['PATIENT']}>
          <PatientDashboard />
        </ProtectedRoute>
      } />
      <Route path="/patient/profile" element={
        <ProtectedRoute allowedRoles={['PATIENT']}>
          <PatientProfile />
        </ProtectedRoute>
      } />
      <Route path="/patient/book-appointment" element={
        <ProtectedRoute allowedRoles={['PATIENT']}>
          <BookAppointment />
        </ProtectedRoute>
      } />
      <Route path="/patient/appointments" element={
        <ProtectedRoute allowedRoles={['PATIENT']}>
          <AppointmentHistory />
        </ProtectedRoute>
      } />
      <Route path="/patient/upload-report" element={
        <ProtectedRoute allowedRoles={['PATIENT']}>
          <UploadReport />
        </ProtectedRoute>
      } />

      {/* Doctor Routes */}
      <Route path="/doctor/dashboard" element={
        <ProtectedRoute allowedRoles={['DOCTOR']}>
          <DoctorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/doctor/profile" element={
        <ProtectedRoute allowedRoles={['DOCTOR']}>
          <DoctorProfile />
        </ProtectedRoute>
      } />
      <Route path="/doctor/appointments" element={
        <ProtectedRoute allowedRoles={['DOCTOR']}>
          <DoctorAppointments />
        </ProtectedRoute>
      } />
      <Route path="/doctor/availability" element={
        <ProtectedRoute allowedRoles={['DOCTOR']}>
          <ManageAvailability />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/doctors" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <ManageDoctors />
        </ProtectedRoute>
      } />
      <Route path="/admin/patients" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <ManagePatients />
        </ProtectedRoute>
      } />
      <Route path="/admin/departments" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <ManageDepartments />
        </ProtectedRoute>
      } />
      <Route path="/admin/appointments" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <ManageAppointments />
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <GenerateReports />
        </ProtectedRoute>
      } />

      {/* Default */}
      <Route path="/" element={<Navigate to={defaultRoute()} />} />
      <Route path="*" element={<Navigate to={defaultRoute()} />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
