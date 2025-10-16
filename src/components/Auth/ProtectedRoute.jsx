import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { authApi } from '../../api/authApi'

export function ProtectedRoute({ children }) {
    const location = useLocation()
    const isAuthenticated = authApi.isAuthenticated()

    if (!isAuthenticated) {
        // Redirect to login page with return url
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}

// Component để redirect nếu đã đăng nhập (cho login page)
export function PublicRoute({ children }) {
    const isAuthenticated = authApi.isAuthenticated()

    if (isAuthenticated) {
        // Redirect to dashboard if already logged in
        return <Navigate to="/" replace />
    }

    return children
}
