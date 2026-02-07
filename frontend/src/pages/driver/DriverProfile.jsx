import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const DriverProfile = () => {
    const { user } = useAuth();
    const [driverData, setDriverData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchDriverProfile();
        }
    }, [user]);

    const fetchDriverProfile = async () => {
        try {
            const response = await api.get(`/drivers/${user.id}/profile`);
            setDriverData(response.data);
        } catch (error) {
            console.error("Failed to load driver profile", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading Profile...</div>;
    if (!driverData) return <div>Profile not found.</div>;

    const containerStyle = { padding: '40px' };
    const cardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
    const titleStyle = { color: 'var(--primary-color)', marginBottom: '20px' };
    const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
    const labelStyle = { fontWeight: 'bold', color: '#555', marginBottom: '5px' };
    const valueStyle = { color: '#333', fontSize: '1.1rem' };

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>Driver Profile</h2>
            <div style={cardStyle}>
                <div style={gridStyle}>
                    <div>
                        <div style={labelStyle}>Driver Name</div>
                        <div style={valueStyle}>{driverData.user.firstName} {driverData.user.lastName}</div>
                    </div>
                    <div>
                        <div style={labelStyle}>Email</div>
                        <div style={valueStyle}>{driverData.user.email}</div>
                    </div>
                    <div>
                        <div style={labelStyle}>Phone Number</div>
                        <div style={valueStyle}>{driverData.user.phoneNumber}</div>
                    </div>

                    <div>
                        <div style={labelStyle}>License Number</div>
                        <div style={valueStyle}>{driverData.licenseNumber}</div>
                    </div>
                    <div>
                        <div style={labelStyle}>License Expiry</div>
                        <div style={valueStyle}>{driverData.licenseExpiryDate}</div>
                    </div>
                    <div>
                        <div style={labelStyle}>Experience (Years)</div>
                        <div style={valueStyle}>{driverData.experienceYears}</div>
                    </div>
                    <div>
                        <div style={labelStyle}>Status</div>
                        <span style={{
                            padding: '4px 10px',
                            borderRadius: '15px',
                            backgroundColor: driverData.isAvailable ? '#d4edda' : '#f8d7da',
                            color: driverData.isAvailable ? '#155724' : '#721c24'
                        }}>
                            {driverData.isAvailable ? 'Available' : 'Busy'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverProfile;
