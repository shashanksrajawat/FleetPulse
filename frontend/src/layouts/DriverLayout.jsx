import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Truck, Video, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
const DriverLayout = () => {
    const { logout } = useAuth(); // Get logout function from context

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <aside style={{
                width: '250px',
                backgroundColor: '#2c3e50',
                color: 'var(--white)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ padding: '20px', fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #444' }}>
                    Driver Portal
                </div>
                <nav style={{ flex: 1, padding: '20px 0' }}>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <li>
                            <Link to="/driver" style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', color: '#ccc', gap: '10px' }}>
                                <Truck size={20} /> My Trips
                            </Link>
                        </li>
                        <li>
                            <Link to="/driver/profile" style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', color: '#ccc', gap: '10px' }}>
                                <Video size={20} /> Profile
                            </Link>
                        </li>

                    </ul>
                </nav>
                <div style={{ padding: '20px', borderTop: '1px solid #444' }}>
                    <button onClick={logout} style={{ display: 'flex', alignItems: 'center', color: '#ccc', gap: '10px', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>
            <main style={{ flex: 1, backgroundColor: '#f4f6f8', padding: '20px' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default DriverLayout;
