// src/types/api.js

// Generic API Response structure
export const ApiResponse = (data) => ({
    status: Number,
    message: String,
    data: data
})

// Pagination data structure
export const PaginationData = (items) => ({
    size: Number,
    page: Number,
    total: Number,
    totalPages: Number,
    items: items
})

// Port data structure
export const PortData = {
    id: String,
    name: String,
    country: String,
    city: String,
    longitude: String || null,
    latitude: String || null,
    createdDate: String,
    lastModifiedDate: String || null
}

// Port query parameters
export const PortQueryParams = {
    page: Number,
    size: Number,
    sortBy: String,
    isAsc: Boolean,
    name: String
}

// Port request data structure for creating/updating
export const PortRequest = {
    name: String,
    country: String,
    city: String,
    longitude: String,
    latitude: String
}