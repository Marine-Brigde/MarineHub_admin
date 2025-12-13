import React, { useState, useEffect } from 'react'
import { Users, Package, Building2, TrendingUp, Loader2 } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { userApi } from '../../api/userApi'
import { supplierApi } from '../../api/supplierApi'
import { boatyardApi } from '../../api/boatyardApi'

export function StatisticsCards() {
  const { isLight } = useTheme()
  const [stats, setStats] = useState({
    users: { count: 0, loading: true },
    suppliers: { count: 0, loading: true },
    boatyards: { count: 0, loading: true }
  })

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      // Fetch Users count
      try {
        const usersResponse = await userApi.getUsers({ page: 1, size: 1 })
        if (usersResponse.status === 200 && usersResponse.data) {
          setStats(prev => ({
            ...prev,
            users: { count: usersResponse.data.total || 0, loading: false }
          }))
        }
      } catch (err) {
        console.error('Error fetching users:', err)
        setStats(prev => ({ ...prev, users: { count: 0, loading: false } }))
      }

      // Fetch Suppliers count
      try {
        const suppliersResponse = await supplierApi.getSuppliers({ page: 1, size: 1 })
        if (suppliersResponse.status === 200 && suppliersResponse.data) {
          setStats(prev => ({
            ...prev,
            suppliers: { count: suppliersResponse.data.total || 0, loading: false }
          }))
        }
      } catch (err) {
        console.error('Error fetching suppliers:', err)
        setStats(prev => ({ ...prev, suppliers: { count: 0, loading: false } }))
      }

      // Fetch Boatyards count
      try {
        const boatyardsResponse = await boatyardApi.getBoatyards({ page: 1, size: 1 })
        if (boatyardsResponse.status === 200 && boatyardsResponse.data) {
          setStats(prev => ({
            ...prev,
            boatyards: { count: boatyardsResponse.data.total || 0, loading: false }
          }))
        }
      } catch (err) {
        console.error('Error fetching boatyards:', err)
        setStats(prev => ({ ...prev, boatyards: { count: 0, loading: false } }))
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    }
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const cardData = [
    {
      title: 'Tổng Người Dùng',
      value: stats.users.count,
      loading: stats.users.loading,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      borderColor: 'border-blue-500/20',
      hoverBorderColor: 'hover:border-blue-500/40',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-cyan-400',
      href: '/users'
    },
    {
      title: 'Nhà Cung Cấp',
      value: stats.suppliers.count,
      loading: stats.suppliers.loading,
      icon: Package,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-500/20',
      hoverBorderColor: 'hover:border-purple-500/40',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      href: '/suppliers'
    },
    {
      title: 'Xưởng Tàu',
      value: stats.boatyards.count,
      loading: stats.boatyards.loading,
      icon: Building2,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-500/10 to-teal-500/10',
      borderColor: 'border-emerald-500/20',
      hoverBorderColor: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      href: '/boatyards'
    }
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      {cardData.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={index}
            className={`relative overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg ${
              isLight
                ? 'bg-white border-gray-200 hover:border-gray-300'
                : `bg-gradient-to-br ${card.bgGradient} border ${card.borderColor} ${card.hoverBorderColor}`
            }`}
          >
            {/* Decorative gradient background */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-5 rounded-full blur-2xl`} />
            
            <div className="relative p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className={`text-sm font-medium mb-2 ${
                    isLight ? 'text-gray-600' : 'text-blue-200/80'
                  }`}>
                    {card.title}
                  </p>
                  {card.loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
                      <span className={`text-2xl font-bold ${
                        isLight ? 'text-gray-900' : 'text-white'
                      }`}>
                        Đang tải...
                      </span>
                    </div>
                  ) : (
                    <h3 className={`text-3xl font-bold mb-1 ${
                      isLight ? 'text-gray-900' : 'text-white'
                    }`}>
                      {formatNumber(card.value)}
                    </h3>
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className={`h-4 w-4 ${
                      isLight ? 'text-green-600' : 'text-green-400'
                    }`} />
                    <span className={`text-xs ${
                      isLight ? 'text-gray-500' : 'text-blue-300/70'
                    }`}>
                      Tổng số lượng
                    </span>
                  </div>
                </div>
                
                {/* Icon */}
                <div className={`p-3 rounded-xl ${card.iconBg} backdrop-blur-sm`}>
                  <Icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
              </div>
            </div>

            {/* Bottom border accent */}
            <div className={`h-1 bg-gradient-to-r ${card.gradient}`} />
          </div>
        )
      })}
    </div>
  )
}

