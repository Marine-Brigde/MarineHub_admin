// src/api/authApi.js
import axiosClient from './axiosClient'

export const authApi = {
    // 🔐 Đăng nhập admin
    login: async (credentials) => {
        const url = '/v1/auth/login'
        const response = await axiosClient.post(url, credentials)
        
        // Lưu token và user info vào localStorage
        if (response.data.status === 200) {
            const { accessToken, accountId, username, email, role } = response.data.data
            
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('userInfo', JSON.stringify({
                accountId,
                username,
                email,
                role
            }))
            
            return response.data
        }
        
        return response.data
    },

    // 🔓 Đăng xuất
    logout: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userInfo')
        // Redirect to login page
        window.location.href = '/login'
    },

    // 👤 Lấy thông tin user hiện tại
    getCurrentUser: () => {
        const userInfo = localStorage.getItem('userInfo')
        return userInfo ? JSON.parse(userInfo) : null
    },

    // 🔒 Kiểm tra user có phải admin không
    isAdmin: () => {
        const userInfo = authApi.getCurrentUser()
        if (!userInfo || !userInfo.role) return false
        
        // Kiểm tra role admin (case-insensitive)
        const role = userInfo.role.toString().toLowerCase()
        return role === 'admin'
    },

    // 🔑 Kiểm tra token có hợp lệ không
    isAuthenticated: () => {
        const token = localStorage.getItem('accessToken')
        if (!token) return false
        
        try {
            // Decode JWT token để kiểm tra expiry
            const payload = JSON.parse(atob(token.split('.')[1]))
            const currentTime = Date.now() / 1000
            
            // Kiểm tra token chưa hết hạn
            if (payload.exp && payload.exp < currentTime) {
                authApi.logout()
                return false
            }
            
            return true
        } catch (error) {
            console.error('Token validation error:', error)
            authApi.logout()
            return false
        }
    },

    // 🔄 Refresh token (nếu API hỗ trợ)
    refreshToken: async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken')
            if (!refreshToken) throw new Error('No refresh token')
            
            const url = '/v1/auth/refresh'
            const response = await axiosClient.post(url, { refreshToken })
            
            if (response.data.status === 200) {
                const { accessToken, refreshToken: newRefreshToken } = response.data.data
                localStorage.setItem('accessToken', accessToken)
                if (newRefreshToken) {
                    localStorage.setItem('refreshToken', newRefreshToken)
                }
                return true
            }
            
            throw new Error('Refresh failed')
        } catch (error) {
            console.error('Token refresh error:', error)
            authApi.logout()
            return false
        }
    }
}
