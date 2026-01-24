import axiosClient from './axiosClient'

export const bookingApi = {
    /**
     * Get all bookings with filters
     * @param {Object} params - Query parameters
     * @param {string} params.BoatyardId - Boatyard ID filter
     * @param {string} params.StartDate - Start date filter (YYYY-MM-DD)
     * @param {string} params.EndDate - End date filter (YYYY-MM-DD)
     * @param {number} params.Page - Page number
     * @param {number} params.PageSize - Page size
     */
    getBookings: async (params = {}) => {
        try {
            const response = await axiosClient.get('/v1/bookings', { params })
            return response.data
        } catch (error) {
            console.error('Error fetching bookings:', error)
            throw error
        }
    },

    /**
     * Get booking by ID
     * @param {string} id - Booking ID
     */
    getBookingById: async (id) => {
        try {
            const response = await axiosClient.get(`/v1/bookings/${id}`)
            return response.data
        } catch (error) {
            console.error('Error fetching booking:', error)
            throw error
        }
    }
}
