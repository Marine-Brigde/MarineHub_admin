// src/api/supplierApi.js
import axiosClient from './axiosClient'

export const supplierApi = {
    // 📦 Lấy danh sách suppliers với pagination
    getSuppliers: async (params = {}) => {
        const {
            page = 1,
            size = 9,
            sortBy = 'name',
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

        const url = `/v1/suppliers?${queryParams.toString()}`
        const response = await axiosClient.get(url)
        return response.data
    },

    // 🔎 Lấy chi tiết 1 supplier theo id
    getSupplierById: async (id) => {
        const url = `/v1/suppliers/${id}`
        const response = await axiosClient.get(url)
        return response.data
    }
}

