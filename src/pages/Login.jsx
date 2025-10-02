import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Ship, Lock, Mail } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      navigate('/home')
    }, 1500)
  }

  return (
    <div className="min-h-screen ocean-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 shadow-lg">
              <Ship className="h-8 w-8 text-blue-950" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">MarineBridge</h1>
          <p className="text-blue-200/80">Hệ thống quản lý hàng hải chuyên nghiệp</p>
        </div>

        {/* Login Form */}
        <div className="glass-panel rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-blue-800/60 bg-blue-900/40 px-3 py-3 pl-10 text-slate-100 placeholder:text-blue-300/60 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition-colors"
                  placeholder="admin@marinebridge.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-blue-800/60 bg-blue-900/40 px-3 py-3 pl-10 pr-10 text-slate-100 placeholder:text-blue-300/60 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition-colors"
                  placeholder="••••••••"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-blue-800/60 bg-blue-900/40 text-cyan-400 focus:ring-cyan-500/40 focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-blue-200/80">Ghi nhớ đăng nhập</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-cyan-300 hover:text-cyan-200 transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

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

          <div className="mt-6 text-center">
            <p className="text-sm text-blue-200/80">
              Chưa có tài khoản?{' '}
              <Link
                to="/register"
                className="text-cyan-300 hover:text-cyan-200 font-medium transition-colors"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-blue-300/60">
            © 2024 MarineBridge. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </div>
  )
}
