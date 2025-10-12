"use client"
import React from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart } from "recharts"
import { useTheme } from '../../contexts/ThemeContext'

const requestsData = [
  { time: "00:00", value: 2400, error: 24, success: 2376 },
  { time: "04:00", value: 1800, error: 18, success: 1782 },
  { time: "08:00", value: 2800, error: 28, success: 2772 },
  { time: "12:00", value: 2200, error: 22, success: 2178 },
  { time: "16:00", value: 2600, error: 26, success: 2574 },
  { time: "20:00", value: 2100, error: 21, success: 2079 },
  { time: "24:00", value: 2400, error: 24, success: 2376 },
]

const dataTransferData = [
  { time: "00:00", outgoing: 5.2, incoming: 3.1 },
  { time: "04:00", outgoing: 4.8, incoming: 2.8 },
  { time: "08:00", outgoing: 6.1, incoming: 3.5 },
  { time: "12:00", outgoing: 5.5, incoming: 3.2 },
  { time: "16:00", outgoing: 5.8, incoming: 3.4 },
  { time: "20:00", outgoing: 5.3, incoming: 3.0 },
  { time: "24:00", outgoing: 5.2, incoming: 3.1 },
]

const responseTimeData = [
  { time: "00:00", avg: 340 },
  { time: "04:00", avg: 320 },
  { time: "08:00", avg: 380 },
  { time: "12:00", avg: 350 },
  { time: "16:00", avg: 360 },
  { time: "20:00", avg: 330 },
  { time: "24:00", avg: 340 },
]

export function AnalyticsCharts() {
  const { isLight } = useTheme()
  
  return (
    <div className="grid gap-4 md:grid-cols-2 mb-6">
      <div className={`rounded-lg border p-6 ${
        isLight 
          ? 'border-gray-200 bg-white' 
          : 'border-zinc-800 bg-zinc-900'
      }`}>
        <div className="mb-4">
          <h3 className={`text-base font-semibold mb-2 ${
            isLight ? 'text-gray-900' : 'text-white'
          }`}>Edge Requests</h3>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span className={isLight ? 'text-gray-600' : 'text-zinc-400'}>2XX</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className={isLight ? 'text-gray-600' : 'text-zinc-400'}>4XX</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className={isLight ? 'text-gray-600' : 'text-zinc-400'}>5XX</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={requestsData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke={isLight ? "#6b7280" : "#71717a"} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke={isLight ? "#6b7280" : "#71717a"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isLight ? "#ffffff" : "#18181b",
                border: isLight ? "1px solid #e5e7eb" : "1px solid #27272a",
                borderRadius: "8px",
                color: isLight ? "#374151" : "#fff",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#a855f7"
              fillOpacity={1}
              fill="url(#colorValue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={`rounded-lg border p-6 ${
        isLight 
          ? 'border-gray-200 bg-white' 
          : 'border-zinc-800 bg-zinc-900'
      }`}>
        <div className="mb-4">
          <h3 className={`text-base font-semibold mb-2 ${
            isLight ? 'text-gray-900' : 'text-white'
          }`}>Fast Data Transfer</h3>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span className={isLight ? 'text-gray-600' : 'text-zinc-400'}>Outgoing: 102GB</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className={isLight ? 'text-gray-600' : 'text-zinc-400'}>Incoming: 3GB</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={dataTransferData}>
            <defs>
              <linearGradient id="colorOutgoing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke={isLight ? "#6b7280" : "#71717a"} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke={isLight ? "#6b7280" : "#71717a"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}GB`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isLight ? "#ffffff" : "#18181b",
                border: isLight ? "1px solid #e5e7eb" : "1px solid #27272a",
                borderRadius: "8px",
                color: isLight ? "#374151" : "#fff",
              }}
            />
            <Area
              type="monotone"
              dataKey="outgoing"
              stroke="#a855f7"
              fillOpacity={1}
              fill="url(#colorOutgoing)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="incoming"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorIncoming)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={`rounded-lg border p-6 md:col-span-2 ${
        isLight 
          ? 'border-gray-200 bg-white' 
          : 'border-zinc-800 bg-zinc-900'
      }`}>
        <div className="mb-4">
          <h3 className={`text-base font-semibold mb-1 ${
            isLight ? 'text-gray-900' : 'text-white'
          }`}>Average Response Size</h3>
          <div className={`text-2xl font-bold ${
            isLight ? 'text-gray-900' : 'text-white'
          }`}>352.7 kB</div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={responseTimeData}>
            <XAxis dataKey="time" stroke={isLight ? "#6b7280" : "#71717a"} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke={isLight ? "#6b7280" : "#71717a"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}ms`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isLight ? "#ffffff" : "#18181b",
                border: isLight ? "1px solid #e5e7eb" : "1px solid #27272a",
                borderRadius: "8px",
                color: isLight ? "#374151" : "#fff",
              }}
            />
            <Line type="monotone" dataKey="avg" stroke="#a855f7" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}