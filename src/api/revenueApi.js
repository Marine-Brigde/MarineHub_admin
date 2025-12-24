// src/api/revenueApi.js
import axiosClient from './axiosClient'

export const revenueApi = {
    // 💰 Lấy danh sách doanh thu
    getRevenues: async (params = {}) => {
        const {
            startDate = '',
            endDate = ''
        } = params

        const queryParams = new URLSearchParams()

        if (startDate) {
            queryParams.append('startDate', startDate)
        }
        if (endDate) {
            queryParams.append('endDate', endDate)
        }

        const url = `/v1/revenues${queryParams.toString() ? '?' + queryParams.toString() : ''}`
        const response = await axiosClient.get(url)
        return response.data
    },

    // 💰 Tạo đơn doanh thu
    createRevenue: async (data) => {
        const url = '/v1/revenues'
        const response = await axiosClient.post(url, data)
        return response.data
    }
}

