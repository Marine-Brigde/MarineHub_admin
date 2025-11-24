import React, { useMemo, useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import {
  Search,
  Filter,
  Wallet2,
  ArrowDownUp,
  RotateCcw,
  ShieldCheck,
  Ship,
  BadgeDollarSign,
  CalendarRange,
  CheckCircle2,
  ArrowDownToLine
} from 'lucide-react'

const STATUS_STYLES = {
  PENDING: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    label: 'Chờ xử lý'
  },
  PROCESSING: {
    bg: 'bg-blue-500/15',
    text: 'text-blue-200',
    label: 'Đang xử lý'
  },
  COMPLETED: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-300',
    label: 'Đã hoàn tất'
  },
  REFUNDED: {
    bg: 'bg-rose-500/15',
    text: 'text-rose-300',
    label: 'Đã hoàn tiền'
  },
  DISPUTED: {
    bg: 'bg-purple-500/15',
    text: 'text-purple-300',
    label: 'Đang đối soát'
  }
}

const TYPE_STYLES = {
  DEPOSIT: { bg: 'bg-blue-500/10 text-blue-200', label: 'Nạp / Nhận' },
  DISBURSEMENT: { bg: 'bg-cyan-500/10 text-cyan-200', label: 'Chi / Thanh toán' },
  REFUND: { bg: 'bg-rose-500/10 text-rose-200', label: 'Hoàn tiền' }
}

const MOCK_TRANSACTIONS = [
  {
    id: 'TX-928173',
    vessel: 'MV Hải Nam 07',
    role: 'Boatyard',
    counterpart: 'Orbitmap Marine',
    amount: 125_000_000,
    currency: 'VND',
    type: 'DISBURSEMENT',
    status: 'PENDING',
    initiatedBy: 'Trần Bảo Khánh',
    timestamp: '2025-11-22T08:30:00Z',
    method: 'Chuyển khoản ngân hàng',
    reference: 'INV-2025-1122',
    note: 'Thanh toán đợt 2 cho dịch vụ bảo dưỡng.'
  },
  {
    id: 'TX-512084',
    vessel: 'SV Emerald Dream',
    role: 'Owner',
    counterpart: 'Boatyard Saigon Dock',
    amount: 87_500_000,
    currency: 'VND',
    type: 'DEPOSIT',
    status: 'COMPLETED',
    initiatedBy: 'Nguyễn Quang Minh',
    timestamp: '2025-11-20T14:45:00Z',
    method: 'Ví MarinePay',
    reference: 'ORD-4512',
    note: 'Đã xác nhận nhận tiền từ chủ tàu.'
  },
  {
    id: 'TX-730991',
    vessel: 'CS Blue Horizon',
    role: 'Supplier',
    counterpart: 'Orbitmap Marine',
    amount: 34_900_000,
    currency: 'VND',
    type: 'REFUND',
    status: 'REFUNDED',
    initiatedBy: 'Admin',
    timestamp: '2025-11-18T09:10:00Z',
    method: 'Nội bộ',
    reference: 'RF-2045',
    note: 'Hoàn tiền vật tư không sử dụng.'
  },
  {
    id: 'TX-821004',
    vessel: 'MV Vũng Tàu 05',
    role: 'Boatyard',
    counterpart: 'Owner Nguyễn Văn An',
    amount: 210_000_000,
    currency: 'VND',
    type: 'DISBURSEMENT',
    status: 'PROCESSING',
    initiatedBy: 'Trần Nhật Gia',
    timestamp: '2025-11-21T11:00:00Z',
    method: 'Chuyển khoản ngân hàng',
    reference: 'INV-2025-1118',
    note: 'Chờ đối chiếu chứng từ bổ sung.'
  }
]

const formatCurrency = (value, currency = 'VND') => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency
  }).format(value)
}

function StatusBadge({ status }) {
  const config = STATUS_STYLES[status] || STATUS_STYLES.PENDING
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}

