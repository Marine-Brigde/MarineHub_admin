import React from 'react'
import { AnalyticsCharts } from '../components/Charts/analytics-charts'
import { RecentActivity } from '../components/Charts/recent-activity'
import { useTheme } from '../contexts/ThemeContext'

export default function HomePage() {
  const { isLight } = useTheme()
  
  return (
    <div>
      <div className="mb-8">
        <h1 className={`text-3xl font-semibold mb-2 ${
          isLight ? 'text-gray-900' : 'text-white'
        }`}>HomePage</h1>
        <p className={isLight ? 'text-gray-600' : 'text-zinc-400'}>Monitor your application performance and analytics</p>
      </div>
      <AnalyticsCharts />
      <RecentActivity />
    </div>
  )
}


