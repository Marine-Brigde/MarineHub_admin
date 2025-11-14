import React, { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { incidentApi } from '../api/incidentApi'
import { 
  Search, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Filter,
  Eye,
  Ship,
  MapPin,
  Calendar,
  FileText,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

const SEVERITY_COLORS = {
  CRITICAL: { 
    bg: 'bg-red-900/30', 
    border: 'border-red-500', 
    text: 'text-red-400',
    dot: 'bg-red-500',
    label: 'Nghiêm trọng'
  },
  HIGH: { 
    bg: 'bg-orange-900/30', 
    border: 'border-orange-500', 
    text: 'text-orange-400',
    dot: 'bg-orange-500',
    label: 'Cao'
  },
  MEDIUM: { 
    bg: 'bg-yellow-900/30', 
    border: 'border-yellow-500', 
    text: 'text-yellow-400',
    dot: 'bg-yellow-500',
    label: 'Trung bình'
  },
  LOW: { 
    bg: 'bg-blue-900/30', 
    border: 'border-blue-500', 
    text: 'text-blue-400',
    dot: 'bg-blue-500',
    label: 'Thấp'
  }
}

const STATUS_COLORS = {
  PENDING: { 
    bg: 'bg-yellow-900/30', 
    text: 'text-yellow-400',
    icon: Clock,
    label: 'Chờ xử lý'
  },
  IN_PROGRESS: { 
    bg: 'bg-blue-900/30', 
    text: 'text-blue-400',
    icon: AlertTriangle,
    label: 'Đang xử lý'
  },
  RESOLVED: { 
    bg: 'bg-green-900/30', 
    text: 'text-green-400',
    icon: CheckCircle,
    label: 'Đã giải quyết'
  },
  CLOSED: { 
    bg: 'bg-gray-900/30', 
    text: 'text-gray-400',
    icon: XCircle,
    label: 'Đã đóng'
  }
}

export default function IncidentReports() {
  const { isLight } = useTheme()
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    size: 30,
    total: 0,
    totalPages: 0
  })
  
  // Filters
  const [filters, setFilters] = useState({
    shipName: '',
    status: '',
    severity: '',
    startDate: '',
    endDate: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('createdDate')
  const [isAsc, setIsAsc] = useState(false)
  
  // Detail modal
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)

  // Fetch incidents
  const fetchIncidents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = {
        page: pagination.page,
        size: pagination.size,
        sortBy,
        isAsc,
        ...filters
      }

      const response = await incidentApi.getIncidents(params)
      
      if (response.status === 200) {
        setIncidents(response.data.items || [])
        setPagination(prev => ({
          ...prev,
          total: response.data.total,
          totalPages: response.data.totalPages
        }))
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tải danh sách đơn khiếu nại')
      console.error('Error fetching incidents:', err)
      // Mock data for development
      setIncidents([
        {
          id: '1',
          shipName: 'MV Hải Phong 01',
          severity: 'CRITICAL',
          status: 'PENDING',
          title: 'Khiếu nại về động cơ chính',
          description: 'Động cơ chính bị tắt đột ngột khi đang di chuyển. Cần kiểm tra ngay lập tức.',
          location: { latitude: 10.762622, longitude: 106.660172 },
          reportedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          reportedBy: 'Thuyền trưởng Nguyễn Văn A'
        },
        {
          id: '2',
          shipName: 'MV Vũng Tàu 05',
          severity: 'HIGH',
          status: 'IN_PROGRESS',
          title: 'Khiếu nại về rò rỉ nhiên liệu',
          description: 'Phát hiện rò rỉ nhỏ ở bể nhiên liệu. Đã áp dụng biện pháp xử lý tạm thời.',
          location: { latitude: 10.3460, longitude: 107.0843 },
          reportedAt: new Date(Date.now() - 3600000).toISOString(),
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          reportedBy: 'Kỹ sư Trần Văn B'
        },
        {
          id: '3',
          shipName: 'MV Sài Gòn 12',
          severity: 'MEDIUM',
          status: 'RESOLVED',
          title: 'Khiếu nại về hệ thống định vị GPS',
          description: 'GPS bị mất tín hiệu trong 15 phút. Đã khôi phục và hoạt động bình thường.',
          location: { latitude: 10.8231, longitude: 106.6297 },
          reportedAt: new Date(Date.now() - 86400000).toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          reportedBy: 'Sĩ quan Lê Văn C'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncidents()
  }, [pagination.page, pagination.size, sortBy, isAsc])

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleApplyFilters = () => {
    fetchIncidents()
  }

  const handleResetFilters = () => {
    setFilters({
      shipName: '',
      status: '',
      severity: '',
      startDate: '',
      endDate: ''
    })
    setPagination(prev => ({ ...prev, page: 1 }))
    setTimeout(() => fetchIncidents(), 100)
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setIsAsc(!isAsc)
    } else {
      setSortBy(field)
      setIsAsc(false)
    }
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const openDetail = (incident) => {
    setSelectedIncident(incident)
    setDetailOpen(true)
  }

  const closeDetail = () => {
    setDetailOpen(false)
    setSelectedIncident(null)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
  }

  const SeverityBadge = ({ severity }) => {
    const config = SEVERITY_COLORS[severity] || SEVERITY_COLORS.LOW
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.border} ${config.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
        {config.label}
      </span>
    )
  }

  const StatusBadge = ({ status }) => {
    const config = STATUS_COLORS[status] || STATUS_COLORS.PENDING
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-semibold mb-2 ${
          isLight ? 'text-gray-900' : 'text-white'
        }`}>Đơn Khiếu Nại Tàu</h1>
        <p className={isLight ? 'text-gray-600' : 'text-zinc-400'}>
          Quản lý và theo dõi các đơn khiếu nại từ tàu trong hệ thống
        </p>
      </div>

      {/* Filters and Search */}
      <div className={`rounded-lg border p-6 mb-6 ${
        isLight 
          ? 'border-gray-200 bg-white' 
          : 'border-zinc-800 bg-zinc-900'
      }`}>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search */}
          <form onSubmit={(e) => { e.preventDefault(); handleApplyFilters(); }} className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                isLight ? 'text-gray-500' : 'text-blue-300/70'
              }`} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên tàu..."
                value={filters.shipName}
                onChange={(e) => handleFilterChange('shipName', e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-1 ${
                  isLight
                    ? 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/40'
                    : 'border-blue-800/60 bg-blue-900/40 text-slate-100 placeholder:text-blue-300/60 focus:border-cyan-500/50 focus:ring-cyan-500/40'
                }`}
              />
            </div>
          </form>

          {/* Filter Toggle */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isLight
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-blue-900/40 text-blue-100 hover:bg-blue-900/60'
            }`}
          >
            <Filter className="h-4 w-4" />
            Bộ lọc
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t ${
            isLight ? 'border-gray-200' : 'border-zinc-800'
          }`}>
            {/* Status Filter */}
            <div>
              <label className={`text-sm mb-1 block ${isLight ? 'text-gray-700' : 'text-zinc-300'}`}>
                Trạng thái
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  isLight 
                    ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500/40'
                    : 'border-blue-800/60 bg-blue-900/40 text-slate-100 focus:border-cyan-500/50 focus:ring-cyan-500/40'
                }`}
              >
                <option value="">Tất cả</option>
                <option value="PENDING">Chờ xử lý</option>
                <option value="IN_PROGRESS">Đang xử lý</option>
                <option value="RESOLVED">Đã giải quyết</option>
                <option value="CLOSED">Đã đóng</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div>
              <label className={`text-sm mb-1 block ${isLight ? 'text-gray-700' : 'text-zinc-300'}`}>
                Mức độ
              </label>
              <select
                value={filters.severity}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  isLight 
                    ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500/40'
                    : 'border-blue-800/60 bg-blue-900/40 text-slate-100 focus:border-cyan-500/50 focus:ring-cyan-500/40'
                }`}
              >
                <option value="">Tất cả</option>
                <option value="CRITICAL">Nghiêm trọng</option>
                <option value="HIGH">Cao</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="LOW">Thấp</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className={`text-sm mb-1 block ${isLight ? 'text-gray-700' : 'text-zinc-300'}`}>
                Từ ngày
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  isLight 
                    ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500/40'
                    : 'border-blue-800/60 bg-blue-900/40 text-slate-100 focus:border-cyan-500/50 focus:ring-cyan-500/40'
                }`}
              />
            </div>

            {/* End Date */}
            <div>
              <label className={`text-sm mb-1 block ${isLight ? 'text-gray-700' : 'text-zinc-300'}`}>
                Đến ngày
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  isLight 
                    ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500/40'
                    : 'border-blue-800/60 bg-blue-900/40 text-slate-100 focus:border-cyan-500/50 focus:ring-cyan-500/40'
                }`}
              />
            </div>
          </div>
        )}

        {/* Filter Actions */}
        {showFilters && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
            <button 
              onClick={handleApplyFilters}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isLight
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-cyan-600 text-white hover:bg-cyan-700'
              }`}
            >
              Áp dụng
            </button>
            <button 
              onClick={handleResetFilters}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isLight
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-blue-900/40 text-blue-100 hover:bg-blue-900/60'
              }`}
            >
              Đặt lại
            </button>
          </div>
        )}
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

      {/* Incidents Table */}
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
                      onClick={() => handleSort('shipName')}
                      className="flex items-center gap-1 hover:underline"
                    >
                      Tên Tàu
                      {sortBy === 'shipName' && (
                        <span className={isAsc ? 'rotate-180' : ''}>↑</span>
                      )}
                    </button>
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isLight ? 'text-gray-500' : 'text-zinc-400'
                  }`}>
                    Tiêu đề
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isLight ? 'text-gray-500' : 'text-zinc-400'
                  }`}>
                    <button
                      onClick={() => handleSort('severity')}
                      className="flex items-center gap-1 hover:underline"
                    >
                      Mức độ
                      {sortBy === 'severity' && (
                        <span className={isAsc ? 'rotate-180' : ''}>↑</span>
                      )}
                    </button>
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isLight ? 'text-gray-500' : 'text-zinc-400'
                  }`}>
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-1 hover:underline"
                    >
                      Trạng thái
                      {sortBy === 'status' && (
                        <span className={isAsc ? 'rotate-180' : ''}>↑</span>
                      )}
                    </button>
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isLight ? 'text-gray-500' : 'text-zinc-400'
                  }`}>
                    <button
                      onClick={() => handleSort('reportedAt')}
                      className="flex items-center gap-1 hover:underline"
                    >
                      Thời gian khiếu nại
                      {sortBy === 'reportedAt' && (
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
                {incidents.map((incident) => (
                  <tr key={incident.id} className={`hover:bg-opacity-50 ${
                    isLight ? 'hover:bg-gray-50' : 'hover:bg-zinc-800/50'
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Ship className={`h-4 w-4 ${
                          isLight ? 'text-blue-600' : 'text-cyan-400'
                        }`} />
                        <div>
                          <div className={`font-medium ${
                            isLight ? 'text-gray-900' : 'text-white'
                          }`}>
                            {incident.shipName}
                          </div>
                          {incident.reportedBy && (
                            <div className={`text-xs mt-0.5 ${
                              isLight ? 'text-gray-500' : 'text-zinc-400'
                            }`}>
                              {incident.reportedBy}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-medium mb-1 ${
                        isLight ? 'text-gray-900' : 'text-white'
                      }`}>
                        {incident.title}
                      </div>
                      <div className={`text-sm line-clamp-2 ${
                        isLight ? 'text-gray-600' : 'text-zinc-400'
                      }`}>
                        {incident.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <SeverityBadge severity={incident.severity} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={incident.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center gap-2 text-sm ${
                        isLight ? 'text-gray-600' : 'text-zinc-400'
                      }`}>
                        <Calendar className="h-4 w-4" />
                        {formatDate(incident.reportedAt || incident.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => openDetail(incident)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                          isLight
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
            <div className={`px-6 py-4 border-t flex items-center justify-between ${
              isLight ? 'border-gray-200' : 'border-zinc-800'
            }`}>
              <div className={`text-sm ${
                isLight ? 'text-gray-600' : 'text-zinc-400'
              }`}>
                Hiển thị {((pagination.page - 1) * pagination.size) + 1} đến{' '}
                {Math.min(pagination.page * pagination.size, pagination.total)} trong tổng số{' '}
                {pagination.total} đơn
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
      {!loading && !error && incidents.length === 0 && (
        <div className={`rounded-lg border p-12 text-center ${
          isLight 
            ? 'border-gray-200 bg-white' 
            : 'border-zinc-800 bg-zinc-900'
        }`}>
          <AlertTriangle className={`h-12 w-12 mx-auto mb-4 ${
            isLight ? 'text-gray-400' : 'text-zinc-600'
          }`} />
          <h3 className={`text-lg font-medium mb-2 ${
            isLight ? 'text-gray-900' : 'text-white'
          }`}>
            Không có đơn khiếu nại nào
          </h3>
          <p className={isLight ? 'text-gray-600' : 'text-zinc-400'}>
            Chưa có đơn khiếu nại nào trong hệ thống hoặc không tìm thấy kết quả phù hợp với bộ lọc
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {detailOpen && selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={closeDetail}></div>
          <div className={`relative w-full max-w-3xl rounded-lg ${isLight ? 'bg-white' : 'bg-zinc-900'} border ${
            isLight ? 'border-gray-200' : 'border-zinc-800'
          } max-h-[90vh] overflow-y-auto`}>
            {/* Header */}
            <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${
              isLight ? 'border-gray-200 bg-white' : 'border-zinc-800 bg-zinc-900'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  SEVERITY_COLORS[selectedIncident.severity]?.bg || SEVERITY_COLORS.LOW.bg
                }`}>
                  <AlertTriangle className={`h-5 w-5 ${
                    SEVERITY_COLORS[selectedIncident.severity]?.text || SEVERITY_COLORS.LOW.text
                  }`} />
                </div>
                <div>
                  <h2 className={`text-xl font-semibold ${
                    isLight ? 'text-gray-900' : 'text-white'
                  }`}>
                    {selectedIncident.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <SeverityBadge severity={selectedIncident.severity} />
                    <StatusBadge status={selectedIncident.status} />
                  </div>
                </div>
              </div>
              <button 
                onClick={closeDetail}
                className={`p-2 rounded-lg transition-colors ${
                  isLight 
                    ? 'text-gray-500 hover:bg-gray-100' 
                    : 'text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Ship Info */}
              <div className={`p-4 rounded-lg border ${
                isLight ? 'border-gray-200 bg-gray-50' : 'border-zinc-800 bg-zinc-800/50'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Ship className={`h-5 w-5 ${
                    isLight ? 'text-blue-600' : 'text-cyan-400'
                  }`} />
                  <h3 className={`font-semibold ${
                    isLight ? 'text-gray-900' : 'text-white'
                  }`}>
                    Thông tin tàu
                  </h3>
                </div>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 text-sm ${
                  isLight ? 'text-gray-700' : 'text-zinc-300'
                }`}>
                  <div>
                    <span className={isLight ? 'text-gray-500' : 'text-zinc-400'}>Tên tàu:</span>{' '}
                    <span className="font-medium">{selectedIncident.shipName}</span>
                  </div>
                  {selectedIncident.reportedBy && (
                    <div>
                      <span className={isLight ? 'text-gray-500' : 'text-zinc-400'}>Người khiếu nại:</span>{' '}
                      <span className="font-medium">{selectedIncident.reportedBy}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className={`h-5 w-5 ${
                    isLight ? 'text-blue-600' : 'text-cyan-400'
                  }`} />
                  <h3 className={`font-semibold ${
                    isLight ? 'text-gray-900' : 'text-white'
                  }`}>
                    Mô tả chi tiết
                  </h3>
                </div>
                <div className={`p-4 rounded-lg border ${
                  isLight ? 'border-gray-200 bg-gray-50' : 'border-zinc-800 bg-zinc-800/50'
                }`}>
                  <p className={`whitespace-pre-wrap ${
                    isLight ? 'text-gray-700' : 'text-zinc-300'
                  }`}>
                    {selectedIncident.description || 'Không có mô tả chi tiết'}
                  </p>
                </div>
              </div>

              {/* Location */}
              {selectedIncident.location && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className={`h-5 w-5 ${
                      isLight ? 'text-blue-600' : 'text-cyan-400'
                    }`} />
                    <h3 className={`font-semibold ${
                      isLight ? 'text-gray-900' : 'text-white'
                    }`}>
                      Vị trí
                    </h3>
                  </div>
                  <div className={`p-4 rounded-lg border ${
                    isLight ? 'border-gray-200 bg-gray-50' : 'border-zinc-800 bg-zinc-800/50'
                  }`}>
                    <div className={`text-sm ${
                      isLight ? 'text-gray-700' : 'text-zinc-300'
                    }`}>
                      <div>
                        <span className={isLight ? 'text-gray-500' : 'text-zinc-400'}>Vĩ độ:</span>{' '}
                        {selectedIncident.location.latitude?.toFixed(6)}
                      </div>
                      <div className="mt-1">
                        <span className={isLight ? 'text-gray-500' : 'text-zinc-400'}>Kinh độ:</span>{' '}
                        {selectedIncident.location.longitude?.toFixed(6)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className={`p-4 rounded-lg border ${
                isLight ? 'border-gray-200 bg-gray-50' : 'border-zinc-800 bg-zinc-800/50'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className={`h-5 w-5 ${
                    isLight ? 'text-blue-600' : 'text-cyan-400'
                  }`} />
                  <h3 className={`font-semibold ${
                    isLight ? 'text-gray-900' : 'text-white'
                  }`}>
                    Thông tin thời gian
                  </h3>
                </div>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 text-sm ${
                  isLight ? 'text-gray-700' : 'text-zinc-300'
                }`}>
                  {selectedIncident.reportedAt && (
                    <div>
                      <span className={isLight ? 'text-gray-500' : 'text-zinc-400'}>Thời gian khiếu nại:</span>
                      <div className="font-medium mt-0.5">
                        {formatDate(selectedIncident.reportedAt)}
                      </div>
                    </div>
                  )}
                  {selectedIncident.createdAt && (
                    <div>
                      <span className={isLight ? 'text-gray-500' : 'text-zinc-400'}>Thời gian tạo:</span>
                      <div className="font-medium mt-0.5">
                        {formatDate(selectedIncident.createdAt)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`sticky bottom-0 flex items-center justify-end gap-3 p-6 border-t ${
              isLight ? 'border-gray-200 bg-white' : 'border-zinc-800 bg-zinc-900'
            }`}>
              <button 
                onClick={closeDetail}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isLight
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
    </div>
  )
}

