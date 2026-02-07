import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();

    return (
        <nav style={{
            backgroundColor: 'var(--white)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem 0',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    FleetPulse
                </Link>
                <ul style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    {!isAuthenticated ? (
                        <>
                            <li>
                                <Link to="/login" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                                    Register
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            {user?.role === 'ADMIN' && <li><Link to="/admin">Dashboard</Link></li>}
                            {user?.role === 'DRIVER' && (
                                <li style={{ position: 'relative' }}
                                    onMouseEnter={() => document.getElementById('driver-dropdown').style.display = 'block'}
                                    onMouseLeave={() => document.getElementById('driver-dropdown').style.display = 'none'}
                                >
                                    <span style={{ cursor: 'pointer', padding: '10px', fontWeight: '500' }}>
                                        Driver ▾
                                    </span>
                                    <div id="driver-dropdown" style={{
                                        display: 'none',
                                        position: 'absolute',
                                        top: '100%',
                                        left: '0',
                                        backgroundColor: 'white',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        borderRadius: '4px',
                                        minWidth: '150px',
                                        zIndex: 1001,
                                        padding: '5px 0'
                                    }}>
                                        <Link to="/driver/profile" style={{ display: 'block', padding: '10px 15px', color: '#333', textDecoration: 'none' }} className="dropdown-item">
                                            Driver Profile
                                        </Link>
                                        <Link to="/driver/earnings" style={{ display: 'block', padding: '10px 15px', color: '#333', textDecoration: 'none' }} className="dropdown-item">
                                            Total Earnings
                                        </Link>
                                    </div>
                                </li>
                            )}                            {user?.role === 'CUSTOMER' && (
                                <li style={{ position: 'relative' }}
                                    onMouseEnter={() => document.getElementById('dashboard-dropdown').style.display = 'block'}
                                    onMouseLeave={() => document.getElementById('dashboard-dropdown').style.display = 'none'}
                                >
                                    <span style={{ cursor: 'pointer', padding: '10px', fontWeight: '500' }}>
                                        Dashboard ▾
                                    </span>
                                    <div id="dashboard-dropdown" style={{
                                        display: 'none',
                                        position: 'absolute',
                                        top: '100%',
                                        left: '0',
                                        backgroundColor: 'white',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        borderRadius: '4px',
                                        minWidth: '150px',
                                        zIndex: 1001,
                                        padding: '5px 0'
                                    }}>
                                        <Link to="/user/profile" style={{ display: 'block', padding: '10px 15px', color: '#333', textDecoration: 'none' }} className="dropdown-item">
                                            User Profile
                                        </Link>
                                        <Link to="/user/dashboard" style={{ display: 'block', padding: '10px 15px', color: '#333', textDecoration: 'none' }} className="dropdown-item">
                                            My Bookings
                                        </Link>
                                    </div>
                                </li>
                            )}                            <li>
                                <button onClick={logout} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