function TypeBadge({ type }) {
  const config = TYPE_STYLES[type] || TYPE_STYLES.DEPOSIT
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${config.bg}`}>
      {config.label}
    </span>
  )
}

export default function DatabasePage() {
  const { isLight } = useTheme()
  const [filters, setFilters] = useState({
    query: '',
    status: '',
    type: '',
    startDate: '',
    endDate: ''
  })
  const [actionModal, setActionModal] = useState(null) // { mode: 'receive' | 'refund', transaction }
  const [toast, setToast] = useState(null)

  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((item) => {
      const queryMatch =
        filters.query === '' ||
        item.id.toLowerCase().includes(filters.query.toLowerCase()) ||
        item.vessel.toLowerCase().includes(filters.query.toLowerCase()) ||
        item.counterpart.toLowerCase().includes(filters.query.toLowerCase())

      const statusMatch = !filters.status || item.status === filters.status
      const typeMatch = !filters.type || item.type === filters.type

      const startMatch = !filters.startDate || new Date(item.timestamp) >= new Date(filters.startDate)
      const endMatch = !filters.endDate || new Date(item.timestamp) <= new Date(filters.endDate)

      return queryMatch && statusMatch && typeMatch && startMatch && endMatch
    })
  }, [filters])

  const stats = useMemo(() => {
    const totalVolume = MOCK_TRANSACTIONS.reduce((sum, item) => sum + item.amount, 0)
    const pending = MOCK_TRANSACTIONS.filter((item) => ['PENDING', 'PROCESSING'].includes(item.status)).length
    const refunds = MOCK_TRANSACTIONS.filter((item) => item.type === 'REFUND').length
    const net =
      MOCK_TRANSACTIONS.filter((item) => item.type !== 'REFUND').reduce((sum, item) => sum + item.amount, 0) -
      MOCK_TRANSACTIONS.filter((item) => item.type === 'REFUND').reduce((sum, item) => sum + item.amount, 0)

    return { totalVolume, pending, refunds, net }
  }, [])

  const openAction = (mode, transaction) => {
    setActionModal({ mode, transaction })
  }

  const closeAction = () => {
    setActionModal(null)
  }

  const confirmAction = () => {
    if (!actionModal) return
    const { mode, transaction } = actionModal
    const actionLabel = mode === 'receive' ? 'Xác nhận đã nhận' : 'Hoàn tiền'
    setToast(`${actionLabel} cho giao dịch ${transaction.id} đã được ghi nhận (mock).`)
    setTimeout(() => setToast(null), 4000)
    closeAction()
  }

  const resetFilters = () => {
    setFilters({
      query: '',
      status: '',
      type: '',
      startDate: '',
      endDate: ''
    })
  }

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
          Quản lý luồng tiền giữa owner, boatyard, supplier và các ví Orbitmap.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
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
              <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-blue-100/70'}`}>Đang chờ</p>
              <p className={`text-2xl font-semibold mt-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {stats.pending} giao dịch
              </p>
            </div>
            <div className={`p-3 rounded-xl ${isLight ? 'bg-amber-100' : 'bg-amber-900/40'}`}>
              <CalendarRange className={`h-5 w-5 ${isLight ? 'text-amber-700' : 'text-amber-300'}`} />
            </div>
          </div>
        </div>
        <div className={`rounded-2xl border p-5 ${cardBase}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-blue-100/70'}`}>Hoàn tiền</p>
              <p className={`text-2xl font-semibold mt-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {stats.refunds} yêu cầu
              </p>
            </div>
            <div className={`p-3 rounded-xl ${isLight ? 'bg-rose-100' : 'bg-rose-900/40'}`}>
              <RotateCcw className={`h-5 w-5 ${isLight ? 'text-rose-600' : 'text-rose-300'}`} />
            </div>
          </div>
        </div>
        <div className={`rounded-2xl border p-5 ${cardBase}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-blue-100/70'}`}>Dòng tiền thuần</p>
              <p className={`text-2xl font-semibold mt-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {formatCurrency(stats.net)}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${isLight ? 'bg-emerald-100' : 'bg-emerald-900/40'}`}>
              <BadgeDollarSign className={`h-5 w-5 ${isLight ? 'text-emerald-700' : 'text-emerald-300'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        className={`rounded-2xl border p-6 mb-6 ${isLight ? 'border-gray-200 bg-white' : 'border-blue-900/40 bg-blue-950/50'}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isLight ? 'text-gray-500' : 'text-blue-300/70'}`} />
            <input
              type="text"
              placeholder="Tìm mã giao dịch, tàu, đối tác..."
              value={filters.query}
              onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
              className={`w-full rounded-xl border px-3 py-2 pl-10 text-sm focus:outline-none focus:ring-1 ${
                isLight
                  ? 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/30'
                  : 'border-blue-900/60 bg-blue-950/80 text-slate-100 placeholder:text-blue-300/60 focus:border-cyan-500/40 focus:ring-cyan-500/30'
              }`}
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className={`rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
              isLight
                ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500/30'
                : 'border-blue-900/60 bg-blue-950/80 text-slate-100 focus:border-cyan-500/40 focus:ring-cyan-500/30'
            }`}
          >
            <option value="">Trạng thái</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="PROCESSING">Đang xử lý</option>
            <option value="COMPLETED">Hoàn tất</option>
            <option value="REFUNDED">Đã hoàn tiền</option>
            <option value="DISPUTED">Đối soát</option>
          </select>
          <select
            value={filters.type}
            onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
            className={`rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
              isLight
                ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500/30'
                : 'border-blue-900/60 bg-blue-950/80 text-slate-100 focus:border-cyan-500/40 focus:ring-cyan-500/30'
            }`}
          >
            <option value="">Loại giao dịch</option>
            <option value="DEPOSIT">Nhận / Deposit</option>
            <option value="DISBURSEMENT">Chi / Thanh toán</option>
            <option value="REFUND">Hoàn tiền</option>
          </select>
          <div className="flex gap-2">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                isLight
                  ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500/30'
                  : 'border-blue-900/60 bg-blue-950/80 text-slate-100 focus:border-cyan-500/40 focus:ring-cyan-500/30'
              }`}
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                isLight
                  ? 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500/30'
                  : 'border-blue-900/60 bg-blue-950/80 text-slate-100 focus:border-cyan-500/40 focus:ring-cyan-500/30'
              }`}
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className={`inline-flex items-center gap-2 text-sm ${isLight ? 'text-gray-500' : 'text-blue-100/70'}`}>
            <Filter className="h-3.5 w-3.5" />
            {filteredTransactions.length} kết quả phù hợp
          </div>
          <button
            onClick={resetFilters}
            className={`text-sm font-medium ${isLight ? 'text-blue-700 hover:underline' : 'text-cyan-300 hover:text-cyan-200'}`}
          >
            Đặt lại bộ lọc
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-2xl border ${isLight ? 'border-gray-200 bg-white' : 'border-blue-900/40 bg-blue-950/50'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isLight ? 'border-b border-gray-200' : 'border-b border-blue-900/40'}>
              <tr>
                <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${headerText}`}>
                  Giao dịch
                </th>
                <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${headerText}`}>
                  Đối tượng
                </th>
                <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${headerText}`}>
                  Số tiền
                </th>
                <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${headerText}`}>
                  Loại
                </th>
                <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${headerText}`}>
                  Thời gian
                </th>
                <th className={`text-right px-6 py-4 text-xs font-semibold uppercase tracking-wider ${headerText}`}>
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className={isLight ? 'divide-y divide-gray-200' : 'divide-y divide-blue-900/40'}>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className={isLight ? 'hover:bg-gray-50' : 'hover:bg-blue-900/20'}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className={`flex items-center gap-2 font-medium text-sm ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        <ArrowDownUp className={`h-4 w-4 ${isLight ? 'text-blue-600' : 'text-cyan-300'}`} />
                        <span>{transaction.id}</span>
                      </div>
                      <div className={isLight ? 'text-sm text-gray-500' : 'text-sm text-blue-100/70'}>
                        Tham chiếu: {transaction.reference}
                      </div>
                      <div className={isLight ? 'text-sm text-gray-500' : 'text-sm text-blue-100/70'}>
                        Phương thức: {transaction.method}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className={`flex items-center gap-2 font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        <Ship className={`h-4 w-4 ${isLight ? 'text-blue-600' : 'text-cyan-300'}`} />
                        {transaction.vessel}
                      </div>
                      <div className={`text-sm ${isLight ? 'text-gray-500' : 'text-blue-100/70'}`}>
                        Vai trò: {transaction.role}
                      </div>
                      <div className={`text-sm ${isLight ? 'text-gray-500' : 'text-blue-100/70'}`}>
                        Đối tác: {transaction.counterpart}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </div>
                    <div className="mt-1">
                      <StatusBadge status={transaction.status} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <TypeBadge type={transaction.type} />
                    <p className={`text-xs mt-2 ${isLight ? 'text-gray-500' : 'text-blue-100/70'}`}>
                      {transaction.note}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>
                      {new Date(transaction.timestamp).toLocaleString('vi-VN')}
                    </div>
                    <div className={`text-xs mt-1 ${isLight ? 'text-gray-500' : 'text-blue-100/70'}`}>
                      Người tạo: {transaction.initiatedBy}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap justify-end gap-2">
                      {['PENDING', 'PROCESSING'].includes(transaction.status) && (
                        <button
                          onClick={() => openAction('receive', transaction)}
                          className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ${
                            isLight
                              ? 'bg-blue-600/10 text-blue-700 hover:bg-blue-600/20'
                              : 'bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20'
                          }`}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Đã nhận
                        </button>
                      )}
                      {transaction.status !== 'REFUNDED' && (
                        <button
                          onClick={() => openAction('refund', transaction)}
                          className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ${
                            isLight
                              ? 'bg-rose-600/10 text-rose-700 hover:bg-rose-600/20'
                              : 'bg-rose-500/10 text-rose-200 hover:bg-rose-500/20'
                          }`}
                        >
                          <RotateCcw className="h-4 w-4" />
                          Hoàn tiền
                        </button>
                      )}
                      {transaction.type === 'DISBURSEMENT' && transaction.status === 'COMPLETED' && (
                        <button
                          className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ${
                            isLight
                              ? 'bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/20'
                              : 'bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20'
                          }`}
                        >
                          <ShieldCheck className="h-4 w-4" />
                          Đối soát
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="py-16 text-center">
            <ArrowDownToLine className={`h-12 w-12 mx-auto mb-4 ${isLight ? 'text-gray-300' : 'text-blue-900/60'}`} />
            <p className={`text-lg font-medium mb-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
              Không tìm thấy giao dịch phù hợp
            </p>
            <p className={isLight ? 'text-gray-500' : 'text-blue-100/70'}>
              Điều chỉnh bộ lọc hoặc khởi tạo giao dịch mới khi API sẵn sàng.
            </p>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeAction}></div>
          <div className={`relative w-full max-w-lg rounded-2xl border p-6 ${isLight ? 'bg-white border-gray-200' : 'bg-blue-950/90 border-blue-900/40'}`}>
            <div className="flex items-center gap-3 mb-4">
              {actionModal.mode === 'receive' ? (
                <CheckCircle2 className={`h-5 w-5 ${isLight ? 'text-blue-600' : 'text-cyan-300'}`} />
              ) : (
                <RotateCcw className={`h-5 w-5 ${isLight ? 'text-rose-600' : 'text-rose-300'}`} />
              )}
              <h3 className={`text-lg font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                {actionModal.mode === 'receive' ? 'Xác nhận đã nhận tiền' : 'Khởi tạo hoàn tiền'}
              </h3>
            </div>
            <div className={`text-sm ${isLight ? 'text-gray-600' : 'text-blue-100/80'}`}>
              <p className="mb-2">Mã giao dịch: <strong>{actionModal.transaction.id}</strong></p>
              <p className="mb-2">Số tiền: <strong>{formatCurrency(actionModal.transaction.amount)}</strong></p>
              <p>Đối tác: {actionModal.transaction.counterpart}</p>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={closeAction}
                className={`px-4 py-2 rounded-xl text-sm font-medium ${isLight ? 'text-gray-600 hover:bg-gray-100' : 'text-blue-100 hover:bg-blue-900/40'}`}
              >
                Hủy
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                  actionModal.mode === 'receive'
                    ? isLight
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-cyan-600 text-white hover:bg-cyan-500'
                    : isLight
                      ? 'bg-rose-600 text-white hover:bg-rose-700'
                      : 'bg-rose-600 text-white hover:bg-rose-500'
                }`}
              >
                {actionModal.mode === 'receive' ? 'Xác nhận' : 'Hoàn tiền'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 ${
            isLight ? 'bg-white text-gray-900' : 'bg-blue-950 text-white'
          }`}>
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-medium">{toast}</span>
          </div>
        </div>
      )}
    </div>
  )
}
