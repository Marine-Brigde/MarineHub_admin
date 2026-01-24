// src/api/accountApi.js
import axiosClient from './axiosClient'

export const accountApi = {
    // 💰 Update commission fee for boatyard/supplier
    updateCommissionFee: async (id, type, commissionFeePercent) => {
        const url = `/v1/accounts/${id}/commission`
        const payload = {
            type,
            commissionFeePercent
        }
        const response = await axiosClient.patch(url, payload)
        // The API might return the data directly or wrapped in a response object
        return response.data || response
    }
}
