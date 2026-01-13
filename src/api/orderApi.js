import axiosClient from './axiosClient'

export const orderApi = {
    /**
     * Get all orders with filters
     * @param {Object} params - Query parameters
     * @param {string} params.ShipId - Ship ID filter
     * @param {string} params.Status - Status filter
     * @param {string} params.StartDate - Start date filter
     * @param {string} params.EndDate - End date filter
     * @param {string} params.SupplierId - Supplier ID filter
     * @param {number} params.Page - Page number
     * @param {number} params.PageSize - Page size
     * @param {string} params.Search - Search query
     * @param {string} params.SortBy - Sort field
     * @param {boolean} params.IsAsc - Sort direction
     */
    getOrders: async (params = {}) => {
        try {
            const response = await axiosClient.get('/v1/orders', { params })
            return response.data
        } catch (error) {
            console.error('Error fetching orders:', error)
            throw error
        }
    },

    /**
     * Get order by ID
     * @param {string} id - Order ID
     */
    getOrderById: async (id) => {
        try {
            const response = await axiosClient.get(`/v1/orders/${id}`)
            return response.data
        } catch (error) {
            console.error('Error fetching order:', error)
            throw error
        }
    }
}
