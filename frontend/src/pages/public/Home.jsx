import React, { useState, useEffect } from 'react';
import { getEstimate, createBooking } from '../../services/booking.service';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

import { indianCities } from '../../utils/indianCities';

const Home = () => {
    const [source, setSource] = useState('Pune');
    const [destination, setDestination] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [vehicleType, setVehicleType] = useState('SEDAN'); // Default
    const [scheduledTime, setScheduledTime] = useState('');
    const [estimate, setEstimate] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Restore state if redirected back from login
        if (location.state && location.state.estimateContext) {
            const ctx = location.state.estimateContext;
            setSource(ctx.source);
            setDestination(ctx.destination);
            setVehicleType(ctx.vehicleType);
            setScheduledTime(ctx.scheduledTime);
            setEstimate(ctx.estimate);

            // Clean up state to avoid persisting it on refresh (optional but good practice)
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleDestinationChange = (e) => {
        const userInput = e.target.value;
        setDestination(userInput);

        if (userInput) {
            const filtered = indianCities.filter(city =>
                city.toLowerCase().startsWith(userInput.toLowerCase())
            );
            setFilteredCities(filtered);
            setShowSuggestions(true);
        } else {
            setFilteredCities([]);
            setShowSuggestions(false);
        }
    };

    const handleCitySelect = (city) => {
        setDestination(city);
        setShowSuggestions(false);
    };

    const handleDateBlur = () => {
        if (!scheduledTime) return;

        const date = new Date(scheduledTime);
        if (isNaN(date.getTime())) return;

        const minutes = date.getMinutes();
        const remainder = minutes % 30;

        if (remainder !== 0) {
            // Snap to nearest 30 (rounding)
            const snapedMinutes = 30 * Math.round(minutes / 30);
            date.setMinutes(snapedMinutes);
            date.setSeconds(0);
            date.setMilliseconds(0);

            // Reconstruct local ISO string YYYY-MM-DDTHH:mm
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hour = String(date.getHours()).padStart(2, '0');
            const min = String(date.getMinutes()).padStart(2, '0');

            setScheduledTime(`${year}-${month}-${day}T${hour}:${min}`);
        }
    };

    const handleEstimate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setEstimate(null);
        setError('');

        // Validation
        const selectedDate = new Date(scheduledTime);
        const now = new Date();
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

        if (isNaN(selectedDate.getTime())) {
            setError('Please select a valid date and time.');
            setLoading(false);
            return;
        }

        if (selectedDate < now) {
            setError('Booking time cannot be in the past.');
            setLoading(false);
            return;
        }

        if (selectedDate > oneMonthFromNow) {
            setError('Booking cannot be made more than one month in advance.');
            setLoading(false);
            return;
        }

        try {
            // Assume backend wants { source, destination, vehicleType, scheduledTime }
            const data = await getEstimate({ source, destination, vehicleType, scheduledTime: scheduledTime || new Date().toISOString() });
            setEstimate(data);
        } catch (err) {
            setError('Failed to fetch estimate. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmBooking = async () => {
        const estimateContext = { source, destination, vehicleType, scheduledTime, estimate };

        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/', estimateContext } });
            return;
        }

        try {
            setLoading(true);
            await createBooking({
                customerId: user.id,
                sourceLocation: source,
                destinationLocation: destination,
                vehicleType: vehicleType,
                scheduledStartTime: scheduledTime || new Date().toISOString(),
                distance: estimate.distanceKm
            });
            alert('Booking Confirmed Successfully!');
            navigate('/user/dashboard');
        } catch (err) {
            console.error(err);
            // If the error is a string (common from our backend), display it directly.
            // Otherwise, look for err.message or default to generic error.
            const errorMessage = typeof err === 'string'
                ? err
                : (err.message || 'Failed to confirm booking.');

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '50px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1>Welcome to Fleet Management System</h1>
                <p style={{ marginTop: '20px', fontSize: '1.2rem', color: 'var(--text-light)' }}>
                    Reliable, Efficient, and Professional Transport Services
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'start' }}>
                {/* Estimate Form */}
                <div className="card">
                    <h3 style={{ marginBottom: '20px', color: 'var(--primary-color)' }}>Get a Trip Estimate</h3>
                    <form onSubmit={handleEstimate}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Source Location</label>
                            <input
                                type="text"
                                value={source}
                                readOnly
                                placeholder="Pune"
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)', backgroundColor: '#f8f9fa' }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px', position: 'relative' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Destination</label>
                            <input
                                type="text"
                                value={destination}
                                onChange={handleDestinationChange}
                                required
                                placeholder="e.g. Airport"
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)' }}
                                autoComplete="off"
                            />
                            {showSuggestions && filteredCities.length > 0 && (
                                <ul style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    width: '100%',
                                    backgroundColor: 'white',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '0 0 5px 5px',
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    padding: 0,
                                    margin: 0,
                                    listStyleType: 'none',
                                    zIndex: 1000,
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}>
                                    {filteredCities.map((city, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleCitySelect(city)}
                                            style={{
                                                padding: '10px',
                                                cursor: 'pointer',
                                                borderBottom: index !== filteredCities.length - 1 ? '1px solid #eee' : 'none',
                                                backgroundColor: 'white'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                        >
                                            {city}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Date & Time</label>
                            <input
                                type="datetime-local"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                onBlur={handleDateBlur}
                                min={`${new Date().toISOString().split('T')[0]}T00:00`}
                                max={new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 16)}
                                step="1800"
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)' }}
                            />
                            <small style={{ color: '#666', fontSize: '0.8em' }}>Select time in 30-min intervals (e.g., 10:00, 10:30)</small>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Vehicle Type</label>
                            <select
                                value={vehicleType}
                                onChange={(e) => setVehicleType(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)' }}
                            >
                                <option value="SEDAN">Sedan (Standard)</option>
                                <option value="HATCHBACK">Hatchback (Compact)</option>
                                <option value="SUV">SUV (Large)</option>
                                <option value="LUXURY">Luxury (Premium)</option>
                            </select>
                        </div>
                        <button disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                            {loading ? 'Calculating...' : 'Get Estimate'}
                        </button>
                    </form>
                </div>

                {/* Result Display */}
                <div>
                    {estimate && (
                        <div className="card" style={{ borderLeft: '5px solid var(--success)' }}>
                            <h3 style={{ marginBottom: '15px', color: 'var(--success)' }}>Estimate Result</h3>
                            <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
                                <strong>Estimated Cost:</strong> {estimate.currency} {estimate.totalEstimatedPrice}
                            </p>
                            <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
                                <strong>Distance:</strong> {estimate.distanceKm} km
                            </p>
                            <p style={{ fontSize: '1.1rem', marginBottom: '10px', color: '#666' }}>
                                <strong>Base Price:</strong> {estimate.currency} {estimate.basePrice}
                            </p>
                            <button
                                onClick={handleConfirmBooking}
                                disabled={loading}
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: '20px', backgroundColor: 'var(--success)', borderColor: 'var(--success)' }}
                            >
                                {loading ? 'Processing...' : 'Confirm Booking'}
                            </button>
                        </div>
                    )}
                    {error && (
                        <div className="card" style={{ borderLeft: '5px solid var(--danger)' }}>
                            <p style={{ color: 'var(--danger)' }}>{error}</p>
                        </div>
                    )}

                    {!estimate && !error && (
                        <div style={{ padding: '20px', backgroundColor: '#e9ecef', borderRadius: '8px', textAlign: 'center' }}>
                            <h3>Why Choose Us?</h3>
                            <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px', textAlign: 'left' }}>
                                {/* <li style={{ marginBottom: '10px' }}>✔ Real-time tracking</li> */}
                                <li style={{ marginBottom: '10px' }}>✔ Professional drivers</li>
                                <li style={{ marginBottom: '10px' }}>✔ Transparent pricing</li>
                                <li style={{ marginBottom: '10px' }}>✔ 24/7 Support</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
