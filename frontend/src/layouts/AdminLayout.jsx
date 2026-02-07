import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Car, Users, LogOut } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { logout } = useAuth();

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{
                width: '250px',
                backgroundColor: 'var(--secondary-color)',
                color: 'var(--white)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ padding: '20px', fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #444' }}>
                    Admin Portal
                </div>
                <nav style={{ flex: 1, padding: '20px 0' }}>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <li>
                            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', color: '#ccc', gap: '10px' }}>
                                <LayoutDashboard size={20} /> Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/vehicles" style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', color: '#ccc', gap: '10px' }}>
                                <Car size={20} /> Vehicles
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/drivers" style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', color: '#ccc', gap: '10px' }}>
                                <Users size={20} /> Drivers
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/bookings" style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', color: '#ccc', gap: '10px' }}>
                                <Users size={20} /> Bookings
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

            {/* Main Content */}
            <main style={{ flex: 1, backgroundColor: '#f4f6f8', padding: '20px' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
