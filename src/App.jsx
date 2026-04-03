import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext.jsx'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import Requests from './pages/Requests.jsx'
import Timesheet from './pages/Timesheet.jsx'
import Compensation from './pages/Compensation.jsx'
import Attendance from './pages/Attendance.jsx'
import Documents from './pages/Documents.jsx'

function ProtectedRoute({ children }) {
  const { state } = useApp()
  if (!state.auth.isLoggedIn) return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const { state } = useApp()
  if (state.auth.isLoggedIn) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="requests" element={<Requests />} />
        <Route path="timesheet" element={<Timesheet />} />
        <Route path="compensation" element={<Compensation />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="documents" element={<Documents />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
