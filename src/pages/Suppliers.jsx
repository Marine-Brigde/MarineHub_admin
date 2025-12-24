import React, { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { supplierApi } from '../api/supplierApi'
import { revenueApi } from '../api/revenueApi'
import { Search, Package, MapPin, Calendar, User, Phone, Mail, Globe, Eye, DollarSign, X, QrCode, Download } from 'lucide-react'

export default function SuppliersPage() {
  const { isLight } = useTheme()
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    size: 9,
    total: 0,
    totalPages: 0
  })
  const [searchName, setSearchName] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [isAsc, setIsAsc] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [revenueOpen, setRevenueOpen] = useState(false)
  const [revenueForm, setRevenueForm] = useState({
    startDate: '',
    endDate: ''
  })
  const [creatingRevenue, setCreatingRevenue] = useState(false)
  const [revenueError, setRevenueError] = useState(null)
  const [qrCodeUrl, setQrCodeUrl] = useState(null)
  const [revenueSuccess, setRevenueSuccess] = useState(false)

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        page: pagination.page,
        size: pagination.size,
        sortBy,
        isAsc,
        name: searchName
      }

      const response = await supplierApi.getSuppliers(params)

      if (response.status === 200) {
        setSuppliers(response.data.items || [])
        setPagination(prev => ({
          ...prev,
          total: response.data.total,
          totalPages: response.data.totalPages
        }))
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tải danh sách nhà cung cấp')
      console.error('Error fetching suppliers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.size, sortBy, isAsc])

  const handleSearch = (e) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchSuppliers()
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setIsAsc(!isAsc)
    } else {
      setSortBy(field)
      setIsAsc(false)
    }
  }

  const openDetail = (supplier) => {
    setSelectedSupplier(supplier)
    setDetailOpen(true)
  }

  const closeDetail = () => {
    setDetailOpen(false)
    setSelectedSupplier(null)
  }

  const openRevenue = (supplier) => {
    setSelectedSupplier(supplier)
    const today = new Date().toISOString().split('T')[0]
    const adjustedStartDate = adjustDateToMonthBoundary(today, true)
    const adjustedEndDate = adjustDateToMonthBoundary(today, false)
    setRevenueForm({
      startDate: adjustedStartDate,
      endDate: adjustedEndDate
    })
    setRevenueError(null)
    setQrCodeUrl(null)
    setRevenueSuccess(false)
    setRevenueOpen(true)
  }

  const closeRevenue = () => {
    setRevenueOpen(false)
    setSelectedSupplier(null)
    setRevenueForm({ startDate: '', endDate: '' })
    setRevenueError(null)
    setQrCodeUrl(null)
    setRevenueSuccess(false)
  }

  // Helper function to adjust dates to start/end of month
  const adjustDateToMonthBoundary = (dateString, isStartDate) => {
    const date = new Date(dateString)
    if (isStartDate) {
      // Set to first day of month
      date.setDate(1)
    } else {
      // Set to last day of month
      date.setMonth(date.getMonth() + 1)
      date.setDate(0)
    }
    return date.toISOString().split('T')[0]
  }

  const handleRevenueChange = (e) => {
    const { name, value } = e.target
    if (!value) {
      setRevenueForm(prev => ({ ...prev, [name]: value }))
    } else {
      const adjustedDate = adjustDateToMonthBoundary(value, name === 'startDate')
      setRevenueForm(prev => ({ ...prev, [name]: adjustedDate }))
    }
    setRevenueError(null)
  }

  const createRevenue = async () => {
    if (!selectedSupplier) return

    // Validation
    if (!revenueForm.startDate) {
      setRevenueError('Vui lòng chọn ngày bắt đầu')
      return
    }
    if (!revenueForm.endDate) {
      setRevenueError('Vui lòng chọn ngày kết thúc')
      return
    }
    if (new Date(revenueForm.endDate) < new Date(revenueForm.startDate)) {
      setRevenueError('Ngày kết thúc phải sau ngày bắt đầu')
      return
    }

    try {
      setCreatingRevenue(true)
      setRevenueError(null)

      const payload = {
        id: selectedSupplier.id,
        type: 'Supplier', // Tự động set cho Suppliers page
        startDate: revenueForm.startDate,
        endDate: revenueForm.endDate
      }

      const response = await revenueApi.createRevenue(payload)

      if (response.status === 200) {
        setQrCodeUrl(response.data)
        setRevenueSuccess(true)
      } else {
        setRevenueError(response.message || 'Tạo đơn doanh thu thất bại')
      }
    } catch (err) {
      setRevenueError(err.message || err.response?.data?.message || 'Tạo đơn doanh thu thất bại')
      console.error('Error creating revenue:', err)
    } finally {
      setCreatingRevenue(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-semibold mb-2 ${isLight ? 'text-gray-900' : 'text-white'
          }`}>Quản lý Nhà Cung Cấp</h1>
        <p className={isLight ? 'text-gray-600' : 'text-zinc-400'}>
          Quản lý danh sách các nhà cung cấp trong hệ thống
        </p>
      </div>

      {/* Search and Controls */}
      <div className={`rounded-lg border p-6 mb-6 ${isLight
        ? 'border-gray-200 bg-white'
        : 'border-zinc-800 bg-zinc-900'
        }`}>
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isLight ? 'text-gray-500' : 'text-blue-300/70'
              }`} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên nhà cung cấp..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-1 ${isLight
                ? 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/40'
                : 'border-blue-800/60 bg-blue-900/40 text-slate-100 placeholder:text-blue-300/60 focus:border-cyan-500/50 focus:ring-cyan-500/40'
                }`}
            />
          </div>
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${isLight
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-cyan-600 text-white hover:bg-cyan-700'
              }`}
          >
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isLight ? 'border-blue-600' : 'border-cyan-400'
            }`}></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className={`rounded-lg border p-4 mb-6 ${isLight
          ? 'border-red-200 bg-red-50 text-red-800'
          : 'border-red-800 bg-red-900/20 text-red-400'
          }`}>
          {error}
        </div>
      )}

      {/* Suppliers Table */}
      {!loading && !error && (
        <div className={`rounded-lg border ${isLight
          ? 'border-gray-200 bg-white'
          : 'border-zinc-800 bg-zinc-900'
          }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b ${isLight ? 'border-gray-200' : 'border-zinc-800'
                }`}>
                <tr>
                  <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${isLight ? 'text-gray-500' : 'text-zinc-400'
                    }`}>
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center justify-center gap-1 hover:underline mx-auto"
                    >
                      Tên Nhà Cung Cấp
                      {sortBy === 'name' && (
                        <span className={isAsc ? 'rotate-180' : ''}>↑</span>
                      )}
                    </button>
                  </th>
                  <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${isLight ? 'text-gray-500' : 'text-zinc-400'
                    }`}>
                    Chủ sở hữu
                  </th>
                  <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${isLight ? 'text-gray-500' : 'text-zinc-400'
                    }`}>
                    Liên hệ
                  </th>
                  <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${isLight ? 'text-gray-500' : 'text-zinc-400'
                    }`}>
                    Tọa độ
                  </th>
                  <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${isLight ? 'text-gray-500' : 'text-zinc-400'
                    }`}>
                    <button
                      onClick={() => handleSort('createdDate')}
                      className="flex items-center justify-center gap-1 hover:underline mx-auto"
                    >
                      Ngày tạo
                      {sortBy === 'createdDate' && (
                        <span className={isAsc ? 'rotate-180' : ''}>↑</span>
                      )}
                    </button>
                  </th>
                  <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${isLight ? 'text-gray-500' : 'text-zinc-400'
                    }`}>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? 'divide-gray-200' : 'divide-zinc-800'
                }`}>
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className={`hover:bg-opacity-50 ${isLight ? 'hover:bg-gray-50' : 'hover:bg-zinc-800/50'
                    }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isLight ? 'bg-cyan-100' : 'bg-cyan-900/40'
                          }`}>
                          <Package className={`h-4 w-4 ${isLight ? 'text-cyan-600' : 'text-cyan-400'
                            }`} />
                        </div>
                        <div>
                          <div className={`font-medium ${isLight ? 'text-gray-900' : 'text-white'
                            }`}>
                            {supplier.name || 'Chưa có tên'}
                          </div>
                          {supplier.username && (
                            <div className={`text-xs mt-0.5 ${isLight ? 'text-gray-500' : 'text-zinc-400'
                              }`}>
                              @{supplier.username}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {supplier.avatarUrl ? (
                          <img
                            src={supplier.avatarUrl}
                            alt={supplier.fullName || 'User'}
                            className="h-8 w-8 rounded-full object-cover border-2 border-opacity-50"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${supplier.avatarUrl ? 'hidden' : 'flex'
                            } ${isLight
                              ? 'bg-cyan-100 border-cyan-300 text-cyan-700'
                              : 'bg-cyan-900/40 border-cyan-700 text-cyan-300'
                            }`}
                        >
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <div className={`text-sm font-medium ${isLight ? 'text-gray-900' : 'text-white'
                            }`}>
                            {supplier.fullName || 'N/A'}
                          </div>
                          {supplier.email && (
                            <div className={`text-xs ${isLight ? 'text-gray-500' : 'text-zinc-400'
                              }`}>
                              {supplier.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {supplier.phoneNumber && (
                          <div className={`flex items-center gap-1.5 text-sm ${isLight ? 'text-gray-600' : 'text-zinc-400'
                            }`}>
                            <Phone className="h-3.5 w-3.5" />
                            {supplier.phoneNumber}
                          </div>
                        )}
                        {supplier.address && (
                          <div className={`flex items-start gap-1.5 text-xs max-w-xs ${isLight ? 'text-gray-500' : 'text-zinc-500'
                            }`}>
                            <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{supplier.address}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${isLight ? 'text-gray-600' : 'text-zinc-400'
                        }`}>
                        {supplier.latitude && supplier.longitude ? (
                          <div className="flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5" />
                            <span>
                              {parseFloat(supplier.latitude).toFixed(4)}, {parseFloat(supplier.longitude).toFixed(4)}
                            </span>
                          </div>
                        ) : (
                          <span className="italic">Chưa có</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center gap-2 text-sm ${isLight ? 'text-gray-600' : 'text-zinc-400'
                        }`}>
                        <Calendar className="h-4 w-4" />
                        {formatDate(supplier.createdDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => openDetail(supplier)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${isLight
                          ? 'text-blue-600 hover:bg-blue-50'
                          : 'text-cyan-400 hover:bg-blue-900/40'
                          }`}
                      >
                        <Eye className="h-4 w-4" />
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className={`px-6 py-4 border-t flex items-center justify-between ${isLight ? 'border-gray-200' : 'border-zinc-800'
              }`}>
              <div className={`text-sm ${isLight ? 'text-gray-600' : 'text-zinc-400'
                }`}>
                Hiển thị {((pagination.page - 1) * pagination.size) + 1} đến{' '}
                {Math.min(pagination.page * pagination.size, pagination.total)} trong tổng số{' '}
                {pagination.total} nhà cung cấp
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors disabled:opacity-50 ${isLight
                    ? 'text-gray-600 hover:bg-gray-100 disabled:hover:bg-transparent'
                    : 'text-zinc-400 hover:bg-zinc-800/50 disabled:hover:bg-transparent'
                    }`}
                >
                  Trước
                </button>
                <span className={`px-3 py-1 text-sm ${isLight ? 'text-gray-900' : 'text-white'
                  }`}>
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors disabled:opacity-50 ${isLight
                    ? 'text-gray-600 hover:bg-gray-100 disabled:hover:bg-transparent'
                    : 'text-zinc-400 hover:bg-zinc-800/50 disabled:hover:bg-transparent'
                    }`}
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && suppliers.length === 0 && (
        <div className={`rounded-lg border p-12 text-center ${isLight
          ? 'border-gray-200 bg-white'
          : 'border-zinc-800 bg-zinc-900'
          }`}>
          <Package className={`h-12 w-12 mx-auto mb-4 ${isLight ? 'text-gray-400' : 'text-zinc-600'
            }`} />
          <h3 className={`text-lg font-medium mb-2 ${isLight ? 'text-gray-900' : 'text-white'
            }`}>
            Không tìm thấy nhà cung cấp nào
          </h3>
          <p className={isLight ? 'text-gray-600' : 'text-zinc-400'}>
            {searchName ? 'Thử tìm kiếm với từ khóa khác' : 'Chưa có nhà cung cấp nào trong hệ thống'}
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {detailOpen && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={closeDetail}></div>
          <div className={`relative w-full max-w-3xl rounded-lg ${isLight ? 'bg-white' : 'bg-zinc-900'} border ${isLight ? 'border-gray-200' : 'border-zinc-800'
            } max-h-[90vh] overflow-y-auto`}>
            {/* Header */}
            <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${isLight ? 'border-gray-200 bg-white' : 'border-zinc-800 bg-zinc-900'
              }`}>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${isLight ? 'bg-cyan-100' : 'bg-cyan-900/40'
                  }`}>
                  <Package className={`h-6 w-6 ${isLight ? 'text-cyan-600' : 'text-cyan-400'
                    }`} />
                </div>
                <div>
                  <h2 className={`text-xl font-semibold ${isLight ? 'text-gray-900' : 'text-white'
                    }`}>
                    {selectedSupplier.name || 'Chưa có tên'}
                  </h2>
                  {selectedSupplier.username && (
                    <p className={`text-sm mt-0.5 ${isLight ? 'text-gray-500' : 'text-zinc-400'
                      }`}>
                      @{selectedSupplier.username}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={closeDetail}
                className={`p-2 rounded-lg transition-colors ${isLight
                  ? 'text-gray-500 hover:bg-gray-100'
                  : 'text-zinc-400 hover:bg-zinc-800'
                  }`}
              >
                <span className="text-xl">×</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Owner Info */}
              <div className={`p-4 rounded-lg border ${isLight ? 'border-gray-200 bg-gray-50' : 'border-zinc-800 bg-zinc-800/50'
                }`}>
                <div className="flex items-center gap-2 mb-3">
                  <User className={`h-5 w-5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'
                    }`} />
                  <h3 className={`font-semibold ${isLight ? 'text-gray-900' : 'text-white'
                    }`}>
                    Thông tin chủ sở hữu
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    {selectedSupplier.avatarUrl ? (
                      <img
                        src={selectedSupplier.avatarUrl}
                        alt={selectedSupplier.fullName || 'User'}
                        className="h-12 w-12 rounded-full object-cover border-2"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center border-2 ${selectedSupplier.avatarUrl ? 'hidden' : 'flex'
                        } ${isLight
                          ? 'bg-cyan-100 border-cyan-300 text-cyan-700'
                          : 'bg-cyan-900/40 border-cyan-700 text-cyan-300'
                        }`}
                    >
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <div className={`font-medium ${isLight ? 'text-gray-900' : 'text-white'
                        }`}>
                        {selectedSupplier.fullName || 'N/A'}
                      </div>
                      {selectedSupplier.email && (
                        <div className={`text-sm ${isLight ? 'text-gray-500' : 'text-zinc-400'
                          }`}>
                          {selectedSupplier.email}
                        </div>
                      )}
                    </div>
                  </div>
                  {selectedSupplier.phoneNumber && (
                    <div>
                      <div className={`text-sm mb-1 ${isLight ? 'text-gray-500' : 'text-zinc-400'
                        }`}>
                        Số điện thoại
                      </div>
                      <div className={`flex items-center gap-2 ${isLight ? 'text-gray-900' : 'text-white'
                        }`}>
                        <Phone className="h-4 w-4" />
                        {selectedSupplier.phoneNumber}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              {selectedSupplier.address && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className={`h-5 w-5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'
                      }`} />
                    <h3 className={`font-semibold ${isLight ? 'text-gray-900' : 'text-white'
                      }`}>
                      Địa chỉ
                    </h3>
                  </div>
                  <div className={`p-4 rounded-lg border ${isLight ? 'border-gray-200 bg-gray-50' : 'border-zinc-800 bg-zinc-800/50'
                    }`}>
                    <p className={`whitespace-pre-wrap ${isLight ? 'text-gray-700' : 'text-zinc-300'
                      }`}>
                      {selectedSupplier.address}
                    </p>
                  </div>
                </div>
              )}

              {/* Location */}
              {(selectedSupplier.latitude && selectedSupplier.longitude) && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className={`h-5 w-5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'
                      }`} />
                    <h3 className={`font-semibold ${isLight ? 'text-gray-900' : 'text-white'
                      }`}>
                      Tọa độ
                    </h3>
                  </div>
                  <div className={`p-4 rounded-lg border ${isLight ? 'border-gray-200 bg-gray-50' : 'border-zinc-800 bg-zinc-800/50'
                    }`}>
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 text-sm ${isLight ? 'text-gray-700' : 'text-zinc-300'
                      }`}>
                      <div>
                        <span className={isLight ? 'text-gray-500' : 'text-zinc-400'}>Vĩ độ:</span>{' '}
                        {selectedSupplier.latitude}
                      </div>
                      <div>
                        <span className={isLight ? 'text-gray-500' : 'text-zinc-400'}>Kinh độ:</span>{' '}
                        {selectedSupplier.longitude}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className={`p-4 rounded-lg border ${isLight ? 'border-gray-200 bg-gray-50' : 'border-zinc-800 bg-zinc-800/50'
                }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className={`h-5 w-5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'
                    }`} />
                  <h3 className={`font-semibold ${isLight ? 'text-gray-900' : 'text-white'
                    }`}>
                    Thông tin thời gian
                  </h3>
                </div>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 text-sm ${isLight ? 'text-gray-700' : 'text-zinc-300'
                  }`}>
                  {selectedSupplier.createdDate && (
                    <div>
                      <span className={isLight ? 'text-gray-500' : 'text-zinc-400'}>Ngày tạo:</span>
                      <div className="font-medium mt-0.5">
                        {formatDate(selectedSupplier.createdDate)}
                      </div>
                    </div>
                  )}
                  {selectedSupplier.lastModifiedDate && (
                    <div>
                      <span className={isLight ? 'text-gray-500' : 'text-zinc-400'}>Cập nhật lần cuối:</span>
                      <div className="font-medium mt-0.5">
                        {formatDate(selectedSupplier.lastModifiedDate)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`sticky bottom-0 flex items-center justify-between gap-3 p-6 border-t ${isLight ? 'border-gray-200 bg-white' : 'border-zinc-800 bg-zinc-900'
              }`}>
              <button
                onClick={() => openRevenue(selectedSupplier)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isLight
                  ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                  : 'bg-cyan-600 text-white hover:bg-cyan-700'
                  }`}
              >
                <DollarSign className="h-4 w-4" />
                Tạo đơn doanh thu
              </button>
              <button
                onClick={closeDetail}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isLight
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Modal */}
      {revenueOpen && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={closeRevenue}></div>
          <div className={`relative w-full max-w-2xl rounded-lg ${isLight ? 'bg-white' : 'bg-zinc-900'} border ${isLight ? 'border-gray-200' : 'border-zinc-800'
            } max-h-[90vh] overflow-y-auto`}>
            {/* Header */}
            <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${isLight ? 'border-gray-200 bg-white' : 'border-zinc-800 bg-zinc-900'
              }`}>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${isLight ? 'bg-cyan-100' : 'bg-cyan-900/40'
                  }`}>
                  <DollarSign className={`h-6 w-6 ${isLight ? 'text-cyan-600' : 'text-cyan-400'
                    }`} />
                </div>
                <div>
                  <h2 className={`text-xl font-semibold ${isLight ? 'text-gray-900' : 'text-white'
                    }`}>
                    Tạo đơn doanh thu
                  </h2>
                  <p className={`text-sm mt-0.5 ${isLight ? 'text-gray-500' : 'text-zinc-400'
                    }`}>
                    {selectedSupplier.name || 'Chưa có tên'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeRevenue}
                className={`p-2 rounded-lg transition-colors ${isLight
                  ? 'text-gray-500 hover:bg-gray-100'
                  : 'text-zinc-400 hover:bg-zinc-800'
                  }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {!revenueSuccess ? (
                <>
                  {revenueError && (
                    <div className={`mb-4 p-3 rounded-lg ${isLight
                      ? 'border-red-200 bg-red-50 text-red-800'
                      : 'border-red-800 bg-red-900/20 text-red-400'
                      }`}>
                      {revenueError}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`text-sm font-medium mb-2 block ${isLight ? 'text-gray-700' : 'text-zinc-300'
                          }`}>
                          Ngày bắt đầu <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={revenueForm.startDate}
                          onChange={handleRevenueChange}
                          className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${isLight
                            ? 'border-gray-300 bg-white text-gray-900 focus:border-cyan-500 focus:ring-cyan-500/20'
                            : 'border-blue-800/60 bg-blue-900/40 text-slate-100 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                            }`}
                        />
                        <p className={`text-xs mt-1 ${isLight ? 'text-gray-500' : 'text-zinc-400'}`}>
                          Tự động điều chỉnh đến ngày 1 của tháng
                        </p>
                      </div>

                      <div>
                        <label className={`text-sm font-medium mb-2 block ${isLight ? 'text-gray-700' : 'text-zinc-300'
                          }`}>
                          Ngày kết thúc <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={revenueForm.endDate}
                          onChange={handleRevenueChange}
                          min={revenueForm.startDate}
                          className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${isLight
                            ? 'border-gray-300 bg-white text-gray-900 focus:border-cyan-500 focus:ring-cyan-500/20'
                            : 'border-blue-800/60 bg-blue-900/40 text-slate-100 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                            }`}
                        />
                        <p className={`text-xs mt-1 ${isLight ? 'text-gray-500' : 'text-zinc-400'}`}>
                          Tự động điều chỉnh đến ngày cuối cùng của tháng
                        </p>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg border ${isLight ? 'border-blue-200 bg-blue-50' : 'border-blue-800/50 bg-blue-900/30'
                      }`}>
                      <p className={`text-sm ${isLight ? 'text-blue-800' : 'text-blue-200'
                        }`}>
                        <strong>Lưu ý:</strong> Sau khi tạo đơn doanh thu, hệ thống sẽ tạo QR code để thanh toán.
                        Vui lòng chọn đúng khoảng thời gian cần tính doanh thu.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isLight ? 'bg-cyan-100' : 'bg-cyan-900/40'
                    }`}>
                    <QrCode className={`h-8 w-8 ${isLight ? 'text-cyan-600' : 'text-cyan-400'
                      }`} />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${isLight ? 'text-gray-900' : 'text-white'
                    }`}>
                    Tạo đơn doanh thu thành công!
                  </h3>
                  <p className={`text-sm mb-6 ${isLight ? 'text-gray-600' : 'text-zinc-400'
                    }`}>
                    Quét QR code bên dưới để thanh toán
                  </p>

                  {qrCodeUrl && (
                    <div className="flex flex-col items-center gap-4">
                      <div className={`p-4 rounded-lg border ${isLight ? 'border-gray-200 bg-white' : 'border-zinc-700 bg-zinc-800/50'
                        }`}>
                        <img
                          src={qrCodeUrl}
                          alt="QR Code Thanh toán"
                          className="w-64 h-64 object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'block'
                          }}
                        />
                        <p className={`text-xs mt-2 text-center ${isLight ? 'text-gray-500' : 'text-zinc-400'
                          }`} style={{ display: 'none' }}>
                          Không thể tải QR code
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <a
                          href={qrCodeUrl}
                          download="qr-code-payment.png"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isLight
                            ? 'bg-gray-600 text-white hover:bg-gray-700'
                            : 'bg-zinc-700 text-white hover:bg-zinc-600'
                            }`}
                        >
                          <Download className="h-4 w-4" />
                          Tải QR Code
                        </a>
                        <button
                          onClick={() => window.open(qrCodeUrl, '_blank')}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isLight
                            ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                            : 'bg-cyan-600 text-white hover:bg-cyan-700'
                            }`}
                        >
                          <QrCode className="h-4 w-4" />
                          Mở trong tab mới
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`sticky bottom-0 flex items-center justify-end gap-3 p-6 border-t ${isLight ? 'border-gray-200 bg-white' : 'border-zinc-800 bg-zinc-900'
              }`}>
              {!revenueSuccess ? (
                <>
                  <button
                    onClick={closeRevenue}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${isLight
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-zinc-300 hover:bg-zinc-800'
                      }`}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={createRevenue}
                    disabled={creatingRevenue}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${isLight
                      ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                      : 'bg-cyan-600 text-white hover:bg-cyan-700'
                      }`}
                  >
                    {creatingRevenue ? 'Đang tạo...' : 'Tạo đơn doanh thu'}
                  </button>
                </>
              ) : (
                <button
                  onClick={closeRevenue}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${isLight
                    ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                    : 'bg-cyan-600 text-white hover:bg-cyan-700'
                    }`}
                >
                  Đóng
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

