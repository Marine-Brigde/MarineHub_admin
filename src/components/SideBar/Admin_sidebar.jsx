"use client"
import  React from "react"
import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import { useTheme } from '../../contexts/ThemeContext'

import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Database,
  Shield,
  Zap,
  Globe,
  FileText,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const navigation = [
  { name: "Home", href: "/home", icon: LayoutDashboard, current: true },
  { name: "Analytics", href: "/analytics", icon: BarChart3, current: false },
  { name: "Users", href: "/users", icon: Users, current: false },
  { name: "Activity", href: "/activity", icon: Activity, current: false },
]

const compute = [
  { name: "Functions", href: "/functions", icon: Zap },
  { name: "Edge Network", href: "/edge-network", icon: Globe },
  { name: "Database", href: "/database", icon: Database },
]

const system = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Security", href: "/security", icon: Shield },
  { name: "Logs", href: "/logs", icon: FileText },
]

export function AdminSidebar() {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { isLight } = useTheme()

  return (
    <aside className={`hidden lg:flex lg:flex-col border-r glass-panel transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <nav className="flex-1 space-y-6 p-4">
        {/* Toggle Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-lg transition-colors ${
              isLight
                ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                : 'text-cyan-300 hover:bg-blue-900/40 hover:text-slate-100'
            }`}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        <div>
          {!isCollapsed && (
            <h3 className={`mb-2 px-3 text-xs font-semibold uppercase tracking-wider ${
              isLight ? 'text-gray-500' : 'text-blue-300/70'
            }`}>Main</h3>
          )}
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                title={isCollapsed ? item.name : ""}
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isCollapsed ? 'justify-center' : 'gap-3'
                } ${
                  location.pathname === item.href
                    ? isLight 
                      ? "bg-blue-100 text-blue-900"
                      : "bg-blue-900/60 text-slate-100"
                    : isLight
                      ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      : "text-blue-100/80 hover:bg-blue-900/40 hover:text-slate-100"
                }`}
              >
                <item.icon className={`h-4 w-4 ${
                  isLight ? 'text-blue-600' : 'text-cyan-300'
                }`} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </div>
        </div>

        <div>
          {!isCollapsed && (
            <h3 className={`mb-2 px-3 text-xs font-semibold uppercase tracking-wider ${
              isLight ? 'text-gray-500' : 'text-blue-300/70'
            }`}>Compute</h3>
          )}
          <div className="space-y-1">
            {compute.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                title={isCollapsed ? item.name : ""}
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isCollapsed ? 'justify-center' : 'gap-3'
                } ${
                  location.pathname === item.href
                    ? isLight 
                      ? "bg-blue-100 text-blue-900"
                      : "bg-blue-900/60 text-slate-100"
                    : isLight
                      ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      : "text-blue-100/80 hover:bg-blue-900/40 hover:text-slate-100"
                }`}
              >
                <item.icon className={`h-4 w-4 ${
                  isLight ? 'text-blue-600' : 'text-cyan-300'
                }`} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </div>
        </div>

        <div>
          {!isCollapsed && (
            <h3 className={`mb-2 px-3 text-xs font-semibold uppercase tracking-wider ${
              isLight ? 'text-gray-500' : 'text-blue-300/70'
            }`}>System</h3>
          )}
          <div className="space-y-1">
            {system.map((item) => (
              <Link    
                key={item.name}
                to={item.href}
                title={isCollapsed ? item.name : ""}
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isCollapsed ? 'justify-center' : 'gap-3'
                } ${
                  location.pathname === item.href
                    ? isLight 
                      ? "bg-blue-100 text-blue-900"
                      : "bg-blue-900/60 text-slate-100"
                    : isLight
                      ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      : "text-blue-100/80 hover:bg-blue-900/40 hover:text-slate-100"
                }`}
              >
                <item.icon className={`h-4 w-4 ${
                  isLight ? 'text-blue-600' : 'text-cyan-300'
                }`} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  )
}