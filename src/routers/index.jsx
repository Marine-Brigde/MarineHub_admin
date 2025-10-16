import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import AdminLayout from '../layouts/Admin_layout'
import LoginPage from '../pages/Login'
import HomePage from '../pages/Home'
import AnalyticsPage from '../pages/Analytics'
import UsersPage from '../pages/Users'
import ActivityPage from '../pages/Activity'
import FunctionsPage from '../pages/Functions'
import EdgeNetworkPage from '../pages/EdgeNetwork'
import DatabasePage from '../pages/Database'
import PortsPage from '../pages/Ports'
import SettingsPage from '../pages/Settings'
import SecurityPage from '../pages/Security'
import LogsPage from '../pages/Logs'
import { ProtectedRoute, PublicRoute } from '../components/Auth/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <HomePage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'activity', element: <ActivityPage /> },
      { path: 'functions', element: <FunctionsPage /> },
      { path: 'edge-network', element: <EdgeNetworkPage /> },
      { path: 'database', element: <DatabasePage /> },
      { path: 'ports', element: <PortsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'security', element: <SecurityPage /> },
      { path: 'logs', element: <LogsPage /> },
    ],
  },
])

export default router


