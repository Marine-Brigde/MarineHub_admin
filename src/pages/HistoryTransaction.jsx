import React, { useEffect, useMemo, useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { transactionApi } from '../api/transactionApi'
import {
  Wallet2,
  ArrowDownUp,
  BadgeDollarSign,
  DollarSign,
  CalendarRange,
  CheckCircle2,
  ArrowDownToLine,
  Building2,
  Package,
  User,
  Loader2,
  X,
  Copy,
  Calendar,
  Clock,
  FileText
} from 'lucide-react'

// Map API status values to UI labels
const STATUS_STYLES = {
  Approved: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-300',
    label: 'Đã phê duyệt'
  },
  Pending: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    label: 'Chờ xử lý'
  },
  Rejected: {
    bg: 'bg-rose-500/15',
    text: 'text-rose-300',
    label: 'Đã từ chối'
  },
  Processing: {
    bg: 'bg-blue-500/15',
    text: 'text-blue-200',
    label: 'Đang xử lý'
  },
  Completed: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-300',
    label: 'Đã hoàn tất'
  },
  Refunded: {
    bg: 'bg-purple-500/15',
    text: 'text-purple-300',
    label: 'Đã hoàn tiền'
  }
}

// Map API type values to UI labels with light/dark mode support
const TYPE_STYLES = {
  Supplier: {
    light: 'bg-blue-100 text-blue-700 border border-blue-200',
    dark: 'bg-blue-500/10 text-blue-200',
    label: 'Nhà Cung Cấp',
    icon: Package
  },
  Boatyard: {
    light: 'bg-cyan-100 text-cyan-700 border border-cyan-200',
    dark: 'bg-cyan-500/10 text-cyan-200',
    label: 'Xưởng Tàu',
    icon: Building2
  },
  Owner: {
    light: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    dark: 'bg-emerald-500/10 text-emerald-200',
    label: 'Chủ Tàu',
    icon: User
  },
  Revenue: {
    light: 'bg-red-100 text-red-700 border border-red-200',
    dark: 'bg-red-500/10 text-red-200',
    label: 'Tiền Thanh Toán',
    icon: DollarSign
  }
}

const formatCurrency = (value, currency = 'VND') => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency
  }).format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

const formatDateOnly = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch {
    return dateString
  }
}

const formatTimeOnly = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch {
    return dateString
  }
}

// Get last 6 characters of transaction ID
const getShortId = (id) => {
  if (!id) return ''
  return id.length > 6 ? id.slice(-6) : id
}

function StatusBadge({ status }) {
  const config = STATUS_STYLES[status] || STATUS_STYLES.Pending
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}

function TypeBadge({ type, isLight }) {
  const config = TYPE_STYLES[type] || {
    light: 'bg-gray-100 text-gray-700 border border-gray-200',
    dark: 'bg-gray-500/10 text-gray-200',
    label: type,
    icon: BadgeDollarSign
  }
  const Icon = config.icon || BadgeDollarSign
  const badgeClass = isLight ? config.light : config.dark
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${badgeClass}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  )
}

