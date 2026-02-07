import api from './api';

export const getSystemStats = async () => {
    const response = await api.get('/admin/stats');
    return response.data;
};

export const getAllVehicles = async () => {
    const response = await api.get('/admin/vehicles');
    return response.data;
};

export const addVehicle = async (vehicleData) => {
    const response = await api.post('/admin/vehicles/add', vehicleData);
    return response.data;
};

export const deleteVehicle = async (id) => {
    await api.delete(`/admin/vehicles/${id}`);
};

export const getAllDrivers = async () => {
    const response = await api.get('/admin/drivers');
    return response.data;
};

export const approveDriver = async (id) => {
    await api.patch(`/admin/drivers/${id}/approve`);
};

export const suspendDriver = async (id) => {
    await api.patch(`/admin/drivers/${id}/suspend`);
};
