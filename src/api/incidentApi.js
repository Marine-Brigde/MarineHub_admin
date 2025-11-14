// src/api/incidentApi.js
import axiosClient from './axiosClient'

export const incidentApi = {
    // 🚨 Lấy danh sách đơn khiếu nại với pagination và filters
    getIncidents: async (params = {}) => {
        const {
            page = 1,
            size = 30,
            sortBy = 'createdDate',
            isAsc = false,
            shipName = '',
            status = '',
            severity = '',
            startDate = '',
            endDate = ''
        } = params

        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sortBy,
            isAsc: isAsc.toString()
        })

        if (shipName) {
            queryParams.append('shipName', shipName)
        }
        if (status) {
            queryParams.append('status', status)
        }
        if (severity) {
            queryParams.append('severity', severity)
        }
        if (startDate) {
            queryParams.append('startDate', startDate)
        }
        if (endDate) {
            queryParams.append('endDate', endDate)
        }

        const url = `/v1/incidents?${queryParams.toString()}`
        const response = await axiosClient.get(url)
        return response.data
    },

    // 🔎 Lấy chi tiết 1 đơn khiếu nại theo id
    getIncidentById: async (id) => {
        const url = `/v1/incidents/${id}`
        const response = await axiosClient.get(url)
        return response.data
    },

    // ✅ Cập nhật trạng thái đơn khiếu nại (PATCH /v1/incidents/{id})
    updateIncidentStatus: async (id, data) => {
        const url = `/v1/incidents/${id}/status`
        const response = await axiosClient.patch(url, data)
        return response.data
    },

    // 📝 Cập nhật ghi chú/chú thích (PATCH /v1/incidents/{id}/note)
    updateIncidentNote: async (id, note) => {
        const url = `/v1/incidents/${id}/note`
        const response = await axiosClient.patch(url, { note })
        return response.data
    }
}

