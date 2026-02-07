import React from 'react';

const About = () => {
    return (
        <div className="container" style={{ padding: '50px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={{ color: 'var(--primary-color)' }}>About Us</h1>
                <p style={{ marginTop: '20px', fontSize: '1.2rem', color: 'var(--text-light)' }}>
                    Leading the way in efficient fleet management and transport solutions.
                </p>
            </div>

            <div className="card" style={{ padding: '40px' }}>
                <h2 style={{ marginBottom: '20px' }}>Our Mission</h2>
                <p style={{ lineHeight: '1.6', fontSize: '1.1rem', marginBottom: '30px' }}>
                    At FleetPulse, we are dedicated to providing top-tier transportation services that are safe, reliable, and efficient.
                    Our mission is to streamline fleet operations for businesses and individuals alike, ensuring that every journey is smooth and every destination is reached on time.
                </p>

                <h2 style={{ marginBottom: '20px' }}>Who We Are</h2>
                <p style={{ lineHeight: '1.6', fontSize: '1.1rem', marginBottom: '30px' }}>
                    Founded in 2026 FleetPulse has grown from a small local service to a comprehensive fleet management solution.
                    We combine cutting-edge technology with professional service to deliver an unmatched experience.
                    Our team of experienced drivers and logistics experts work around the clock to keep you moving.
                </p>

                <h2 style={{ marginBottom: '20px' }}>Our Values</h2>
                <ul style={{ lineHeight: '1.6', fontSize: '1.1rem', paddingLeft: '20px' }}>
                    <li style={{ marginBottom: '10px' }}><strong>Safety First:</strong> We prioritize the safety of our passengers and drivers above all else.</li>
                    <li style={{ marginBottom: '10px' }}><strong>Reliability:</strong> You can count on us to be there when you need us.</li>
                    <li style={{ marginBottom: '10px' }}><strong>Innovation:</strong> We continuously improve our technology to better serve our customers.</li>
                    <li style={{ marginBottom: '10px' }}><strong>Customer Centrism:</strong> Your satisfaction is our driving force.</li>
                </ul>
            </div>
        </div>
    );
};

export default About;
