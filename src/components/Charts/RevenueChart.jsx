import React, { useEffect, useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { revenueApi } from '../../api/revenueApi'
import { TrendingUp, Loader2 } from 'lucide-react'

export default function RevenueChart() {
    const { isLight } = useTheme()
    const [revenues, setRevenues] = useState([])
    const [loading, setLoading] = useState(true)
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    })

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value)
    }

    const formatCurrencyShort = (value) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`
        }
        return value.toString()
    }

    // Initialize default date range (start of month to end of month)
    useEffect(() => {
        const today = new Date()
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

        const startDate = startOfMonth.toISOString().split('T')[0]
        const endDate = endOfMonth.toISOString().split('T')[0]

        setDateRange({ startDate, endDate })
    }, [])

    // Fetch revenues based on date range
    useEffect(() => {
        if (!dateRange.startDate || !dateRange.endDate) return

        const fetchRevenues = async () => {
            try {
                setLoading(true)
                const response = await revenueApi.getRevenues({
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate
                })
                if (response.status === 200 && response.data) {
                    setRevenues(response.data || [])
                }
            } catch (err) {
                console.error('Error fetching revenues:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchRevenues()
    }, [dateRange])

    // Calculate max value for chart scaling
    const maxRevenue = Math.max(...revenues.map(r => r.totalRevenue), 0)

    return (
        <div className={`rounded-2xl border overflow-hidden transition-all hover:shadow-lg ${isLight
            ? 'bg-white border-gray-200 hover:border-emerald-300'
            : 'bg-gradient-to-br from-blue-950 to-blue-900/50 border-blue-900/40 hover:border-emerald-600/30'
            }`}>
            {/* Header */}
            <div className={`p-6 border-b ${isLight ? 'border-gray-100 bg-gray-50' : 'border-blue-800/40 bg-emerald-950/20'}`}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className={`text-xl font-semibold mb-1 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                            📊 Biểu Đồ Doanh Thu
                        </h3>
                        <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-blue-200/70'}`}>
                            Doanh thu theo tháng
                        </p>
                    </div>
                    <div className={`p-3 rounded-xl ${isLight ? 'bg-emerald-100' : 'bg-emerald-900/40'}`}>
                        <TrendingUp className={`h-6 w-6 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
                    </div>
                </div>

                {/* Date Range Picker */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={`text-xs font-semibold mb-1 block ${isLight ? 'text-gray-600' : 'text-blue-200/70'}`}>
                            Từ ngày
                        </label>
                        <input
                            type="date"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                            className={`w-full rounded-lg px-3 py-2 text-sm border ${isLight
                                ? 'border-gray-300 bg-white text-gray-900'
                                : 'border-blue-700/40 bg-blue-900/40 text-white'
                                }`}
                        />
                    </div>
                    <div>
                        <label className={`text-xs font-semibold mb-1 block ${isLight ? 'text-gray-600' : 'text-blue-200/70'}`}>
                            Đến ngày
                        </label>
                        <input
                            type="date"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                            className={`w-full rounded-lg px-3 py-2 text-sm border ${isLight
                                ? 'border-gray-300 bg-white text-gray-900'
                                : 'border-blue-700/40 bg-blue-900/40 text-white'
                                }`}
                        />
                    </div>
                </div>
            </div>

            {/* Chart Content */}
            <div className="p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
                    </div>
                ) : revenues.length > 0 ? (
                    <>
                        {/* Summary Stats */}
                        <div className={`mb-6 p-4 rounded-xl grid grid-cols-3 gap-3 text-center ${isLight ? 'bg-gradient-to-b from-emerald-50 to-transparent' : 'bg-gradient-to-b from-emerald-900/20 to-transparent'
                            }`}>
                            <div>
                                <p className={`text-xs mb-1 ${isLight ? 'text-gray-600' : 'text-blue-200/70'}`}>
                                    Tổng Doanh Thu
                                </p>
                                <p className={`text-lg font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                                    {formatCurrency(revenues.reduce((sum, r) => sum + (r.totalRevenue || 0), 0))}
                                </p>
                            </div>
                            <div>
                                <p className={`text-xs mb-1 ${isLight ? 'text-gray-600' : 'text-blue-200/70'}`}>
                                    Tổng Lợi Nhuận
                                </p>
                                <p className={`text-lg font-bold ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
                                    {formatCurrency(revenues.reduce((sum, r) => sum + (r.netRevenue || 0), 0))}
                                </p>
                            </div>
                            <div>
                                <p className={`text-xs mb-1 ${isLight ? 'text-gray-600' : 'text-blue-200/70'}`}>
                                    Số Tháng
                                </p>
                                <p className={`text-lg font-bold ${isLight ? 'text-blue-700' : 'text-blue-400'}`}>
                                    {revenues.length}
                                </p>
                            </div>
                        </div>

                        {/* Bar Chart */}
                        <div className="space-y-4">
                            {revenues.map((revenue, index) => {
                                const percentage = maxRevenue > 0 ? (revenue.totalRevenue / maxRevenue) * 100 : 0
                                const netPercentage = maxRevenue > 0 ? (revenue.netRevenue / maxRevenue) * 100 : 0

                                return (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm font-semibold ${isLight ? 'text-gray-700' : 'text-white'
                                                }`}>
                                                Tháng {revenue.month}/{revenue.year}
                                            </span>
                                            <div className="text-right">
                                                <p className={`text-sm font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                                                    Doanh thu: {formatCurrency(revenue.totalRevenue)}
                                                </p>
                                                <p className={`text-xs font-semibold ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}>
                                                    Lợi nhuận: {formatCurrency(revenue.netRevenue)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Total Revenue Bar */}
                                        <div className="relative">
                                            <div className={`h-8 rounded-lg overflow-hidden ${isLight ? 'bg-gray-200' : 'bg-blue-900/30'
                                                }`}>
                                                <div
                                                    className={`h-full rounded-lg transition-all duration-500 ${isLight
                                                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                                                        : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                                                        }`}
                                                    style={{ width: `${percentage}%` }}
                                                >
                                                    <div className="h-full flex items-center justify-end pr-2">
                                                        {percentage > 15 && (
                                                            <span className="text-xs font-bold text-white">
                                                                {formatCurrencyShort(revenue.totalRevenue)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Net Revenue Bar */}
                                        <div className="relative">
                                            <div className={`h-6 rounded-lg overflow-hidden ${isLight ? 'bg-gray-100' : 'bg-blue-900/20'
                                                }`}>
                                                <div
                                                    className={`h-full rounded-lg transition-all duration-500 ${isLight
                                                        ? 'bg-gradient-to-r from-cyan-400 to-cyan-500'
                                                        : 'bg-gradient-to-r from-cyan-500 to-cyan-600'
                                                        }`}
                                                    style={{ width: `${netPercentage}%` }}
                                                >
                                                    <div className="h-full flex items-center justify-end pr-2">
                                                        {netPercentage > 15 && (
                                                            <span className="text-xs font-bold text-white">
                                                                {formatCurrencyShort(revenue.netRevenue)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
                                                <span className={isLight ? 'text-gray-600' : 'text-blue-200/70'}>
                                                    Doanh thu
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-cyan-400 to-cyan-500"></div>
                                                <span className={isLight ? 'text-gray-600' : 'text-blue-200/70'}>
                                                    Lợi nhuận
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <div className={`p-3 rounded-full ${isLight ? 'bg-gray-100' : 'bg-blue-900/30'}`}>
                            <TrendingUp className={`h-6 w-6 ${isLight ? 'text-gray-400' : 'text-blue-400/50'}`} />
                        </div>
                        <p className={`text-center ${isLight ? 'text-gray-500' : 'text-blue-200/70'}`}>
                            Chưa có doanh thu trong khoảng thời gian này
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
