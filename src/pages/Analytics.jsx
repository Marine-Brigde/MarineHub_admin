import React from 'react'
import { AnalyticsCharts } from '../components/Charts/analytics-charts'
import { useTheme } from '../contexts/ThemeContext'

export default function AnalyticsPage() {
  const { isLight } = useTheme()
  
  return (
    <div>
      <h1 className={`text-3xl font-semibold mb-6 ${
        isLight ? 'text-gray-900' : 'text-white'
      }`}>Analytics</h1>
      <AnalyticsCharts />
    </div>
  )
}


