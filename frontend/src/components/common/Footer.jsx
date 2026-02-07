import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: 'var(--secondary-color)',
            color: 'var(--white)',
            padding: '2rem 0',
            marginTop: 'auto'
        }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <p>&copy; {new Date().getFullYear()} Fleet Management System. All rights reserved.</p>
                <div style={{ marginTop: '10px' }}>
                    <a href="#" style={{ margin: '0 10px', color: '#ccc' }}>Privacy Policy</a>
                    <a href="#" style={{ margin: '0 10px', color: '#ccc' }}>Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
