import React, { useEffect, useState } from 'react';
import { getSystemStats } from '../../services/admin.service';

const StatCard = ({ title, value, color }) => (
    <div className="card" style={{ borderLeft: `5px solid ${color}` }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-light)', marginBottom: '5px' }}>{title}</h3>
        <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{value}</p>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalVehicles: 0,
        activeDrivers: 0,
        pendingBookings: 0,
        totalRevenue: 0
       
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await getSystemStats();
            // Ensure backend returns these keys, or map them here
            setStats(data);
        } catch (error) {
            console.error("Failed to load stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div>
            <h2 style={{ marginBottom: '20px' }}>Dashboard Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <StatCard title="Total Vehicles" value={stats.totalVehicles} color="var(--primary-color)" />
                <StatCard title="Active Drivers" value={stats.activeDrivers} color="#28a745" />
                <StatCard title="Total Bookings" value={stats.totalBookings || 0} color="#ffc107" />
                <StatCard title="Total Revenue" value={`$${stats.totalRevenue || 0}`} color="#17a2b8" />
               { /*<StatCard title="Total Profit" value={`$${stats.totalProfit || 0}`} color="#17a2b8" /> */} 
            </div>

            <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Placeholder for future charts */}
                <div className="card">
                    <h3>System Status</h3>
                    <p style={{ marginTop: '10px' }}>System is running smoothly.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
