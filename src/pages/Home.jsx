import React from 'react'
import { StatisticsCards } from '../components/Statistics/StatisticsCards'
import { useTheme } from '../contexts/ThemeContext'
import { authApi } from '../api/authApi'
import { Calendar, Clock, Activity } from 'lucide-react'

export default function HomePage() {
  const { isLight } = useTheme()
  const userInfo = authApi.getCurrentUser()
  const currentDate = new Date()
  
  const formatDate = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    return date.toLocaleDateString('vi-VN', options)
  }

  const getGreeting = () => {
    const hour = currentDate.getHours()
    if (hour < 12) return 'Chào buổi sáng'
    if (hour < 18) return 'Chào buổi chiều'
    return 'Chào buổi tối'
  }
  
  return (
    <div className="space-y-6">
      {/* Welcome Header Section */}
      <div className={`relative overflow-hidden rounded-2xl border ${
        isLight 
          ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200' 
          : 'bg-gradient-to-br from-blue-950/50 via-cyan-950/30 to-blue-950/50 border-blue-800/40'
      }`}>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl" />
        
        <div className="relative p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <h1 className={`text-4xl font-bold mb-2 ${
                isLight ? 'text-gray-900' : 'text-white'
              }`}>
                {getGreeting()}, {userInfo?.username || 'Admin'}! 👋
              </h1>
              <p className={`text-lg mb-4 ${
                isLight ? 'text-gray-600' : 'text-blue-200/80'
              }`}>
                Chào mừng đến với Bảng điều khiển MarineBridge
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm ${
                  isLight 
                    ? 'bg-white/60 border border-blue-200' 
                    : 'bg-blue-900/30 border border-blue-700/30'
                }`}>
                  <Calendar className={`h-4 w-4 ${
                    isLight ? 'text-blue-600' : 'text-cyan-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    isLight ? 'text-gray-700' : 'text-blue-200'
                  }`}>
                    {formatDate(currentDate)}
                  </span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm ${
                  isLight 
                    ? 'bg-white/60 border border-blue-200' 
                    : 'bg-blue-900/30 border border-blue-700/30'
                }`}>
                  <Clock className={`h-4 w-4 ${
                    isLight ? 'text-blue-600' : 'text-cyan-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    isLight ? 'text-gray-700' : 'text-blue-200'
                  }`}>
                    {currentDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Quick Stats Icon */}
            <div className={`hidden md:flex items-center justify-center w-24 h-24 rounded-2xl ${
              isLight 
                ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                : 'bg-gradient-to-br from-cyan-400 to-blue-400'
            } shadow-lg`}>
              <Activity className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards Section */}
      <div>
        <div className="mb-6">
          <h2 className={`text-2xl font-semibold mb-2 ${
            isLight ? 'text-gray-900' : 'text-white'
          }`}>
            Tổng Quan Hệ Thống
          </h2>
          <p className={isLight ? 'text-gray-600' : 'text-blue-200/70'}>
            Theo dõi số liệu thống kê tổng quan của hệ thống
          </p>
        </div>
        <StatisticsCards />
      </div>
    </div>
  )
}


