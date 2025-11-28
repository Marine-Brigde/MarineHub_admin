// src/api/revenueApi.js
import axiosClient from './axiosClient'

export const revenueApi = {
    // 💰 Tạo đơn doanh thu
    createRevenue: async (data) => {
        const url = '/v1/revenues'
        const response = await axiosClient.post(url, data)
        return response.data
    }
}

