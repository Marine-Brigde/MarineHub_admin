// src/api/portApi.js
import axiosClient from './axiosClient'

export const portApi = {
    // 🚢 Lấy danh sách ports với pagination
    getPorts: (params = {}) => {
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
        return axiosClient.get(url)
    },

    // 🚢 Lấy thông tin port theo ID
    getPortById: (id) => {
        const url = `/v1/ports/${id}`
        return axiosClient.get(url)
    },

    // ➕ Tạo port mới
    createPort: (portData) => {
        const url = '/v1/ports'
        return axiosClient.post(url, portData)
    },

    // ✏️ Cập nhật port
    updatePort: (id, portData) => {
        const url = `/v1/ports/${id}`
        return axiosClient.put(url, portData)
    },

    // 🗑️ Xóa port
    deletePort: (id) => {
        const url = `/v1/ports/${id}`
        return axiosClient.delete(url)
    }
}
