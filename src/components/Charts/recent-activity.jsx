import { ArrowRight } from "lucide-react"
import React from 'react'
const activities = [
  {
    path: "/api/users",
    requests: "292K",
    status: "2XX",
    trend: "stable",
  },
  {
    path: "/api/products",
    requests: "156K",
    status: "2XX",
    trend: "up",
  },
  {
    path: "/api/orders",
    requests: "89K",
    status: "2XX",
    trend: "up",
  },
  {
    path: "/api/auth",
    requests: "45K",
    status: "4XX",
    trend: "down",
  },
]

export function RecentActivity() {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-white">Request Paths</h3>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border border-zinc-800 p-4 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="font-mono text-sm text-white">{activity.path}</div>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  activity.status === "2XX" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                }`}
              >
                {activity.status}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-semibold text-white">{activity.requests}</div>
              <ArrowRight className="h-4 w-4 text-zinc-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
