import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const [role, setRole] = useState('user'); // 'user' or 'driver'
    const { registerUser, registerDriver } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        // Driver fields
        licenseNumber: '',
        licenseExpiryDate: '',
        experienceYears: 0,
        monthlySalary: 0.01
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user types
        if (fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
        }
    };

    const validateForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^\d{10}$/;
        const nameRegex = /^[A-Za-z]+$/;

        if (!emailRegex.test(formData.email)) {
            errors.email = "Email is invalid";
        }
        if (!mobileRegex.test(formData.phoneNumber)) {
            errors.phoneNumber = "Mobile number must be exactly 10 digits and numeric only";
        }
        if (!nameRegex.test(formData.firstName)) {
            errors.firstName = "First name must contain only alphabets";
        }
        if (!nameRegex.test(formData.lastName)) {
            errors.lastName = "Last name must contain only alphabets";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }


        try {
            if (role === 'driver') {
                // Driver DTO mapping
                const driverData = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    phoneNumber: formData.phoneNumber,
                    licenseNumber: formData.licenseNumber,
                    licenseExpiryDate: formData.licenseExpiryDate,
                    experienceYears: parseInt(formData.experienceYears),
                    monthlySalary: parseFloat(formData.monthlySalary)
                };
                await registerDriver(driverData);
            } else {
                // User DTO mapping
                const userData = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    phoneNumber: formData.phoneNumber,
                    role: 'CUSTOMER'
                };
                await registerUser(userData);
            }
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data || err.message || 'Registration failed';
            setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px 0' }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--primary-color)' }}>Register</h2>
                {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '10px' }}>
                    <button
                        type="button"
                        className={`btn ${role === 'user' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setRole('user')}
                    >
                        User
                    </button>
                    <button
                        type="button"
                        className={`btn ${role === 'driver' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setRole('driver')}
                    >
                        Driver
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>First Name</label>
                            <input name="firstName" onChange={handleChange} required type="text" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)' }} />
                            {fieldErrors.firstName && <span style={{ color: 'red', fontSize: '12px' }}>{fieldErrors.firstName}</span>}
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Last Name</label>
                            <input name="lastName" onChange={handleChange} required type="text" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)' }} />
                            {fieldErrors.lastName && <span style={{ color: 'red', fontSize: '12px' }}>{fieldErrors.lastName}</span>}
                        </div>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                        <input name="email" onChange={handleChange} required type="email" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)' }} />
                        {fieldErrors.email && <span style={{ color: 'red', fontSize: '12px' }}>{fieldErrors.email}</span>}
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Phone Number</label>
                        <input name="phoneNumber" onChange={handleChange} required type="text" maxLength="10" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)' }} />
                        {fieldErrors.phoneNumber && <span style={{ color: 'red', fontSize: '12px' }}>{fieldErrors.phoneNumber}</span>}
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                        <input name="password" onChange={handleChange} required type="password" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)' }} />
                    </div>

                    {role === 'driver' && (
                        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                            <h4 style={{ marginBottom: '10px' }}>Driver Details</h4>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>License Number</label>
                                <input name="licenseNumber" onChange={handleChange} required type="text" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)' }} />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>License Expiry Date</label>
                                <input name="licenseExpiryDate" onChange={handleChange} required type="date" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Experience (Yrs)</label>
                                    <input name="experienceYears" onChange={handleChange} required type="number" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Salary ($)</label>
                                    <input name="monthlySalary" onChange={handleChange} required type="number" step="0.01" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Create Account</button>

                    <p style={{ textAlign: 'center', marginTop: '15px' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
