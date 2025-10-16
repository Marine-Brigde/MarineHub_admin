import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../api/authApi'
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react'

export function AdminLoginForm() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    
    const [formData, setFormData] = useState({
        usernameOrEmail: '',
        password: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        // Validation
        if (!formData.usernameOrEmail.trim()) {
            setError('Vui lòng nhập tên đăng nhập hoặc email')
            setIsLoading(false)
            return
        }
        
        if (!formData.password.trim()) {
            setError('Vui lòng nhập mật khẩu')
            setIsLoading(false)
            return
        }

        try {
            const response = await authApi.login(formData)
            console.log('Login response:', response)
            
            if (response.status === 200) {
                // Đăng nhập thành công, redirect đến dashboard
                navigate('/')
            } else {
                setError(response.message || 'Đăng nhập thất bại')
            }
        } catch (err) {
            console.error('Login error:', err)
            setError(err.message || 'Có lỗi xảy ra khi đăng nhập')
        }
        
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen ocean-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 shadow-lg">
                            <Lock className="h-8 w-8 text-blue-950" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-100 mb-2">MarineBridge</h1>
                    <p className="text-blue-200/80">Hệ thống quản lý hàng hải chuyên nghiệp</p>
                </div>

                {/* Login Form */}
                <div className="glass-panel rounded-2xl p-8 shadow-2xl">
                    {error && (
                        <div className="mb-6 p-4 bg-red-900/20 border border-red-800/60 rounded-md">
                            <div className="flex items-center">
                                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                                <span className="text-red-300">{error}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username/Email Field */}
                        <div>
                            <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-slate-200 mb-2">
                                Tên đăng nhập hoặc Email
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300" />
                                <input
                                    id="usernameOrEmail"
                                    type="text"
                                    placeholder="Nhập tên đăng nhập hoặc email"
                                    value={formData.usernameOrEmail}
                                    onChange={(e) => setFormData(prev => ({ ...prev, usernameOrEmail: e.target.value }))}
                                    className="w-full rounded-lg border border-blue-800/60 bg-blue-900/40 px-3 py-3 pl-10 text-slate-100 placeholder:text-blue-300/60 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    className="w-full rounded-lg border border-blue-800/60 bg-blue-900/40 px-3 py-3 pl-10 pr-10 text-slate-100 placeholder:text-blue-300/60 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition-colors"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300 hover:text-cyan-200 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-blue-400 py-3 text-blue-950 font-semibold hover:from-cyan-300 hover:to-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-blue-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-950 border-t-transparent mr-2"></div>
                                    Đang đăng nhập...
                                </div>
                            ) : (
                                'Đăng nhập'
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-xs text-blue-300/60">
                        © 2025 MarineBridge. Tất cả quyền được bảo lưu.
                    </p>
                </div>
            </div>
        </div>
    )
}
