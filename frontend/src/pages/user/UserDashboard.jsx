import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserBookings, cancelBooking } from '../../services/booking.service';

const UserDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.id) {
            loadBookings();
        }
    }, [user]);

    const loadBookings = async () => {
        try {
            const data = await getUserBookings(user.id);
            setBookings(data);
        } catch (error) {
            console.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            await cancelBooking(bookingId);
            alert("Booking cancelled successfully.");
            loadBookings(); // Refresh list
        } catch (error) {
            alert("Failed to cancel: " + (error.message || "Unknown error"));
        }
    };

    const canCancel = (booking) => {
        if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED' || booking.status === 'IN_PROGRESS') return false;

        const bookingTime = new Date(booking.createdAt).getTime();
        const now = new Date().getTime();
        const hoursDiff = (now - bookingTime) / (1000 * 60 * 60);

        return hoursDiff <= 5;
    };

return (
    <div className="container" style={{ padding: '40px 0' }}>
        <h2 style={{ marginBottom: '20px' }}>My Bookings</h2>
        {loading ? (
            <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
                <div className="card">
                <p>You haven't made any bookings yet.</p>
                <button 
                    className="btn btn-primary" 
                    style={{ marginTop: '15px' }}
                    onClick={() => navigate('/')}
                >
                    Book a Ride
                </button>
            </div>
        ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {bookings.map(booking => (
                        <div key={booking.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ marginBottom: '5px' }}>
                                    Trip #{booking.bookingNumber || booking.id} 
                                    <span style={{ 
                                        fontSize: '0.8em', 
                                        padding: '2px 8px', 
                                        borderRadius: '10px', 
                                        backgroundColor: booking.status === 'CANCELLED' ? '#ffcccc' : '#ccffcc',
                                        marginLeft: '10px'
                                    }}>
                                        {booking.status}
                                    </span>
                                </h4>
                                <p style={{ color: '#666' }}>{booking.sourceLocation} ➝ {booking.destinationLocation}</p>
                                <p style={{ fontSize: '0.9rem', color: '#888' }}>
                                    Date: {new Date(booking.scheduledStartTime).toLocaleDateString()} {new Date(booking.scheduledStartTime).toLocaleTimeString()}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                    ₹{booking.status === 'COMPLETED' ? booking.totalAmount : booking.estimatedPrice}
                                    {booking.status === 'COMPLETED' && (
                                        <span style={{ fontSize: '0.7rem', color: '#666', display: 'block', fontWeight: 'normal' }}>
                                            (Est: ₹{booking.estimatedPrice})
                                        </span>
                                    )}
                                </p>
                                <p style={{ fontSize: '0.9rem' }}>{booking.totalDistanceKm} km</p>

                                {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                                    <button
                                        onClick={() => handleCancel(booking.id)}
                                        disabled={!canCancel(booking)}
                                        className="btn"
                                        style={{
                                            marginTop: '10px',
                                            padding: '5px 10px',
                                            backgroundColor: canCancel(booking) ? '#dc3545' : '#ccc',
                                            color: '#fff',
                                            border: 'none',
                                            cursor: canCancel(booking) ? 'pointer' : 'not-allowed'
                                        }}
                                    >
                                        {canCancel(booking) ? 'Cancel Booking' : 'Cannot Cancel'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;