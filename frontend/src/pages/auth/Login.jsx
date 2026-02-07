import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(email, password);

            // Redirect based on state or role
            if (location.state && location.state.from) {
                navigate(location.state.from, { state: location.state });
            } else {
                if (user.role === 'ADMIN') navigate('/admin');
                else if (user.role === 'DRIVER') navigate('/driver');
                else navigate('/user/dashboard');
            }

        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--primary-color)' }}>Login</h2>
                {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)' }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)' }}
                        />
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%' }}>Sign In</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '15px' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)' }}>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
