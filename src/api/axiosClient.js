// src/api/axiosClient.js
import axios from 'axios'

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://marine-bridge.orbitmap.vn/api',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
})

// 🔁 Interceptors (tự động gắn token nếu có)
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        
        // Xử lý lỗi 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            
            try {
                // Thử refresh token
                const refreshToken = localStorage.getItem('refreshToken')
                if (refreshToken) {
                    const response = await axios.post(
                        `${import.meta.env.VITE_API_BASE_URL || 'https://marine-bridge.orbitmap.vn/api'}/v1/auth/refresh`,
                        { refreshToken }
                    )
                    
                    if (response.data.status === 200) {
                        const { accessToken, refreshToken: newRefreshToken } = response.data.data
                        localStorage.setItem('accessToken', accessToken)
                        if (newRefreshToken) {
                            localStorage.setItem('refreshToken', newRefreshToken)
                        }
                        
                        // Retry original request
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`
                        return axiosClient(originalRequest)
                    }
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError)
            }
            
            // Nếu refresh thất bại, logout và redirect
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('userInfo')
            window.location.href = '/login'
        }
        
        return Promise.reject(error.response?.data || error.message)
    }
)

export default axiosClient
