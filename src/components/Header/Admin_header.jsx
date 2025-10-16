"use client"
import React from 'react'
import { useState } from "react"
import { Bell, Search, Settings, Sun, Moon, Palette, LogOut, User } from "lucide-react"
import { useTheme } from '../../contexts/ThemeContext'
import { authApi } from '../../api/authApi'

export function AdminHeader() {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const { isLight, toggleTheme } = useTheme()
  
  const userInfo = authApi.getCurrentUser()
  
  const handleLogout = () => {
    authApi.logout()
  }

  return (
    <header className="sticky top-0 z-50 border-b glass-panel">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded ${
            isLight ? 'bg-blue-600' : 'bg-cyan-400'
          }`}>
            <span className={`text-lg font-bold ${
              isLight ? 'text-white' : 'text-blue-950'
            }`}>▲</span>
          </div>
          <span className={`text-sm font-semibold ${
            isLight ? 'text-gray-900' : 'text-slate-100'
          }`}>Admin</span>
          <span className={`rounded px-2 py-0.5 text-xs font-medium ${
            isLight 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-cyan-400/10 text-cyan-300'
          }`}>MarineBridge</span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
              isLight ? 'text-gray-500' : 'text-blue-300/70'
            }`} />
            <input
              type="search"
              placeholder="Search..."
              className={`w-64 rounded-lg border px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-1 ${
                isLight
                  ? 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/40'
                  : 'border-blue-800/60 bg-blue-900/40 text-slate-100 placeholder:text-blue-300/60 focus:border-cyan-500/50 focus:ring-cyan-500/40'
              }`}
            />
          </div>

          <button className={`relative rounded-lg p-2 transition-colors ${
            isLight
              ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              : 'text-blue-200/80 hover:bg-blue-900/50 hover:text-slate-100'
          }`}>
            <Bell className="h-5 w-5" />
            <span className={`absolute right-1.5 top-1.5 h-2 w-2 rounded-full ${
              isLight ? 'bg-blue-500' : 'bg-cyan-400'
            }`} />
          </button>

          <button className={`rounded-lg p-2 transition-colors ${
            isLight
              ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              : 'text-blue-200/80 hover:bg-blue-900/50 hover:text-slate-100'
          }`}>
            <Settings className="h-5 w-5" />
          </button>

          <button 
            onClick={toggleTheme}
            className={`relative rounded-lg p-2 hover:opacity-90 transition-all duration-300 ${
              isLight 
                ? 'bg-white border border-gray-200 text-gray-700' 
                : 'bg-gradient-to-br from-cyan-400 to-blue-400 text-blue-950'
            }`}
            title={`Switch to ${isLight ? 'dark' : 'light'} theme`}
          >
            {isLight ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          
          
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className={`h-9 w-9 rounded-full flex items-center justify-center font-semibold text-sm hover:opacity-90 transition-opacity ${
                isLight
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                  : 'bg-gradient-to-br from-cyan-400 to-blue-400 text-blue-950'
              }`}
            >
              {userInfo?.username?.charAt(0).toUpperCase() || 'A'}
            </button>

            {showUserDropdown && (
              <div className={`absolute right-0 mt-2 w-64 rounded-lg border shadow-lg ${
                isLight
                  ? 'border-gray-200 bg-white'
                  : 'border-blue-800/60 bg-blue-950'
              }`}>
                <div className={`px-4 py-3 border-b ${
                  isLight ? 'border-gray-200' : 'border-blue-800/60'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium ${
                      isLight
                        ? 'bg-blue-600 text-white'
                        : 'bg-cyan-400 text-blue-950'
                    }`}>
                      {userInfo?.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        isLight ? 'text-gray-900' : 'text-slate-100'
                      }`}>
                        {userInfo?.username || 'Admin'}
                      </p>
                      <p className={`text-xs ${
                        isLight ? 'text-gray-500' : 'text-blue-300/70'
                      }`}>
                        {userInfo?.email || 'admin@marinebridge.com'}
                      </p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                        isLight
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-cyan-400/10 text-cyan-300'
                      }`}>
                        {userInfo?.role || 'Admin'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                    isLight
                      ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      : 'text-blue-100/90 hover:bg-blue-900/50 hover:text-slate-100'
                  }`}>
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                    isLight
                      ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      : 'text-blue-100/90 hover:bg-blue-900/50 hover:text-slate-100'
                  }`}>
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </div>
                <div className={`border-t py-1 ${
                  isLight ? 'border-gray-200' : 'border-blue-800/60'
                }`}>
                  <button 
                    onClick={handleLogout}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                      isLight
                        ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                        : 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                    }`}
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
