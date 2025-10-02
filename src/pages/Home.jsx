import React from 'react'
import { AnalyticsCharts } from '../components/Charts/analytics-charts'
import { RecentActivity } from '../components/Charts/recent-activity'

export default function HomePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white mb-2">HomePage</h1>
        <p className="text-zinc-400">Monitor your application performance and analytics</p>
      </div>
      <AnalyticsCharts />
      <RecentActivity />
    </div>
  )
}


