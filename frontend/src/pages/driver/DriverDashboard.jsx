import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDriverDashboard, acceptTrip, cancelTrip, startTrip, completeTrip } from '../../services/driver.service';

const DriverDashboard = () => {
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            loadTrips();
        }
    }, [user]);

    const loadTrips = async () => {
        try {
            const data = await getDriverDashboard(user.id);
            setTrips(data);
        } catch (error) {
            console.error("Failed to load trips");
        } finally {
            setLoading(false);
        }
    };

    const [startKmInput, setStartKmInput] = useState('');
    const [endKmInput, setEndKmInput] = useState('');
    const [additionalChargesInput, setAdditionalChargesInput] = useState('0');

    const handleAccept = async (bookingId) => {
        try {
            await acceptTrip(bookingId);
            loadTrips(); // Refresh to show Start Trip input
        } catch (error) {
            console.error("Failed to accept trip", error);
            const errMsg = error.response?.data?.message || error.message || "Unknown error";
            alert(`Failed to accept trip: ${errMsg}`);
        }
    };

    const submitStartTrip = async (bookingId) => {
        if (!startKmInput) {
            alert("Please enter Start KM");
            return;
        }
        try {
            await startTrip(bookingId, parseFloat(startKmInput));
            setStartKmInput('');
            loadTrips(); // Must refresh to update status to IN_PROGRESS
        } catch (error) {
            console.error("Failed to start trip", error);
            const errMsg = error.response?.data?.message || error.message || "Unknown error";
            alert(`Failed to start trip: ${errMsg}`);
        }
    };

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this trip?")) return;
        try {
            await cancelTrip(bookingId);
            loadTrips(); // Refresh
        } catch (error) {
            console.error("Failed to cancel trip", error);
            alert("Failed to cancel trip.");
        }
    };

    const submitEndTrip = async (bookingId) => {
        if (!endKmInput) {
            alert("Please enter End KM");
            return;
        }
        try {
            await completeTrip(bookingId, parseFloat(endKmInput), parseFloat(additionalChargesInput || 0));
            setEndKmInput('');
            setAdditionalChargesInput('0');
            loadTrips();
        } catch (error) {
            console.error("Failed to complete trip", error);
            const errMsg = error.response?.data?.message || error.message || "Unknown error";
            alert(`Failed to complete trip: ${errMsg}`);
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '20px' }}>My Assigned Trips</h2>
            {loading ? (
                <p>Loading trips...</p>
            ) : trips.length === 0 ? (
                <div className="card">
                    <p>No active trips assigned.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {(() => {
                        const activeTrip = trips.find(t => t.status === 'IN_PROGRESS');
                        const displayTrips = activeTrip ? [activeTrip] : trips;

                        return displayTrips.map(trip => (
                            <div key={trip.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <h4 style={{ color: 'var(--primary-color)' }}>Trip #{trip.id}</h4>
                                    <span style={{
                                        padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                        backgroundColor: trip.status === 'CONFIRMED' ? '#fff3cd' : (trip.status === 'IN_PROGRESS' ? '#cce5ff' : '#d4edda'),
                                        color: trip.status === 'CONFIRMED' ? '#856404' : (trip.status === 'IN_PROGRESS' ? '#004085' : '#155724')
                                    }}>
                                        {trip.status}
                                    </span>
                                    <span style={{ fontSize: '0.6rem', color: '#999', marginLeft: '5px' }}>({trip.status})</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div>
                                        <p style={{ fontSize: '0.9rem', color: '#666' }}>Pick Up</p>
                                        <p><strong>{trip.sourceLocation}</strong></p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.9rem', color: '#666' }}>Drop Off</p>
                                        <p><strong>{trip.destinationLocation}</strong></p>
                                    </div>
                                </div>
                                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Customer: {trip.customerName}</span>
                                    <span>{trip.totalDistanceKm} km</span>
                                </div>

                                {/* ACTION BUTTONS */}
                                <div style={{ marginTop: '15px' }}>
                                    {(trip.status === 'DRIVER_ASSIGNED' || trip.status === 'PENDING') && (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => handleAccept(trip.id)} style={{
                                                padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                                            }}>
                                                Accept
                                            </button>
                                            <button onClick={() => handleCancel(trip.id)} style={{
                                                padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                                            }}>
                                                Cancel
                                            </button>
                                        </div>
                                    )}

                                    {trip.status === 'CONFIRMED' && (
                                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                            <input
                                                type="number"
                                                placeholder="Start KM"
                                                value={startKmInput}
                                                onChange={(e) => setStartKmInput(e.target.value)}
                                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '120px' }}
                                            />
                                            <button onClick={() => submitStartTrip(trip.id)} style={{
                                                padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                                            }}>
                                                Start Trip
                                            </button>
                                        </div>
                                    )}
                                </div>





                                {trip.status === 'IN_PROGRESS' && (
                                    <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                        <p style={{ marginBottom: '10px' }}><strong>Complete Trip</strong></p>
                                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <input
                                                type="number"
                                                placeholder="End KM"
                                                value={endKmInput}
                                                onChange={(e) => setEndKmInput(e.target.value)}
                                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100px' }}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Extra Charges"
                                                value={additionalChargesInput}
                                                onChange={(e) => setAdditionalChargesInput(e.target.value)}
                                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100px' }}
                                            />
                                            <button onClick={() => submitEndTrip(trip.id)} style={{
                                                padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                                            }}>
                                                End Trip
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        ));
                    })()}
                </div>
            )}

            {/* NEW: Trip History Section */}
            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #eee' }}>
                <h3>Trip History</h3>
                <TripHistoryComponent user={user} />
            </div>
        </div>
    );
};

// Simple internal component for History to keep main component clean
const TripHistoryComponent = ({ user }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.id) {
            loadHistory();
        }
    }, [user]);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const data = await import('../../services/driver.service').then(m => m.getDriverHistory(user.id));
            setHistory(data);
        } catch (error) {
            console.error("Failed to load history", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading history...</p>;
    if (history.length === 0) return <p style={{ color: '#666' }}>No past trips found.</p>;

    return (
        <div style={{ display: 'grid', gap: '15px', marginTop: '15px' }}>
            {history.map(trip => (
                <div key={trip.id} className="card" style={{ backgroundColor: '#f9f9f9', borderLeft: trip.status === 'COMPLETED' ? '5px solid green' : '5px solid gray' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h5>#{trip.bookingNumber}</h5>
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: trip.status === 'COMPLETED' ? 'green' : 'gray' }}>
                            {trip.status}
                        </span>
                    </div>
                    <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>{trip.sourceLocation} ➝ {trip.destinationLocation}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#555' }}>
                        <span>Date: {new Date(trip.scheduledStartTime).toLocaleDateString()}</span>
                        <span>₹{trip.totalAmount}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DriverDashboard;
