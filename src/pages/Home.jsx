import React, { useEffect, useState } from 'react'
import { StatisticsCards } from '../components/Statistics/StatisticsCards'
import RevenueChart from '../components/Charts/RevenueChart'
import { useTheme } from '../contexts/ThemeContext'
import { authApi } from '../api/authApi'
import { transactionApi } from '../api/transactionApi'
import { Calendar, Clock, Activity, Loader2, BadgeDollarSign, Package, Building2, User, ChevronLeft, ChevronRight } from 'lucide-react'

export default function HomePage() {
  const { isLight } = useTheme()
  const userInfo = authApi.getCurrentUser()
  const currentDate = new Date()

  const [recentTransactions, setRecentTransactions] = useState([])
  const [loadingTransactions, setLoadingTransactions] = useState(true)

  // Pagination for transactions
  const [transactionPage, setTransactionPage] = useState(1)
  const [transactionPagination, setTransactionPagination] = useState({
    page: 1,
    size: 10,
    total: 0,
    totalPages: 0
  })

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value)
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Supplier':
        return Package
      case 'Boatyard':
        return Building2
      case 'Owner':
        return User
      default:
        return BadgeDollarSign
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Supplier':
        return isLight ? 'text-blue-600' : 'text-blue-400'
      case 'Boatyard':
        return isLight ? 'text-cyan-600' : 'text-cyan-400'
      case 'Owner':
        return isLight ? 'text-emerald-600' : 'text-emerald-400'
      default:
        return isLight ? 'text-gray-600' : 'text-gray-400'
    }
  }

  const formatDate = (date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    return date.toLocaleDateString('vi-VN', options)
  }

  const getGreeting = () => {
    const hour = currentDate.getHours()
    if (hour < 12) return 'Chào buổi sáng'
    if (hour < 18) return 'Chào buổi chiều'
    return 'Chào buổi tối'
  }

  // Fetch all transactions with pagination
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoadingTransactions(true)
        const response = await transactionApi.getTransactions({
          page: transactionPage,
          size: 10,
          sortBy: 'createdDate',
          isAsc: false
        })
        if (response.status === 200 && response.data) {
          setRecentTransactions(response.data.items || [])
          setTransactionPagination({
            page: response.data.page,
            size: response.data.size,
            total: response.data.total,
            totalPages: response.data.totalPages
          })
        }
      } catch (err) {
        console.error('Error fetching transactions:', err)
      } finally {
        setLoadingTransactions(false)
      }
    }
    fetchTransactions()
  }, [transactionPage])

  return (
    <div className="space-y-6">
      {/* Welcome Header Section */}
      <div className={`relative overflow-hidden rounded-2xl border ${isLight
        ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
        : 'bg-gradient-to-br from-blue-950/50 via-cyan-950/30 to-blue-950/50 border-blue-800/40'
        }`}>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl" />

        <div className="relative p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <h1 className={`text-4xl font-bold mb-2 ${isLight ? 'text-gray-900' : 'text-white'
                }`}>
                {getGreeting()}, {userInfo?.username || 'Admin'}! 👋
              </h1>
              <p className={`text-lg mb-4 ${isLight ? 'text-gray-600' : 'text-blue-200/80'
                }`}>
                Chào mừng đến với Bảng điều khiển MarineBridge
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm ${isLight
                  ? 'bg-white/60 border border-blue-200'
                  : 'bg-blue-900/30 border border-blue-700/30'
                  }`}>
                  <Calendar className={`h-4 w-4 ${isLight ? 'text-blue-600' : 'text-cyan-400'
                    }`} />
                  <span className={`text-sm font-medium ${isLight ? 'text-gray-700' : 'text-blue-200'
                    }`}>
                    {formatDate(currentDate)}
                  </span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm ${isLight
                  ? 'bg-white/60 border border-blue-200'
                  : 'bg-blue-900/30 border border-blue-700/30'
                  }`}>
                  <Clock className={`h-4 w-4 ${isLight ? 'text-blue-600' : 'text-cyan-400'
                    }`} />
                  <span className={`text-sm font-medium ${isLight ? 'text-gray-700' : 'text-blue-200'
                    }`}>
                    {currentDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats Icon */}
            <div className={`hidden md:flex items-center justify-center w-24 h-24 rounded-2xl ${isLight
              ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
              : 'bg-gradient-to-br from-cyan-400 to-blue-400'
              } shadow-lg`}>
              <Activity className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards Section */}
      <div>
        <div className="mb-6">
          <h2 className={`text-2xl font-semibold mb-2 ${isLight ? 'text-gray-900' : 'text-white'
            }`}>
            Tổng Quan Hệ Thống
          </h2>
          <p className={isLight ? 'text-gray-600' : 'text-blue-200/70'}>
            Theo dõi số liệu thống kê tổng quan của hệ thống
          </p>
        </div>
        <StatisticsCards />
      </div>

      {/* Revenue & Transaction Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Section */}
        <RevenueChart />

        {/* Recent Transactions Section */}
        <div className={`rounded-2xl border overflow-hidden transition-all hover:shadow-lg ${isLight
          ? 'bg-white border-gray-200 hover:border-cyan-300'
          : 'bg-gradient-to-br from-blue-950 to-blue-900/50 border-blue-900/40 hover:border-cyan-600/30'
          }`}>
          <div className={`p-6 border-b ${isLight ? 'border-gray-100 bg-blue-50' : 'border-blue-800/40 bg-cyan-950/20'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-xl font-semibold mb-1 ${isLight ? 'text-gray-900' : 'text-white'
                  }`}>
                  🔄 Giao Dịch Gần Đây
                </h3>
                <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-blue-200/70'}`}>
                  Tất cả giao dịch trong hệ thống
                </p>
              </div>
              <div className={`p-3 rounded-xl ${isLight ? 'bg-cyan-100' : 'bg-cyan-900/40'
                }`}>
                <Activity className={`h-6 w-6 ${isLight ? 'text-cyan-700' : 'text-cyan-400'
                  }`} />
              </div>
            </div>
          </div>

          <div className="p-6">
            {loadingTransactions ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
              </div>
            ) : recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => {
                  const TypeIcon = getTypeIcon(transaction.type)
                  const typeColor = getTypeColor(transaction.type)
                  const isRevenue = transaction.type === 'Revenue'

                  return (
                    <div key={transaction.id} className={`p-4 rounded-xl border transition-all hover:shadow-md ${isLight
                      ? `bg-gradient-to-r ${isRevenue ? 'from-red-50 to-transparent border-red-200' : 'from-blue-50 to-transparent border-blue-200'} hover:${isRevenue ? 'border-red-400' : 'border-blue-400'}`
                      : `bg-gradient-to-r ${isRevenue ? 'from-red-900/20 to-transparent border-red-900/40' : 'from-cyan-900/20 to-transparent border-cyan-900/40'} hover:border-${isRevenue ? 'red' : 'cyan'}-600/60`
                      }`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className={`p-2 rounded-lg ${isLight
                          ? isRevenue ? 'bg-red-100' : 'bg-blue-100'
                          : isRevenue ? 'bg-red-900/40' : 'bg-cyan-900/40'
                          }`}>
                          <TypeIcon className={`h-5 w-5 ${isRevenue
                            ? isLight ? 'text-red-600' : 'text-red-400'
                            : typeColor
                            }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${isLight ? 'text-gray-800' : 'text-white'}`}>
                            {transaction.transactionReference || transaction.id.slice(-6)}
                          </p>
                          <p className={`text-xs mt-0.5 ${isLight ? 'text-gray-500' : 'text-blue-200/70'}`}>
                            {transaction.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${isRevenue
                            ? isLight ? 'text-red-600' : 'text-red-400'
                            : isLight ? 'text-blue-600' : 'text-cyan-400'
                            }`}>
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className={`p-3 rounded-full ${isLight ? 'bg-gray-100' : 'bg-blue-900/30'}`}>
                  <Activity className={`h-6 w-6 ${isLight ? 'text-gray-400' : 'text-blue-400/50'}`} />
                </div>
                <p className={`text-center ${isLight ? 'text-gray-500' : 'text-blue-200/70'}`}>
                  Chưa có giao dịch
                </p>
              </div>
            )}

            {/* Pagination */}
            {transactionPagination.totalPages > 0 && (
              <div className={`mt-6 pt-6 border-t flex items-center justify-between ${isLight ? 'border-gray-200' : 'border-blue-800/40'
                }`}>
                <div className={`text-sm ${isLight ? 'text-gray-600' : 'text-blue-200/70'}`}>
                  Hiển thị {((transactionPagination.page - 1) * transactionPagination.size) + 1} - {Math.min(transactionPagination.page * transactionPagination.size, transactionPagination.total)} / {transactionPagination.total}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTransactionPage(prev => Math.max(1, prev - 1))}
                    disabled={transactionPage <= 1}
                    className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${isLight
                      ? 'hover:bg-gray-100 disabled:hover:bg-transparent'
                      : 'hover:bg-blue-800/40 disabled:hover:bg-transparent'
                      }`}
                  >
                    <ChevronLeft className={`h-4 w-4 ${isLight ? 'text-gray-700' : 'text-blue-200'}`} />
                  </button>
                  <span className={`text-sm font-medium ${isLight ? 'text-gray-700' : 'text-white'}`}>
                    {transactionPage} / {transactionPagination.totalPages}
                  </span>
                  <button
                    onClick={() => setTransactionPage(prev => Math.min(transactionPagination.totalPages, prev + 1))}
                    disabled={transactionPage >= transactionPagination.totalPages}
                    className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${isLight
                      ? 'hover:bg-gray-100 disabled:hover:bg-transparent'
                      : 'hover:bg-blue-800/40 disabled:hover:bg-transparent'
                      }`}
                  >
                    <ChevronRight className={`h-4 w-4 ${isLight ? 'text-gray-700' : 'text-blue-200'}`} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


