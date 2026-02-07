import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminBookings = () => {
    const [activeBookings, setActiveBookings] = useState([]);
    const [historyBookings, setHistoryBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('current');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const [currentRes, historyRes] = await Promise.all([
                api.get('/admin/bookings/current'),
                api.get('/admin/bookings/history')
            ]);
            setActiveBookings(currentRes.data);
            setHistoryBookings(historyRes.data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const bookingsToShow = activeTab === 'current' ? activeBookings : historyBookings;

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Booking Oversight</h2>

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => setActiveTab('current')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: activeTab === 'current' ? 'var(--primary-color)' : '#e0e0e0',
                        color: activeTab === 'current' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '4px 0 0 4px',
                        cursor: 'pointer'
                    }}
                >
                    Active Bookings
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: activeTab === 'history' ? 'var(--primary-color)' : '#e0e0e0',
                        color: activeTab === 'history' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '0 4px 4px 0',
                        cursor: 'pointer'
                    }}
                >
                    Booking History
                </button>
            </div>

            {loading ? <div>Loading Bookings...</div> : (
                <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f4f6f8', borderBottom: '2px solid #ddd' }}>
                            <tr>
                                <th style={{ padding: '15px' }}>Booking ID</th>
                                <th style={{ padding: '15px' }}>Customer</th>
                                <th style={{ padding: '15px' }}>Driver</th>
                                <th style={{ padding: '15px' }}>Vehicle</th>
                                <th style={{ padding: '15px' }}>Route</th>
                                <th style={{ padding: '15px' }}>Status</th>
                                <th style={{ padding: '15px' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookingsToShow.map(booking => (
                                <tr key={booking.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{booking.bookingNumber}</td>
                                    <td style={{ padding: '15px' }}>{booking.customerName}</td>
                                    <td style={{ padding: '15px' }}>{booking.driverName}</td>
                                    <td style={{ padding: '15px' }}>{booking.vehicleRegistration}</td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontSize: '0.9rem', color: '#555' }}>
                                            <div>From: {booking.source}</div>
                                            <div>To: {booking.destination}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                                            backgroundColor: booking.status === 'COMPLETED' ? '#d4edda' : '#cce5ff',
                                            color: booking.status === 'COMPLETED' ? '#155724' : '#004085'
                                        }}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px' }}>${booking.totalAmount}</td>
                                </tr>
                            ))}
                            {bookingsToShow.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                                        No {activeTab} bookings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminBookings;
