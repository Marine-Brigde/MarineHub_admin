import React, { useEffect, useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { bookingApi } from '../../api/bookingApi'
import { X, Loader2, BookOpen, DollarSign, Ship, Phone, Building2 } from 'lucide-react'

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
        return date.toLocaleString('vi-VN')
    } catch {
        return dateString
    }
}

export default function BoatyardBookings({ isOpen, onClose, boatyard }) {
    const { isLight } = useTheme()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        total: 0,
        totalPages: 0
    })

    useEffect(() => {
        if (isOpen && boatyard?.id) {
            fetchBookings(1)
        }
    }, [isOpen, boatyard?.id])

    const fetchBookings = async (page = 1) => {
        if (!boatyard?.id) return

        try {
            setLoading(true)
            const response = await bookingApi.getBookings({
                BoatyardId: boatyard.id,
                Page: page,
                PageSize: 10
            })

            if (response.status === 200 && response.data) {
                setBookings(response.data.items || [])
                setPagination({
                    page: response.data.page || page,
                    size: 10,
                    total: response.data.total || 0,
                    totalPages: response.data.totalPages || 1
                })
            }
        } catch (err) {
            console.error('Error fetching bookings:', err)
            setBookings([])
        } finally {
            setLoading(false)
        }
    }

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.totalPages) return
        fetchBookings(newPage)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

            {/* Modal */}
            <div className={`relative w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden ${isLight ? 'bg-white' : 'bg-zinc-900'
                }`}>
                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b ${isLight ? 'border-gray-200 bg-gray-50' : 'border-zinc-800 bg-zinc-800'
                    }`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isLight ? 'bg-emerald-100' : 'bg-emerald-900/30'
                            }`}>
                            <BookOpen className={`h-6 w-6 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
                        </div>
                        <div>
                            <h2 className={`text-lg font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                                Danh sách booking - {boatyard?.name}
                            </h2>
                            <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-zinc-400'}`}>
                                Tổng {pagination.total} booking
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg transition-colors ${isLight
                            ? 'text-gray-400 hover:bg-gray-200'
                            : 'text-zinc-400 hover:bg-zinc-800'
                            }`}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className={`p-6 max-h-[calc(100vh-300px)] overflow-y-auto ${isLight ? 'bg-white' : 'bg-zinc-900'
                    }`}>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className={`text-center py-12 ${isLight ? 'text-gray-500' : 'text-zinc-400'}`}>
                            <BookOpen className={`h-12 w-12 mx-auto mb-3 ${isLight ? 'text-gray-300' : 'text-zinc-700'}`} />
                            <p className="text-lg font-medium">Không có booking nào</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {bookings.map((booking, index) => (
                                <div
                                    key={booking.id}
                                    className={`p-4 rounded-lg border ${isLight
                                        ? 'border-gray-200 bg-gray-50'
                                        : 'border-zinc-800 bg-zinc-800/50'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${isLight
                                                    ? 'bg-gray-200 text-gray-700'
                                                    : 'bg-zinc-700 text-zinc-200'
                                                    }`}>
                                                    #{index + 1}
                                                </span>
                                                <code className={`text-xs font-mono ${isLight ? 'text-gray-600' : 'text-zinc-400'
                                                    }`}>
                                                    {booking.id.slice(-8)}
                                                </code>
                                            </div>

                                            {booking.shipName && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Ship className="h-4 w-4 text-cyan-400" />
                                                    <span className={isLight ? 'text-gray-700' : 'text-zinc-300'}>
                                                        {booking.shipName}
                                                    </span>
                                                </div>
                                            )}

                                            {booking.description && (
                                                <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-zinc-400'}`}>
                                                    {booking.description}
                                                </p>
                                            )}

                                            {booking.createdDate && (
                                                <div className="flex items-center gap-2 text-xs">
                                                    <Calendar className="h-3 w-3 text-gray-400" />
                                                    <span className={isLight ? 'text-gray-600' : 'text-zinc-400'}>
                                                        {formatDate(booking.createdDate)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-right space-y-2">
                                            {booking.totalAmount && (
                                                <div>
                                                    <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-zinc-400'}`}>
                                                        Giá trị
                                                    </p>
                                                    <p className={`text-lg font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                                                        {formatCurrency(booking.totalAmount)}
                                                    </p>
                                                </div>
                                            )}
                                            <StatusBadge status={booking.status} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer - Pagination */}
                {pagination.totalPages > 0 && (
                    <div className={`sticky bottom-0 px-6 py-4 border-t flex items-center justify-between ${isLight ? 'border-gray-200 bg-gray-50' : 'border-zinc-800 bg-zinc-800'
                        }`}>
                        <div className={`text-sm ${isLight ? 'text-gray-600' : 'text-zinc-400'}`}>
                            Trang {pagination.page} / {pagination.totalPages}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                className={`px-3 py-1 rounded-lg text-sm transition-colors disabled:opacity-50 ${isLight
                                    ? 'text-gray-700 hover:bg-gray-200 disabled:hover:bg-transparent'
                                    : 'text-zinc-300 hover:bg-zinc-700 disabled:hover:bg-transparent'
                                    }`}
                            >
                                Trước
                            </button>
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages}
                                className={`px-3 py-1 rounded-lg text-sm transition-colors disabled:opacity-50 ${isLight
                                    ? 'text-gray-700 hover:bg-gray-200 disabled:hover:bg-transparent'
                                    : 'text-zinc-300 hover:bg-zinc-700 disabled:hover:bg-transparent'
                                    }`}
                            >
                                Tiếp
                            </button>
                            <button
                                onClick={onClose}
                                className={`px-4 py-1 rounded-lg font-medium transition-colors ${isLight
                                    ? 'text-gray-700 hover:bg-gray-200'
                                    : 'text-zinc-300 hover:bg-zinc-700'
                                    }`}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
