"use client"
import React from 'react'
import { useState } from "react"
import { Bell, Search, Settings, Sun, Moon } from "lucide-react"

export function AdminHeader() {
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLight, setIsLight] = useState(false)

  const toggleTheme = () => {
    const html = document.documentElement
    const next = !isLight
    setIsLight(next)
    if (next) {
      html.setAttribute('data-theme', 'light')
    } else {
      html.removeAttribute('data-theme')
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b glass-panel">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-cyan-400">
            <span className="text-lg font-bold text-blue-950">▲</span>
          </div>
          <span className="text-sm font-semibold text-slate-100">Admin</span>
          <span className="rounded bg-cyan-400/10 px-2 py-0.5 text-xs font-medium text-cyan-300">MarineBridge</span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-300/70" />
            <input
              type="search"
              placeholder="Search..."
              className="w-64 rounded-lg border border-blue-800/60 bg-blue-900/40 px-3 py-2 pl-9 text-sm text-slate-100 placeholder:text-blue-300/60 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
            />
          </div>

          <button className="relative rounded-lg p-2 text-blue-200/80 hover:bg-blue-900/50 hover:text-slate-100 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-cyan-400" />
          </button>

          <button className="rounded-lg p-2 text-blue-200/80 hover:bg-blue-900/50 hover:text-slate-100 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center text-blue-950 font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              AD
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-blue-800/60 bg-blue-950 shadow-lg">
                <div className="px-4 py-3 border-b border-blue-800/60">
                  <p className="text-sm font-medium text-slate-100">My Account</p>
                </div>
                <div className="py-1">
                  <button className="w-full px-4 py-2 text-left text-sm text-blue-100/90 hover:bg-blue-900/50 hover:text-slate-100 transition-colors">
                    Profile
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-blue-100/90 hover:bg-blue-900/50 hover:text-slate-100 transition-colors">
                    Settings
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-blue-100/90 hover:bg-blue-900/50 hover:text-slate-100 transition-colors">
                    Team
                  </button>
                </div>
                <div className="border-t border-blue-800/60 py-1">
                  <button 
                    onClick={() => window.location.href = '/login'}
                    className="w-full px-4 py-2 text-left text-sm text-blue-100/90 hover:bg-blue-900/50 hover:text-slate-100 transition-colors"
                  >
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
