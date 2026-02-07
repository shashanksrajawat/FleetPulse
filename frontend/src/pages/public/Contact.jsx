import React, { useState } from 'react';

const Contact = () => {
    const [showModal, setShowModal] = useState(false);

    const handleEmailClick = () => {
        window.location.href = 'mailto:support@fleetmanager.com';
    };

    const handleCustomerCareClick = () => {
        setShowModal(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for contacting us! We will get back to you shortly.');
        setShowModal(false);
    };

    return (
        <div className="container" style={{ padding: '50px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={{ color: 'var(--primary-color)' }}>Contact Us</h1>
                <p style={{ marginTop: '20px', fontSize: '1.2rem', color: 'var(--text-light)' }}>
                    We are here to help. Reach out to us for any queries or support.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {/* Contact Info Card */}
                <div
                    className="card"
                    style={{ padding: '40px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
                    onClick={handleCustomerCareClick}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <h3 style={{ marginBottom: '20px', color: 'var(--secondary-color)' }}>Customer Care</h3>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '10px' }}>
                        +1 (800) 123-4567
                    </p>
                    <p style={{ color: '#666' }}>Available 24/7 for booking assistance and support. Click to message.</p>
                </div>

                {/* Email Support Card */}
                <div
                    className="card"
                    style={{ padding: '40px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
                    onClick={handleEmailClick}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <h3 style={{ marginBottom: '20px', color: 'var(--secondary-color)' }}>Email Support</h3>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '10px' }}>
                        support@fleetmanager.com
                    </p>
                    <p style={{ color: '#666' }}>Send us an email and we'll reply within 24 hours.</p>
                </div>

                {/* Office Address */}
                <div className="card" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
                    <h3 style={{ marginBottom: '20px', color: 'var(--secondary-color)' }}>Main Office</h3>
                    <p style={{ fontSize: '1.1rem', marginBottom: '5px' }}>
                        CDAC, Pune
                    </p>
                    <p style={{ fontSize: '1.1rem' }}>
                        Maharashtra, India
                    </p>
                </div>
            </div>

            {/* Contact Form Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '8px',
                        width: '90%',
                        maxWidth: '500px',
                        position: 'relative',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <button
                            onClick={() => setShowModal(false)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '15px',
                                background: 'none',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                color: '#666'
                            }}
                        >
                            &times;
                        </button>
                        <h2 style={{ marginBottom: '20px', color: 'var(--primary-color)', textAlign: 'center' }}>Contact Customer Care</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Name</label>
                                <input
                                    type="text"
                                    required
                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                                <input
                                    type="email"
                                    required
                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Message</label>
                                <textarea
                                    rows="4"
                                    required
                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contact;
