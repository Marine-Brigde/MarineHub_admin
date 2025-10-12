import React from 'react'
import { RecentActivity } from '../components/Charts/recent-activity'
import { useTheme } from '../contexts/ThemeContext'

export default function ActivityPage() {
  const { isLight } = useTheme()
  
  return (
    <div>
      <h1 className={`text-3xl font-semibold mb-6 ${
        isLight ? 'text-gray-900' : 'text-white'
      }`}>Activity</h1>
      <RecentActivity />
    </div>
  )
}


