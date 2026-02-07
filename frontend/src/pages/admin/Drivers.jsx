import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Check, X, AlertTriangle } from 'lucide-react';

const AdminDrivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const response = await api.get('/admin/drivers');
            setDrivers(response.data);
        } catch (error) {
            console.error("Error fetching drivers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm("Are you sure you want to approve this driver?")) return;
        try {
            await api.patch(`/admin/drivers/${id}/approve`);
            fetchDrivers(); // Refresh list
        } catch (error) {
            console.error("Error approving driver:", error);
            alert("Failed to approve driver.");
        }
    };

    const handleSuspend = async (id) => {
        if (!window.confirm("Are you sure you want to suspend this driver?")) return;
        try {
            await api.patch(`/admin/drivers/${id}/suspend`);
            fetchDrivers(); // Refresh list
        } catch (error) {
            console.error("Error suspending driver:", error);
            alert("Failed to suspend driver.");
        }
    };

    if (loading) return <div>Loading Drivers...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Driver Management</h2>
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f4f6f8', borderBottom: '2px solid #ddd' }}>
                        <tr>
                            <th style={{ padding: '15px' }}>ID</th>
                            <th style={{ padding: '15px' }}>Name</th>
                            <th style={{ padding: '15px' }}>License</th>
                            <th style={{ padding: '15px' }}>Status</th>
                            <th style={{ padding: '15px' }}>Verified</th>
                            <th style={{ padding: '15px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map(driver => (
                            <tr key={driver.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '15px' }}>{driver.id}</td>
                                <td style={{ padding: '15px' }}>
                                    <div>{driver.fullName}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{driver.email}</div>
                                </td>
                                <td style={{ padding: '15px' }}>{driver.licenseNumber}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem',
                                        backgroundColor: driver.status === 'ACTIVE' ? '#d4edda' : '#f8d7da',
                                        color: driver.status === 'ACTIVE' ? '#155724' : '#721c24'
                                    }}>
                                        {driver.status}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    {driver.isDocumentVerified ?
                                        <span style={{ color: 'green', display: 'flex', alignItems: 'center', gap: '5px' }}><Check size={16} /> Yes</span> :
                                        <span style={{ color: 'orange', display: 'flex', alignItems: 'center', gap: '5px' }}><AlertTriangle size={16} /> Pending</span>
                                    }
                                </td>
                                <td style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                                    {!driver.isDocumentVerified && (
                                        <button onClick={() => handleApprove(driver.id)} style={{
                                            backgroundColor: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'
                                        }}>
                                            <Check size={16} /> Approve
                                        </button>
                                    )}
                                    <button onClick={() => handleSuspend(driver.id)} style={{
                                        backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'
                                    }}>
                                        <X size={16} /> Suspend
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {drivers.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No drivers found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDrivers;