export default function HistoryTransactionPage() {
  const { isLight } = useTheme()

  // Transactions from API
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: 0,
    totalPages: 0
  })

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        page: pagination.page,
        size: pagination.size,
        sortBy: 'createdDate',
        isAsc: false
      }

      const response = await transactionApi.getTransactions(params)

      if (response.status === 200 && response.data) {
        const items = response.data.items || []
        const total = response.data.total || 0
        const totalPages = response.data.totalPages || 1

        setTransactions(items)
        setPagination(prev => ({
          ...prev,
          total,
          totalPages
        }))
      } else {
        setTransactions([])
        setPagination(prev => ({ ...prev, total: 0, totalPages: 0 }))
      }
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setError('Không thể tải dữ liệu giao dịch từ máy chủ. Vui lòng thử lại sau.')
      setTransactions([])
      setPagination(prev => ({ ...prev, total: 0, totalPages: 0 }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagination.page,
    pagination.size
  ])


  // Calculate stats from current page transactions (for display only)
  // Note: For accurate stats across all pages, you'd need a separate API endpoint
  const stats = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { totalVolume: 0, pending: 0, approved: 0, totalTransactions: pagination.total || 0 }
    }

    const totalVolume = transactions.reduce((sum, item) => sum + (item.amount || 0), 0)
    const pending = transactions.filter((item) =>
      ['Pending', 'Processing'].includes(item.status)
    ).length
    const approved = transactions.filter((item) =>
      item.status === 'Approved'
    ).length

    return {
      totalVolume,
      pending,
      approved,
      totalTransactions: pagination.total || transactions.length
    }
  }, [transactions, pagination.total])

  const handlePageChange = (newPage) => {
    if (newPage < 1 || (pagination.totalPages && newPage > pagination.totalPages)) return
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction)
  }

  const handleCloseModal = () => {
    setSelectedTransaction(null)
  }

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id)
    // You could add a toast notification here
  }

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal()
      }
    }
    if (selectedTransaction) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [selectedTransaction])


  const cardBase = isLight
    ? 'border-gray-200 bg-white'
    : 'border-blue-900/40 bg-gradient-to-br from-blue-950/80 to-blue-900/20'
  const headerText = isLight ? 'text-gray-500' : 'text-blue-100/70'

  return (
    <div>
      <div className="mb-8">
        <h1 className={`text-3xl font-semibold mb-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
          Lịch sử giao dịch
        </h1>
        <p className={isLight ? 'text-gray-600' : 'text-blue-100/70'}>
          Quản lý và theo dõi tất cả các giao dịch trong hệ thống MarineBridge
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div
          className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${isLight
            ? 'border-amber-200 bg-amber-50 text-amber-800'
            : 'border-amber-500/40 bg-amber-500/10 text-amber-100'
            }`}
        >
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        <div className={`rounded-2xl border p-5 ${cardBase}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-blue-100/70'}`}>Tổng giá trị</p>
              <p className={`text-2xl font-semibold mt-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {formatCurrency(stats.totalVolume)}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${isLight ? 'bg-blue-100' : 'bg-blue-900/60'}`}>
              <Wallet2 className={`h-5 w-5 ${isLight ? 'text-blue-700' : 'text-cyan-300'}`} />
            </div>
          </div>
        </div>
        <div className={`rounded-2xl border p-5 ${cardBase}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-blue-100/70'}`}>Tổng giao dịch</p>
              <p className={`text-2xl font-semibold mt-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {stats.totalTransactions}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${isLight ? 'bg-purple-100' : 'bg-purple-900/40'}`}>
              <ArrowDownUp className={`h-5 w-5 ${isLight ? 'text-purple-700' : 'text-purple-300'}`} />
            </div>
          </div>
        </div>
        <div className={`rounded-2xl border p-5 ${cardBase}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-blue-100/70'}`}>Đã phê duyệt</p>
              <p className={`text-2xl font-semibold mt-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {stats.approved} giao dịch
              </p>
            </div>
            <div className={`p-3 rounded-xl ${isLight ? 'bg-emerald-100' : 'bg-emerald-900/40'}`}>
              <CheckCircle2 className={`h-5 w-5 ${isLight ? 'text-emerald-700' : 'text-emerald-300'}`} />
            </div>
          </div>
        </div>
      </div>


      {/* Table */}
      <div className={`rounded-2xl border ${isLight ? 'border-gray-200 bg-white' : 'border-blue-900/40 bg-blue-950/50'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isLight ? 'border-b border-gray-200' : 'border-b border-blue-900/40'}>
              <tr>
                <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${headerText}`}>
                  Mã giao dịch
                </th>
                <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${headerText}`}>
                  Loại
                </th>
                <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${headerText}`}>
                  Số tiền
                </th>
                <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${headerText}`}>
                  Trạng thái
                </th>
                <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${headerText}`}>
                  Ngày tạo
                </th>
                <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${headerText}`}>
                  Cập nhật lần cuối
                </th>
              </tr>
            </thead>
            <tbody className={isLight ? 'divide-y divide-gray-200' : 'divide-y divide-blue-900/40'}>
              {loading && (
                <tr>
                  <td colSpan={6} className={`px-6 py-12 text-center ${isLight ? 'text-gray-500' : 'text-blue-100/70'}`}>
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
                      <span className="text-sm">Đang tải dữ liệu giao dịch...</span>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className={`px-6 py-12 text-center ${isLight ? 'text-gray-500' : 'text-blue-100/70'}`}>
                    <div className="flex flex-col items-center gap-3">
                      <ArrowDownToLine className={`h-12 w-12 ${isLight ? 'text-gray-300' : 'text-blue-900/60'}`} />
                      <p className={`text-lg font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        Không có giao dịch
                      </p>
                      <p className="text-sm">
                        Chưa có giao dịch nào trong hệ thống
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  onClick={() => handleTransactionClick(transaction)}
                  className={`cursor-pointer transition-colors ${isLight ? 'hover:bg-gray-50' : 'hover:bg-blue-900/20'
                    }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className={`flex items-center gap-2 font-medium text-sm ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        <ArrowDownUp className={`h-4 w-4 ${isLight ? 'text-blue-600' : 'text-cyan-300'}`} />
                        <span className="font-mono">...{getShortId(transaction.id)}</span>
                      </div>
                      {transaction.transactionReference && (
                        <div className={`text-xs ${isLight ? 'text-gray-500' : 'text-blue-100/70'}`}>
                          Tham chiếu: {transaction.transactionReference}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <TypeBadge type={transaction.type} isLight={isLight} />
                  </td>
                  <td className="px-6 py-4">
                    <div className={`font-semibold text-lg ${isLight ? 'text-gray-900' : 'text-white'}`}>
                      {formatCurrency(transaction.amount || 0)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={transaction.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm ${isLight ? 'text-gray-900' : 'text-white'}`}>
                      {formatDate(transaction.createdDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm ${isLight ? 'text-gray-600' : 'text-blue-100/70'}`}>
                      {formatDate(transaction.lastModifiedDate)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 0 && (
          <div className={`px-6 py-4 border-t flex items-center justify-between ${isLight ? 'border-gray-200' : 'border-blue-900/40'
            }`}>
            <div className={`text-sm ${isLight ? 'text-gray-600' : 'text-blue-100/70'}`}>
              Hiển thị {((pagination.page - 1) * pagination.size) + 1} đến{' '}
              {Math.min(pagination.page * pagination.size, pagination.total)} trong tổng số{' '}
              {pagination.total} giao dịch
            </div>
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1 || loading}
                className={`rounded-lg px-3 py-1 transition-colors disabled:opacity-50 ${isLight
                  ? 'text-gray-700 hover:bg-gray-100 disabled:hover:bg-transparent'
                  : 'text-blue-100/80 hover:bg-blue-900/40 disabled:hover:bg-transparent'
                  }`}
              >
                Trước
              </button>
              <span className={isLight ? 'text-gray-700' : 'text-blue-100/80'}>
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={(pagination.totalPages && pagination.page >= pagination.totalPages) || loading}
                className={`rounded-lg px-3 py-1 transition-colors disabled:opacity-50 ${isLight
                  ? 'text-gray-700 hover:bg-gray-100 disabled:hover:bg-transparent'
                  : 'text-blue-100/80 hover:bg-blue-900/40 disabled:hover:bg-transparent'
                  }`}
              >
                Tiếp
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseModal}
          />

          {/* Modal */}
          <div className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl ${isLight
            ? 'bg-white border-gray-200'
            : 'bg-blue-950/95 border-blue-800/40 backdrop-blur-xl'
            }`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${isLight ? 'border-gray-200' : 'border-blue-800/40'
              }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isLight ? 'bg-blue-100' : 'bg-blue-900/60'
                  }`}>
                  <FileText className={`h-5 w-5 ${isLight ? 'text-blue-600' : 'text-cyan-300'
                    }`} />
                </div>
                <div>
                  <h2 className={`text-xl font-semibold ${isLight ? 'text-gray-900' : 'text-white'
                    }`}>
                    Chi tiết giao dịch
                  </h2>
                  <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-blue-100/70'}`}>
                    Thông tin đầy đủ về giao dịch
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className={`p-2 rounded-lg transition-colors ${isLight
                  ? 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                  : 'text-blue-100/70 hover:bg-blue-900/40 hover:text-white'
                  }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Transaction ID */}
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wider mb-2 block ${isLight ? 'text-gray-500' : 'text-blue-200/70'
                  }`}>
                  Mã giao dịch
                </label>
                <div className={`flex items-center gap-2 p-3 rounded-lg ${isLight ? 'bg-gray-50 border border-gray-200' : 'bg-blue-900/30 border border-blue-800/40'
                  }`}>
                  <code className={`flex-1 font-mono text-sm ${isLight ? 'text-gray-900' : 'text-white'
                    }`}>
                    {selectedTransaction.id}
                  </code>
                  <button
                    onClick={() => handleCopyId(selectedTransaction.id)}
                    className={`p-1.5 rounded transition-colors ${isLight
                      ? 'hover:bg-gray-200 text-gray-600'
                      : 'hover:bg-blue-800/40 text-blue-100/70 hover:text-white'
                      }`}
                    title="Sao chép mã giao dịch"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Transaction Reference */}
                {selectedTransaction.transactionReference && (
                  <div>
                    <label className={`text-xs font-semibold uppercase tracking-wider mb-2 block ${isLight ? 'text-gray-500' : 'text-blue-200/70'
                      }`}>
                      Mã tham chiếu
                    </label>
                    <div className={`p-3 rounded-lg ${isLight ? 'bg-gray-50 border border-gray-200' : 'bg-blue-900/30 border border-blue-800/40'
                      }`}>
                      <p className={`font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        {selectedTransaction.transactionReference}
                      </p>
                    </div>
                  </div>
                )}

                {/* Type */}
                <div>
                  <label className={`text-xs font-semibold uppercase tracking-wider mb-2 block ${isLight ? 'text-gray-500' : 'text-blue-200/70'
                    }`}>
                    Loại giao dịch
                  </label>
                  <div className={`p-3 rounded-lg ${isLight ? 'bg-gray-50 border border-gray-200' : 'bg-blue-900/30 border border-blue-800/40'
                    }`}>
                    <TypeBadge type={selectedTransaction.type} isLight={isLight} />
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className={`text-xs font-semibold uppercase tracking-wider mb-2 block ${isLight ? 'text-gray-500' : 'text-blue-200/70'
                    }`}>
                    Số tiền
                  </label>
                  <div className={`p-3 rounded-lg ${isLight ? 'bg-gray-50 border border-gray-200' : 'bg-blue-900/30 border border-blue-800/40'
                    }`}>
                    <p className={`text-xl font-bold ${isLight ? 'text-gray-900' : 'text-white'
                      }`}>
                      {formatCurrency(selectedTransaction.amount || 0)}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className={`text-xs font-semibold uppercase tracking-wider mb-2 block ${isLight ? 'text-gray-500' : 'text-blue-200/70'
                    }`}>
                    Trạng thái
                  </label>
                  <div className={`p-3 rounded-lg ${isLight ? 'bg-gray-50 border border-gray-200' : 'bg-blue-900/30 border border-blue-800/40'
                    }`}>
                    <StatusBadge status={selectedTransaction.status} />
                  </div>
                </div>

                {/* Created Date */}
                <div>
                  <label className={`text-xs font-semibold uppercase tracking-wider mb-2 block flex items-center gap-1 ${isLight ? 'text-gray-500' : 'text-blue-200/70'
                    }`}>
                    <Calendar className="h-3 w-3" />
                    Ngày tạo
                  </label>
                  <div className={`p-3 rounded-lg ${isLight ? 'bg-gray-50 border border-gray-200' : 'bg-blue-900/30 border border-blue-800/40'
                    }`}>
                    <p className={`font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>
                      {formatDateOnly(selectedTransaction.createdDate)}
                    </p>
                    <p className={`text-sm mt-1 ${isLight ? 'text-gray-500' : 'text-blue-100/70'}`}>
                      {formatTimeOnly(selectedTransaction.createdDate)}
                    </p>
                  </div>
                </div>

                {/* Last Modified Date */}
                {selectedTransaction.lastModifiedDate && (
                  <div>
                    <label className={`text-xs font-semibold uppercase tracking-wider mb-2 block flex items-center gap-1 ${isLight ? 'text-gray-500' : 'text-blue-200/70'
                      }`}>
                      <Clock className="h-3 w-3" />
                      Cập nhật lần cuối
                    </label>
                    <div className={`p-3 rounded-lg ${isLight ? 'bg-gray-50 border border-gray-200' : 'bg-blue-900/30 border border-blue-800/40'
                      }`}>
                      <p className={`font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        {formatDateOnly(selectedTransaction.lastModifiedDate)}
                      </p>
                      <p className={`text-sm mt-1 ${isLight ? 'text-gray-500' : 'text-blue-100/70'}`}>
                        {formatTimeOnly(selectedTransaction.lastModifiedDate)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className={`flex items-center justify-end gap-3 p-6 border-t ${isLight ? 'border-gray-200' : 'border-blue-800/40'
              }`}>
              <button
                onClick={handleCloseModal}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isLight
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-blue-100/80 hover:bg-blue-900/40'
                  }`}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
