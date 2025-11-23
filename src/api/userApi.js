// src/api/userApi.js
import axiosClient from './axiosClient'

export const userApi = {
    // 👥 Lấy danh sách users/accounts với pagination
    getUsers: async (params = {}) => {
        const {
            page = 1,
            size = 9,
            sortBy = 'fullName',
            isAsc = false,
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

        const url = `/v1/accounts?${queryParams.toString()}`
        const response = await axiosClient.get(url)
        return response.data
    },

    // 🔎 Lấy chi tiết 1 user theo id
    getUserById: async (id) => {
        const url = `/v1/accounts/${id}`
        const response = await axiosClient.get(url)
        return response.data
    },

    // ✏️ Cập nhật user (PATCH /v1/accounts/{id})
    updateUser: async (id, data) => {
        const url = `/v1/accounts/${id}`
        const response = await axiosClient.patch(url, data)
        return response.data
    },

    // 🗑️ Xóa user (DELETE /v1/accounts/{id})
    deleteUser: async (id) => {
        const url = `/v1/accounts/${id}`
        const response = await axiosClient.delete(url)
        return response.data
    }
}

