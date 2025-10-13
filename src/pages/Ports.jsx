import React, { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { portApi } from '../api/portApi'
import { Search, Plus, Edit, Trash2, MapPin, Calendar, Globe } from 'lucide-react'

export default function PortsPage() {
  const { isLight } = useTheme()
  const [ports, setPorts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    size: 30,
    total: 0,
    totalPages: 0
  })
  const [searchName, setSearchName] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [isAsc, setIsAsc] = useState(true)

  const fetchPorts = async () => {
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

      const response = await portApi.getPorts(params)
      
      if (response.status === 200) {
        setPorts(response.data.items || [])
        setPagination(prev => ({
          ...prev,
          total: response.data.total,
          totalPages: response.data.totalPages
        }))
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tải danh sách ports')
      console.error('Error fetching ports:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPorts()
  }, [pagination.page, pagination.size, sortBy, isAsc, searchName])

  const handleSearch = (e) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchPorts()
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setIsAsc(!isAsc)
    } else {
      setSortBy(field)
      setIsAsc(true)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-semibold mb-2 ${
          isLight ? 'text-gray-900' : 'text-white'
        }`}>Quản lý Cảng</h1>
        <p className={isLight ? 'text-gray-600' : 'text-zinc-400'}>
          Quản lý danh sách các cảng biển trong hệ thống
        </p>
      </div>

      {/* Search and Controls */}
      <div className={`rounded-lg border p-6 mb-6 ${
        isLight 
          ? 'border-gray-200 bg-white' 
          : 'border-zinc-800 bg-zinc-900'
      }`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                isLight ? 'text-gray-500' : 'text-blue-300/70'
              }`} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên cảng..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-1 ${
                  isLight
                    ? 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/40'
                    : 'border-blue-800/60 bg-blue-900/40 text-slate-100 placeholder:text-blue-300/60 focus:border-cyan-500/50 focus:ring-cyan-500/40'
                }`}
              />
            </div>
          </form>

          {/* Add Button */}
          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isLight
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-cyan-600 text-white hover:bg-cyan-700'
          }`}>
            <Plus className="h-4 w-4" />
            Thêm Cảng
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
            isLight ? 'border-blue-600' : 'border-cyan-400'
          }`}></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className={`rounded-lg border p-4 mb-6 ${
          isLight 
            ? 'border-red-200 bg-red-50 text-red-800' 
            : 'border-red-800 bg-red-900/20 text-red-400'
        }`}>
          {error}
        </div>
      )}

      {/* Ports Table */}
      {!loading && !error && (
        <div className={`rounded-lg border ${
          isLight 
            ? 'border-gray-200 bg-white' 
            : 'border-zinc-800 bg-zinc-900'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b ${
                isLight ? 'border-gray-200' : 'border-zinc-800'
              }`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isLight ? 'text-gray-500' : 'text-zinc-400'
                  }`}>
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1 hover:underline"
                    >
                      Tên Cảng
                      {sortBy === 'name' && (
                        <span className={isAsc ? 'rotate-180' : ''}>↑</span>
                      )}
                    </button>
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isLight ? 'text-gray-500' : 'text-zinc-400'
                  }`}>
                    <button
                      onClick={() => handleSort('country')}
                      className="flex items-center gap-1 hover:underline"
                    >
                      Quốc gia
                      {sortBy === 'country' && (
                        <span className={isAsc ? 'rotate-180' : ''}>↑</span>
                      )}
                    </button>
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isLight ? 'text-gray-500' : 'text-zinc-400'
                  }`}>
                    <button
                      onClick={() => handleSort('city')}
                      className="flex items-center gap-1 hover:underline"
                    >
                      Thành phố
                      {sortBy === 'city' && (
                        <span className={isAsc ? 'rotate-180' : ''}>↑</span>
                      )}
                    </button>
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isLight ? 'text-gray-500' : 'text-zinc-400'
                  }`}>
                    Tọa độ
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isLight ? 'text-gray-500' : 'text-zinc-400'
                  }`}>
                    <button
                      onClick={() => handleSort('createdDate')}
                      className="flex items-center gap-1 hover:underline"
                    >
                      Ngày tạo
                      {sortBy === 'createdDate' && (
                        <span className={isAsc ? 'rotate-180' : ''}>↑</span>
                      )}
                    </button>
                  </th>
                  <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                    isLight ? 'text-gray-500' : 'text-zinc-400'
                  }`}>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isLight ? 'divide-gray-200' : 'divide-zinc-800'
              }`}>
                {ports.map((port) => (
                  <tr key={port.id} className={`hover:bg-opacity-50 ${
                    isLight ? 'hover:bg-gray-50' : 'hover:bg-zinc-800/50'
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`font-medium ${
                        isLight ? 'text-gray-900' : 'text-white'
                      }`}>
                        {port.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center gap-2 ${
                        isLight ? 'text-gray-600' : 'text-zinc-400'
                      }`}>
                        <Globe className="h-4 w-4" />
                        {port.country}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center gap-2 ${
                        isLight ? 'text-gray-600' : 'text-zinc-400'
                      }`}>
                        <MapPin className="h-4 w-4" />
                        {port.city}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${
                        isLight ? 'text-gray-600' : 'text-zinc-400'
                      }`}>
                        {port.latitude && port.longitude ? (
                          <span>
                            {parseFloat(port.latitude).toFixed(4)}, {parseFloat(port.longitude).toFixed(4)}
                          </span>
                        ) : (
                          <span className="italic">Chưa có</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center gap-2 text-sm ${
                        isLight ? 'text-gray-600' : 'text-zinc-400'
                      }`}>
                        <Calendar className="h-4 w-4" />
                        {formatDate(port.createdDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className={`p-2 rounded-lg transition-colors ${
                          isLight
                            ? 'text-blue-600 hover:bg-blue-50'
                            : 'text-cyan-400 hover:bg-blue-900/40'
                        }`}>
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className={`p-2 rounded-lg transition-colors ${
                          isLight
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-red-400 hover:bg-red-900/40'
                        }`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className={`px-6 py-4 border-t flex items-center justify-between ${
              isLight ? 'border-gray-200' : 'border-zinc-800'
            }`}>
              <div className={`text-sm ${
                isLight ? 'text-gray-600' : 'text-zinc-400'
              }`}>
                Hiển thị {((pagination.page - 1) * pagination.size) + 1} đến{' '}
                {Math.min(pagination.page * pagination.size, pagination.total)} trong tổng số{' '}
                {pagination.total} kết quả
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors disabled:opacity-50 ${
                    isLight
                      ? 'text-gray-600 hover:bg-gray-100 disabled:hover:bg-transparent'
                      : 'text-zinc-400 hover:bg-zinc-800/50 disabled:hover:bg-transparent'
                  }`}
                >
                  Trước
                </button>
                <span className={`px-3 py-1 text-sm ${
                  isLight ? 'text-gray-900' : 'text-white'
                }`}>
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors disabled:opacity-50 ${
                    isLight
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
      {!loading && !error && ports.length === 0 && (
        <div className={`rounded-lg border p-12 text-center ${
          isLight 
            ? 'border-gray-200 bg-white' 
            : 'border-zinc-800 bg-zinc-900'
        }`}>
          <MapPin className={`h-12 w-12 mx-auto mb-4 ${
            isLight ? 'text-gray-400' : 'text-zinc-600'
          }`} />
          <h3 className={`text-lg font-medium mb-2 ${
            isLight ? 'text-gray-900' : 'text-white'
          }`}>
            Không tìm thấy cảng nào
          </h3>
          <p className={isLight ? 'text-gray-600' : 'text-zinc-400'}>
            {searchName ? 'Thử tìm kiếm với từ khóa khác' : 'Chưa có cảng nào trong hệ thống'}
          </p>
        </div>
      )}
    </div>
  )
}
