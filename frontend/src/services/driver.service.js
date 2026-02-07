import api from './api';

export const getDriverDashboard = async (userId) => {
    const response = await api.get(`/drivers/${userId}/dashboard`);
    return response.data;
};

export const getDriverHistory = async (userId) => {
    const response = await api.get(`/drivers/${userId}/history`);
    return response.data;
};

export const acceptTrip = async (bookingId) => {
    const response = await api.post(`/drivers/bookings/${bookingId}/accept`);
    return response.data;
};

export const startTrip = async (bookingId, startKm) => {
    const response = await api.post(`/drivers/trip/start`, { bookingId, startKm });
    return response.data;
};

export const completeTrip = async (bookingId, endKm, additionalCharges) => {
    const response = await api.post(`/drivers/trip/end`, { bookingId, endKm, additionalCharges });
    return response.data;
};

export const cancelTrip = async (bookingId) => {
    const response = await api.post(`/drivers/bookings/${bookingId}/cancel`);
    return response.data;
};