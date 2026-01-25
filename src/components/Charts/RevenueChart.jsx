import React, { useEffect, useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { revenueApi } from '../../api/revenueApi'
import { TrendingUp, Loader2 } from 'lucide-react'

export default function RevenueChart() {
    const { isLight } = useTheme()
    const [revenues, setRevenues] = useState([])
    const [allMonths, setAllMonths] = useState([]) // Store all months for buttons
    const [loading, setLoading] = useState(true)
    const [selectedMonth, setSelectedMonth] = useState(null) // null = all, or {month, year}

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

    useEffect(() => {
        const fetchAllMonths = async () => {
            try {
                setLoading(true)
                const response = await revenueApi.getRevenues()

                if (response.status === 200 && response.data) {
                    setAllMonths(response.data || [])
                    setRevenues(response.data || [])
                }
            } catch (err) {
                console.error('Error fetching revenues:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchAllMonths()
    }, [])

    // Fetch revenues based on selected month
    useEffect(() => {
        const fetchMonthData = async () => {
            try {
                setLoading(true)

                if (!selectedMonth) {
                    // Fetch all revenues
                    const response = await revenueApi.getRevenues()
                    if (response.status === 200 && response.data) {
                        setRevenues(response.data || [])
                    }
                } else {
                    // Fetch specific month data
                    const year = selectedMonth.year
                    const month = selectedMonth.month
                    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0]
                    const endDate = new Date(year, month, 0).toISOString().split('T')[0]

                    const response = await revenueApi.getRevenues({
                        startDate,
                        endDate
                    })

                    if (response.status === 200 && response.data) {
                        setRevenues(response.data || [])
                    }
                }
            } catch (err) {
                console.error('Error fetching revenues:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchMonthData()
    }, [selectedMonth])

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

                {/* Month Selector Buttons */}
                <div className="space-y-3">
                    <p className={`text-xs font-semibold ${isLight ? 'text-gray-600' : 'text-blue-200/70'}`}>
                        Chọn tháng (để xem tất cả, không chọn)
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedMonth(null)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${selectedMonth === null
                                ? isLight
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-cyan-600/30 text-white border-cyan-500/60'
                                : isLight
                                    ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                    : 'bg-blue-900/30 text-blue-100 border-blue-800/40 hover:bg-blue-900/50'
                                }`}
                        >
                            Tất cả
                        </button>

                        {allMonths.map((monthData, index) => {
                            const isSelected = selectedMonth?.month === parseInt(monthData.month) &&
                                selectedMonth?.year === parseInt(monthData.year)
                            return (
                                <button
                                    key={index}
                                    onClick={() => setSelectedMonth({
                                        month: parseInt(monthData.month),
                                        year: parseInt(monthData.year)
                                    })}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${isSelected
                                        ? isLight
                                            ? 'bg-emerald-600 text-white border-emerald-600'
                                            : 'bg-emerald-500/25 text-emerald-100 border-emerald-500/50'
                                        : isLight
                                            ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                            : 'bg-blue-900/30 text-blue-100 border-blue-800/40 hover:bg-blue-900/50'
                                        }`}
                                >
                                    Tháng {monthData.month}/{monthData.year}
                                </button>
                            )
                        })}
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
                                    Tổng Lợi Nhuận Thu Về
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
                                const netRevenue = revenue.netRevenue || 0
                                const netPercentage = maxRevenue > 0 ? (netRevenue / maxRevenue) * 100 : 0

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
                                                    Lợi nhuận thu về: {formatCurrency(netRevenue)}
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
                                                                {formatCurrencyShort(netRevenue)}
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

