// src/api/boatyardApi.js
import axiosClient from './axiosClient'

export const boatyardApi = {
    // 🏭 Lấy danh sách boatyards với pagination
    getBoatyards: async (params = {}) => {
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

        const url = `/v1/boatyards?${queryParams.toString()}`
        const response = await axiosClient.get(url)
        return response.data
    },

    // 🔎 Lấy chi tiết 1 boatyard theo id
    getBoatyardById: async (id) => {
        const url = `/v1/boatyards/${id}`
        const response = await axiosClient.get(url)
        return response.data
    }
}

