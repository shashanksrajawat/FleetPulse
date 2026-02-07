import api from './api';

export const getEstimate = async (estimateRequest) => {
    try {
        const response = await api.post('/home/estimate', estimateRequest);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getUserBookings = async (userId) => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
};

export const getDriverBookings = async (driverId) => {
    const response = await api.get(`/bookings/driver/${driverId}`);
    return response.data;
};
export const createBooking = async (bookingRequest) => {
    try {
        const response = await api.post('/bookings/confirm', bookingRequest);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const cancelBooking = async (bookingId) => {
    try {
        const response = await api.post(`/bookings/${bookingId}/cancel`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
