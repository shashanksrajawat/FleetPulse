import React from 'react';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
    const { user } = useAuth();

    if (!user) {
        return <div className="container" style={{ padding: '40px 0' }}>It seems you are not logged in.</div>;
    }

    const containerStyle = {
        padding: '40px 0',
        maxWidth: '800px',
        margin: '0 auto'
    };

    const headerStyle = {
        marginBottom: '30px',
        color: 'var(--primary-color)',
        borderBottom: '2px solid #eee',
        paddingBottom: '10px'
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        overflow: 'hidden'
    };

    const rowStyle = {
        borderBottom: '1px solid #eee'
    };

    const labelStyle = {
        padding: '15px 20px',
        fontWeight: 'bold',
        color: '#555',
        width: '30%',
        backgroundColor: '#f9f9f9'
    };

    const valueStyle = {
        padding: '15px 20px',
        color: '#333'
    };

    return (
        <div className="container" style={containerStyle}>
            <h2 style={headerStyle}>User Profile</h2>
            
            <table style={tableStyle}>
                <tbody>
                    <tr style={rowStyle}>
                        <td style={labelStyle}>Email</td>
                        <td style={valueStyle}>{user.email}</td>
                    </tr>
                    <tr style={rowStyle}>
                        <td style={labelStyle}>First Name</td>
                        <td style={valueStyle}>{user.firstName || 'N/A'}</td>
                    </tr>
                    <tr style={rowStyle}>
                        <td style={labelStyle}>Last Name</td>
                        <td style={valueStyle}>{user.lastName || 'N/A'}</td>
                    </tr>
                    <tr style={rowStyle}>
                        <td style={labelStyle}>Phone Number</td>
                        <td style={valueStyle}>{user.phoneNumber || 'N/A'}</td>
                    </tr>
                    <tr style={rowStyle}>
                        <td style={labelStyle}>Password</td>
                        <td style={valueStyle}>********</td>
                    </tr>
                    <tr style={{ ...rowStyle, borderBottom: 'none' }}>
                        <td style={labelStyle}>Active</td>
                        <td style={valueStyle}>
                            <span style={{ 
                                padding: '4px 10px', 
                                borderRadius: '15px', 
                                backgroundColor: user.isActive ? '#d4edda' : '#f8d7da', 
                                color: user.isActive ? '#155724' : '#721c24',
                                fontSize: '0.9rem'
                            }}>
                                {user.isActive ? 'Yes' : 'No'}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default UserProfile;
