// src/api/portApi.js
import axiosClient from './axiosClient'

export const portApi = {
    // 🚢 Lấy danh sách ports với pagination
    getPorts: async (params = {}) => {
        const {
            page = 1,
            size = 30,
            sortBy = 'name',
            isAsc = true,
            name = ''
        } = params

        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sortBy,
            isAsc: isAsc.toString()
        })

        if (name) {
            queryParams.append('name', name)
        }

        const url = `/v1/ports?${queryParams.toString()}`
        const response = await axiosClient.get(url)
        return response.data
    },

    // 🔎 Lấy chi tiết 1 port theo id
    getPortById: async (id) => {
        const url = `/v1/ports/${id}`
        const response = await axiosClient.get(url)
        return response.data
    },

    // ✏️ Cập nhật port (PATCH /v1/ports/{id})
    updatePort: async (id, data) => {
        const url = `/v1/ports/${id}`
        const response = await axiosClient.patch(url, data)
        return response.data
    }
}
