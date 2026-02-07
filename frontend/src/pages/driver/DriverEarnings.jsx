import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const DriverEarnings = () => {
    const { user } = useAuth();
    const [earnings, setEarnings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchDriverProfile();
        }
    }, [user]);

    const fetchDriverProfile = async () => {
        try {
            const response = await api.get(`/drivers/${user.id}/profile`);
            setEarnings(response.data.totalEarnings);
        } catch (error) {
            console.error("Failed to load driver earnings", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px' }}>
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>Total Earnings</h2>
            {loading ? <p>Loading...</p> : (
                <div style={{
                    backgroundColor: '#fff',
                    padding: '40px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    maxWidth: '400px'
                }}>
                    <h3 style={{ margin: 0, color: '#555' }}>Lifetime Earnings</h3>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#28a745', margin: '20px 0' }}>
                        ${earnings !== null ? earnings : '0.00'}
                    </div>
                    <p style={{ color: '#888' }}>Total earned from completed trips.</p>
                </div>
            )}
        </div>
    );
};

export default DriverEarnings;
