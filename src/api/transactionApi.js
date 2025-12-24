// src/api/transactionApi.js
import axiosClient from './axiosClient'

export const transactionApi = {
  // 💳 Lấy danh sách giao dịch với pagination & filters
  getTransactions: async (params = {}) => {
    const {
      page = 1,
      size = 100,
      sortBy = 'createdDate',
      isAsc = false,
      status = '',
      type = '',
      startDate = '',
      endDate = '',
      query = ''
    } = params

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      isAsc: isAsc.toString()
    })

    if (status) {
      queryParams.append('status', status)
    }
    if (type) {
      queryParams.append('type', type)
    }
    if (startDate) {
      queryParams.append('startDate', startDate)
    }
    if (endDate) {
      queryParams.append('endDate', endDate)
    }
    if (query) {
      queryParams.append('query', query)
    }

    const url = `/v1/transactions?${queryParams.toString()}`
    const response = await axiosClient.get(url)
    return response.data
  }
}


