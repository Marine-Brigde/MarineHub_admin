import React, { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { portApi } from '../api/portApi'
import { Search, Plus, Edit, Trash2, MapPin, Calendar, Globe, X } from 'lucide-react'
import MapComponent from '../components/map/GoongMap'

export default function PortsPage() {
  const { isLight } = useTheme()
  const [ports, setPorts] = useState([])
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
  const [isAsc, setIsAsc] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingPort, setEditingPort] = useState(null)
  const [createForm, setCreateForm] = useState({
    name: '',
    country: '',
    city: '',
    longitude: '',
    latitude: ''
  })
  const [editForm, setEditForm] = useState({
    name: '',
    country: '',
    city: '',
    longitude: '',
    latitude: ''
  })
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [showEditMap, setShowEditMap] = useState(false)

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

  const openCreate = () => {
    setCreateForm({
      name: '',
      country: '',
      city: '',
      longitude: '',
      latitude: ''
    })
    setError(null)
    setCreateOpen(true)
  }

  const closeCreate = () => {
    setCreateOpen(false)
    setShowMap(false)
    setCreateForm({
      name: '',
      country: '',
      city: '',
      longitude: '',
      latitude: ''
    })
  }

  const handleCreateChange = (e) => {
    const { name, value } = e.target
    setCreateForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCreate = async () => {
    // Validation
    if (!createForm.name.trim()) {
      setError('Vui lòng nhập tên cảng')
      return
    }
    if (!createForm.country.trim()) {
      setError('Vui lòng nhập quốc gia')
      return
    }
    if (!createForm.city.trim()) {
      setError('Vui lòng nhập thành phố')
      return
    }

    try {
      setCreating(true)
      setError(null)
      const payload = {
        name: createForm.name.trim(),
        country: createForm.country.trim(),
        city: createForm.city.trim(),
        longitude: createForm.longitude.trim() || null,
        latitude: createForm.latitude.trim() || null
      }
      
      const res = await portApi.createPort(payload)
      if (res.status === 201) {
        // Refresh list
        await fetchPorts()
        closeCreate()
        // Show success message
        setError(null)
      } else {
        setError(res.message || 'Tạo cảng thất bại')
      }
    } catch (err) {
      setError(err.message || 'Tạo cảng thất bại')
      console.error('Error creating port:', err)
    } finally {
      setCreating(false)
    }
  }

  const openEdit = (port) => {
    setEditingPort(port)
    setEditForm({
      name: port.name || '',
      country: port.country || '',
      city: port.city || '',
      longitude: port.longitude ?? '',
      latitude: port.latitude ?? ''
    })
    setEditOpen(true)
  }

  const closeEdit = () => {
    setEditOpen(false)
    setEditingPort(null)
    setShowEditMap(false)
    setError(null)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const saveEdit = async () => {
    if (!editingPort) return
    
    // Validation
    if (!editForm.name.trim()) {
      setError('Vui lòng nhập tên cảng')
      return
    }
    if (!editForm.country.trim()) {
      setError('Vui lòng nhập quốc gia')
      return
    }
    if (!editForm.city.trim()) {
      setError('Vui lòng nhập thành phố')
      return
    }

    try {
      setSaving(true)
      setError(null)
      const payload = {
        name: editForm.name.trim(),
        country: editForm.country.trim(),
        city: editForm.city.trim(),
        longitude: editForm.longitude.trim() || null,
        latitude: editForm.latitude.trim() || null
      }
      
      const res = await portApi.updatePort(editingPort.id, payload)
      if (res.status === 200) {
        // Refresh list
        await fetchPorts()
        closeEdit()
        setError(null)
      } else {
        setError(res.message || 'Cập nhật cảng thất bại')
      }
    } catch (err) {
      console.error('Error updating port:', err)
      setError(err.message || err.response?.data?.message || 'Cập nhật cảng thất bại')
    } finally {
      setSaving(false)
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
          <button 
            onClick={openCreate}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isLight
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-cyan-600 text-white hover:bg-cyan-700'
            }`}
          >
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
                        }`} onClick={() => openEdit(port)}>
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

      {/* Create Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeCreate}></div>
          <div className={`relative w-full max-w-2xl rounded-lg p-6 mx-4 max-h-[90vh] overflow-y-auto ${
            isLight ? 'bg-white border border-gray-200' : 'bg-zinc-900 border border-zinc-800'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-xl font-semibold ${
                  isLight ? 'text-gray-900' : 'text-white'
                }`}>
                  Thêm Cảng Mới
                </h3>
                <p className={`text-sm mt-1 ${
                  isLight ? 'text-gray-600' : 'text-zinc-400'
                }`}>
                  Điền thông tin cảng biển để thêm vào hệ thống
                </p>
              </div>
              <MapPin className={`h-8 w-8 ${
                isLight ? 'text-blue-600' : 'text-cyan-400'
              }`} />
            </div>

            {error && (
              <div className={`mb-4 p-3 rounded-lg ${
                isLight 
                  ? 'border-red-200 bg-red-50 text-red-800' 
                  : 'border-red-800 bg-red-900/20 text-red-400'
              }`}>
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={`text-sm font-medium mb-2 block ${
                  isLight ? 'text-gray-700' : 'text-zinc-300'
                }`}>
                  Tên cảng <span className="text-red-500">*</span>
                </label>
                <input 
                  name="name" 
                  value={createForm.name} 
                  onChange={handleCreateChange}
                  placeholder="VD: Cảng Sài Gòn, Cảng Hải Phòng..."
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    isLight 
                      ? 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                      : 'border-blue-800/60 bg-blue-900/40 text-slate-100 placeholder:text-blue-300/50 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                  }`}
                />
              </div>

              <div>
                <label className={`text-sm font-medium mb-2 block ${
                  isLight ? 'text-gray-700' : 'text-zinc-300'
                }`}>
                  Quốc gia <span className="text-red-500">*</span>
                </label>
                <input 
                  name="country" 
                  value={createForm.country} 
                  onChange={handleCreateChange}
                  placeholder="VD: Việt Nam"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    isLight 
                      ? 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                      : 'border-blue-800/60 bg-blue-900/40 text-slate-100 placeholder:text-blue-300/50 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                  }`}
                />
              </div>

              <div>
                <label className={`text-sm font-medium mb-2 block ${
                  isLight ? 'text-gray-700' : 'text-zinc-300'
                }`}>
                  Thành phố <span className="text-red-500">*</span>
                </label>
                <input 
                  name="city" 
                  value={createForm.city} 
                  onChange={handleCreateChange}
                  placeholder="VD: Hồ Chí Minh, Hải Phòng..."
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    isLight 
                      ? 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                      : 'border-blue-800/60 bg-blue-900/40 text-slate-100 placeholder:text-blue-300/50 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <div className={`p-4 rounded-lg mb-4 ${
                  isLight ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/30 border border-blue-800/50'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <Globe className={`h-5 w-5 mt-0.5 ${
                        isLight ? 'text-blue-600' : 'text-cyan-400'
                      }`} />
                      <div>
                        <p className={`text-sm font-medium mb-1 ${
                          isLight ? 'text-blue-900' : 'text-cyan-200'
                        }`}>
                          Tọa độ địa lý (Tùy chọn)
                        </p>
                        <p className={`text-xs ${
                          isLight ? 'text-blue-700' : 'text-blue-300/80'
                        }`}>
                          {showMap 
                            ? 'Nhấp vào bản đồ hoặc tìm kiếm địa chỉ để chọn vị trí' 
                            : 'Nhập tọa độ thủ công hoặc chọn trên bản đồ'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMap(!showMap)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                        isLight
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-cyan-600 text-white hover:bg-cyan-700'
                      }`}
                    >
                      {showMap ? 'Ẩn bản đồ' : 'Chọn trên bản đồ'}
                    </button>
                  </div>
                </div>
              </div>

              {showMap && (
                <div className="md:col-span-2 mb-4">
                  <div className={`rounded-lg border p-4 ${
                    isLight ? 'border-gray-200 bg-white' : 'border-blue-800/50 bg-blue-950/30'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`text-sm font-medium ${
                        isLight ? 'text-gray-900' : 'text-white'
                      }`}>
                        Chọn vị trí trên bản đồ
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowMap(false)}
                        className={`p-1 rounded-lg transition-colors ${
                          isLight 
                            ? 'text-gray-500 hover:bg-gray-100' 
                            : 'text-zinc-400 hover:bg-zinc-800'
                        }`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="h-[400px] rounded-lg overflow-hidden border border-gray-300 dark:border-blue-800/50">
                      <MapComponent 
                        onLocationSelect={(lat, lng, address) => {
                          setCreateForm(prev => ({
                            ...prev,
                            latitude: lat,
                            longitude: lng
                          }))
                          // Tự động điền thành phố nếu có thể từ address
                          if (address && !createForm.city) {
                            // Có thể parse address để lấy city nếu cần
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className={`text-sm font-medium mb-2 block ${
                  isLight ? 'text-gray-700' : 'text-zinc-300'
                }`}>
                  Vĩ độ (Latitude)
                </label>
                <input 
                  name="latitude" 
                  type="number"
                  step="any"
                  value={createForm.latitude} 
                  onChange={handleCreateChange}
                  placeholder="VD: 10.762622"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    isLight 
                      ? 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                      : 'border-blue-800/60 bg-blue-900/40 text-slate-100 placeholder:text-blue-300/50 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                  }`}
                />
              </div>

              <div>
                <label className={`text-sm font-medium mb-2 block ${
                  isLight ? 'text-gray-700' : 'text-zinc-300'
                }`}>
                  Kinh độ (Longitude)
                </label>
                <input 
                  name="longitude" 
                  type="number"
                  step="any"
                  value={createForm.longitude} 
                  onChange={handleCreateChange}
                  placeholder="VD: 106.660172"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    isLight 
                      ? 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                      : 'border-blue-800/60 bg-blue-900/40 text-slate-100 placeholder:text-blue-300/50 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                  }`}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-zinc-800">
              <button 
                onClick={closeCreate}
                disabled={creating}
                className={`px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                  isLight 
                    ? 'text-gray-700 hover:bg-gray-100' 
                    : 'text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                Hủy
              </button>
              <button 
                onClick={handleCreate}
                disabled={creating || !createForm.name.trim() || !createForm.country.trim() || !createForm.city.trim()}
                className={`px-5 py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLight 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-cyan-600 text-white hover:bg-cyan-700'
                }`}
              >
                {creating ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang tạo...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Tạo Cảng
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeEdit}></div>
          <div className={`relative w-full max-w-2xl rounded-lg p-6 mx-4 max-h-[90vh] overflow-y-auto ${
            isLight ? 'bg-white border border-gray-200' : 'bg-zinc-900 border border-zinc-800'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-xl font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                  Chỉnh sửa cảng
                </h3>
                <p className={`text-sm mt-1 ${isLight ? 'text-gray-600' : 'text-zinc-400'}`}>
                  Cập nhật thông tin cảng biển
                </p>
              </div>
              <MapPin className={`h-8 w-8 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
            </div>

            {error && (
              <div className={`mb-4 p-3 rounded-lg ${
                isLight 
                  ? 'border-red-200 bg-red-50 text-red-800' 
                  : 'border-red-800 bg-red-900/20 text-red-400'
              }`}>
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={`text-sm font-medium mb-2 block ${isLight ? 'text-gray-700' : 'text-zinc-300'}`}>
                  Tên cảng <span className="text-red-500">*</span>
                </label>
                <input 
                  name="name" 
                  value={editForm.name} 
                  onChange={handleEditChange}
                  placeholder="VD: Cảng Sài Gòn, Cảng Hải Phòng..."
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    isLight 
                      ? 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                      : 'border-blue-800/60 bg-blue-900/40 text-slate-100 placeholder:text-blue-300/50 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                  }`} 
                />
              </div>
              <div>
                <label className={`text-sm font-medium mb-2 block ${isLight ? 'text-gray-700' : 'text-zinc-300'}`}>
                  Quốc gia <span className="text-red-500">*</span>
                </label>
                <input 
                  name="country" 
                  value={editForm.country} 
                  onChange={handleEditChange}
                  placeholder="VD: Việt Nam"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    isLight 
                      ? 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                      : 'border-blue-800/60 bg-blue-900/40 text-slate-100 placeholder:text-blue-300/50 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                  }`} 
                />
              </div>
              <div>
                <label className={`text-sm font-medium mb-2 block ${isLight ? 'text-gray-700' : 'text-zinc-300'}`}>
                  Thành phố <span className="text-red-500">*</span>
                </label>
                <input 
                  name="city" 
                  value={editForm.city} 
                  onChange={handleEditChange}
                  placeholder="VD: Hồ Chí Minh, Hải Phòng..."
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    isLight 
                      ? 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                      : 'border-blue-800/60 bg-blue-900/40 text-slate-100 placeholder:text-blue-300/50 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                  }`} 
                />
              </div>

              <div className="md:col-span-2">
                <div className={`p-4 rounded-lg mb-4 ${
                  isLight ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/30 border border-blue-800/50'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <Globe className={`h-5 w-5 mt-0.5 ${
                        isLight ? 'text-blue-600' : 'text-cyan-400'
                      }`} />
                      <div>
                        <p className={`text-sm font-medium mb-1 ${
                          isLight ? 'text-blue-900' : 'text-cyan-200'
                        }`}>
                          Tọa độ địa lý (Tùy chọn)
                        </p>
                        <p className={`text-xs ${
                          isLight ? 'text-blue-700' : 'text-blue-300/80'
                        }`}>
                          {showEditMap 
                            ? 'Nhấp vào bản đồ hoặc tìm kiếm địa chỉ để chọn vị trí' 
                            : 'Nhập tọa độ thủ công hoặc chọn trên bản đồ'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowEditMap(!showEditMap)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                        isLight
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-cyan-600 text-white hover:bg-cyan-700'
                      }`}
                    >
                      {showEditMap ? 'Ẩn bản đồ' : 'Chọn trên bản đồ'}
                    </button>
                  </div>
                </div>
              </div>

              {showEditMap && (
                <div className="md:col-span-2 mb-4">
                  <div className={`rounded-lg border p-4 ${
                    isLight ? 'border-gray-200 bg-white' : 'border-blue-800/50 bg-blue-950/30'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`text-sm font-medium ${
                        isLight ? 'text-gray-900' : 'text-white'
                      }`}>
                        Chọn vị trí trên bản đồ
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowEditMap(false)}
                        className={`p-1 rounded-lg transition-colors ${
                          isLight 
                            ? 'text-gray-500 hover:bg-gray-100' 
                            : 'text-zinc-400 hover:bg-zinc-800'
                        }`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="h-[400px] rounded-lg overflow-hidden border border-gray-300 dark:border-blue-800/50">
                      <MapComponent 
                        onLocationSelect={(lat, lng, address) => {
                          setEditForm(prev => ({
                            ...prev,
                            latitude: lat,
                            longitude: lng
                          }))
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className={`text-sm font-medium mb-2 block ${isLight ? 'text-gray-700' : 'text-zinc-300'}`}>
                  Vĩ độ (Latitude)
                </label>
                <input 
                  name="latitude" 
                  type="number"
                  step="any"
                  value={editForm.latitude} 
                  onChange={handleEditChange}
                  placeholder="VD: 10.762622"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    isLight 
                      ? 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                      : 'border-blue-800/60 bg-blue-900/40 text-slate-100 placeholder:text-blue-300/50 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                  }`} 
                />
              </div>
              <div>
                <label className={`text-sm font-medium mb-2 block ${isLight ? 'text-gray-700' : 'text-zinc-300'}`}>
                  Kinh độ (Longitude)
                </label>
                <input 
                  name="longitude" 
                  type="number"
                  step="any"
                  value={editForm.longitude} 
                  onChange={handleEditChange}
                  placeholder="VD: 106.660172"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    isLight 
                      ? 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                      : 'border-blue-800/60 bg-blue-900/40 text-slate-100 placeholder:text-blue-300/50 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                  }`} 
                />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-zinc-800">
              <button 
                onClick={closeEdit}
                disabled={saving}
                className={`px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                  isLight 
                    ? 'text-gray-700 hover:bg-gray-100' 
                    : 'text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                Hủy
              </button>
              <button 
                onClick={saveEdit} 
                disabled={saving || !editForm.name.trim() || !editForm.country.trim() || !editForm.city.trim()} 
                className={`px-5 py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLight 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-cyan-600 text-white hover:bg-cyan-700'
                }`}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang lưu...
                  </span>
                ) : (
                  'Lưu thay đổi'
                )}
              </button>
            </div>
          </div>
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
