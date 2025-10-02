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
import SettingsPage from '../pages/Settings'
import SecurityPage from '../pages/Security'
import LogsPage from '../pages/Logs'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <HomePage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'activity', element: <ActivityPage /> },
      { path: 'functions', element: <FunctionsPage /> },
      { path: 'edge-network', element: <EdgeNetworkPage /> },
      { path: 'database', element: <DatabasePage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'security', element: <SecurityPage /> },
      { path: 'logs', element: <LogsPage /> },
    ],
  },
])

export default router


