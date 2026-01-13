import React, { useEffect, useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { orderApi } from '../../api/orderApi'
import { X, Loader2, Package, Calendar, DollarSign, Ship, AlertCircle, Phone, Building2 } from 'lucide-react'

const STATUS_STYLES = {
    Pending: {
        bg: 'bg-amber-500/15',
        text: 'text-amber-300',
        label: 'Chờ xử lý'
    },
    Approved: {
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-300',
        label: 'Đã duyệt'
    },
    Rejected: {
        bg: 'bg-rose-500/15',
        text: 'text-rose-300',
        label: 'Đã từ chối'
    },
    Completed: {
        bg: 'bg-blue-500/15',
        text: 'text-blue-300',
        label: 'Hoàn thành'
    },
    Delivered: {
        bg: 'bg-purple-500/15',
        text: 'text-purple-300',
        label: 'Đã giao'
    },
    Cancelled: {
        bg: 'bg-gray-500/15',
        text: 'text-gray-300',
        label: 'Đã hủy'
    }
}

function StatusBadge({ status }) {
    const config = STATUS_STYLES[status] || STATUS_STYLES.Pending
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            {config.label}
        </span>
    )
}

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value || 0)
}

const formatDate = (dateString) => {
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

export default function SupplierOrders({ supplier, isOpen, onClose }) {
    const { isLight } = useTheme()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0
    })

    useEffect(() => {
        if (isOpen && supplier?.id) {
            fetchOrders()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, supplier, pagination.page])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            setError(null)

            const params = {
                SupplierId: supplier.id,
                Page: pagination.page,
                PageSize: pagination.pageSize,
                SortBy: 'createdDate',
                IsAsc: false
            }

            const response = await orderApi.getOrders(params)

            if (response.status === 200 && response.data) {
                const { items = [], total = 0, totalPages = 0 } = response.data
                setOrders(items)
                setPagination(prev => ({
                    ...prev,
                    total,
                    totalPages
                }))
            } else {
                setOrders([])
            }
        } catch (err) {
            console.error('Error fetching supplier orders:', err)
            setError('Không thể tải danh sách đơn hàng')
            setOrders([])
        } finally {
            setLoading(false)
        }
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: newPage }))
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`relative w-full max-w-5xl max-h-[90vh] rounded-2xl border shadow-2xl overflow-hidden ${isLight
                ? 'bg-white border-gray-200'
                : 'bg-blue-950/95 border-blue-800/40 backdrop-blur-xl'
                }`}>
                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b ${isLight ? 'border-gray-200' : 'border-blue-800/40'
                    }`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isLight ? 'bg-blue-100' : 'bg-blue-900/60'
                            }`}>
                            <Package className={`h-5 w-5 ${isLight ? 'text-blue-600' : 'text-cyan-300'
                                }`} />
                        </div>
                        <div>
                            <h2 className={`text-xl font-semibold ${isLight ? 'text-gray-900' : 'text-white'
                                }`}>
                                Đơn hàng của {supplier?.name}
                            </h2>
                            <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-blue-100/70'
                                }`}>
                                Danh sách tất cả đơn hàng
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg transition-colors ${isLight
                            ? 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                            : 'text-blue-100/70 hover:bg-blue-900/40 hover:text-white'
                            }`}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                        </div>
                    ) : error ? (
                        <div className={`flex items-center gap-3 p-4 rounded-lg ${isLight ? 'bg-red-50 text-red-700' : 'bg-red-900/20 text-red-300'
                            }`}>
                            <AlertCircle className="h-5 w-5" />
                            <p>{error}</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className={`h-16 w-16 mx-auto mb-4 ${isLight ? 'text-gray-300' : 'text-blue-800/40'
                                }`} />
                            <p className={`text-lg font-medium ${isLight ? 'text-gray-900' : 'text-white'
                                }`}>
                                Chưa có đơn hàng nào
                            </p>
                            <p className={`text-sm mt-1 ${isLight ? 'text-gray-500' : 'text-blue-100/70'
                                }`}>
                                Nhà cung cấp này chưa có đơn hàng nào
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Orders Table */}
                            <div className={`rounded-xl border overflow-hidden ${isLight ? 'border-gray-200' : 'border-blue-800/40'
                                }`}>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className={
                                            isLight ? 'bg-gray-50' : 'bg-blue-900/30'
                                        }>
                                            <tr>
                                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-gray-600' : 'text-blue-200/70'
                                                    }`}>
                                                    Mã đơn
                                                </th>
                                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-gray-600' : 'text-blue-200/70'
                                                    }`}>
                                                    Khách hàng
                                                </th>
                                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-gray-600' : 'text-blue-200/70'
                                                    }`}>
                                                    Số điện thoại
                                                </th>
                                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-gray-600' : 'text-blue-200/70'
                                                    }`}>
                                                    Tổng tiền
                                                </th>
                                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-gray-600' : 'text-blue-200/70'
                                                    }`}>
                                                    Trạng thái
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${isLight ? 'divide-gray-200' : 'divide-blue-800/40'
                                            }`}>
                                            {orders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className={`transition-colors ${isLight
                                                        ? 'hover:bg-gray-50'
                                                        : 'hover:bg-blue-900/20'
                                                        }`}
                                                >
                                                    <td className={`px-4 py-4 ${isLight ? 'text-gray-900' : 'text-white'
                                                        }`}>
                                                        <div className="flex items-center gap-2">
                                                            <Package className="h-4 w-4 text-blue-400" />
                                                            <code className="text-xs font-mono">
                                                                {order.id ? order.id.slice(-8) : 'N/A'}
                                                            </code>
                                                        </div>
                                                    </td>
                                                    <td className={`px-4 py-4 ${isLight ? 'text-gray-600' : 'text-blue-100/80'
                                                        }`}>
                                                        {order.shipName ? (
                                                            <div className="flex items-center gap-2">
                                                                <Ship className="h-4 w-4 text-cyan-400" />
                                                                <span className="text-sm font-medium">
                                                                    {order.shipName}
                                                                </span>
                                                            </div>
                                                        ) : order.boatyardName ? (
                                                            <div className="flex items-center gap-2">
                                                                <Building2 className="h-4 w-4 text-purple-400" />
                                                                <span className="text-sm font-medium">
                                                                    {order.boatyardName}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-gray-400">N/A</span>
                                                        )}
                                                    </td>
                                                    <td className={`px-4 py-4 text-sm ${isLight ? 'text-gray-600' : 'text-blue-100/80'
                                                        }`}>
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="h-4 w-4" />
                                                            {order.phone || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className={`px-4 py-4 font-semibold ${isLight ? 'text-gray-900' : 'text-white'
                                                        }`}>
                                                        <div className="flex items-center gap-1">
                                                            <DollarSign className="h-4 w-4 text-emerald-400" />
                                                            {formatCurrency(order.totalAmount)}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <StatusBadge status={order.status} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6">
                                    <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-blue-100/70'
                                        }`}>
                                        Hiển thị {orders.length} / {pagination.total} đơn hàng
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                            disabled={pagination.page <= 1}
                                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${isLight
                                                ? 'text-gray-700 hover:bg-gray-100 disabled:hover:bg-transparent'
                                                : 'text-blue-100/80 hover:bg-blue-900/40 disabled:hover:bg-transparent'
                                                }`}
                                        >
                                            Trước
                                        </button>
                                        <span className={`text-sm ${isLight ? 'text-gray-700' : 'text-blue-100/80'
                                            }`}>
                                            {pagination.page} / {pagination.totalPages}
                                        </span>
                                        <button
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                            disabled={pagination.page >= pagination.totalPages}
                                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${isLight
                                                ? 'text-gray-700 hover:bg-gray-100 disabled:hover:bg-transparent'
                                                : 'text-blue-100/80 hover:bg-blue-900/40 disabled:hover:bg-transparent'
                                                }`}
                                        >
                                            Tiếp
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className={`flex items-center justify-end gap-3 p-6 border-t ${isLight ? 'border-gray-200' : 'border-blue-800/40'
                    }`}>
                    <button
                        onClick={onClose}
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
    )
}
