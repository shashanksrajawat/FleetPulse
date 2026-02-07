import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import DriverLayout from '../layouts/DriverLayout';

import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/admin/Dashboard'; // Admin Dashboard
import Vehicles from '../pages/admin/Vehicles';
import UserDashboard from '../pages/user/UserDashboard';
import Drivers from '../pages/admin/Drivers';
import Bookings from '../pages/admin/Bookings';
import UserProfile from '../pages/user/UserProfile';
import DriverDashboard from '../pages/driver/DriverDashboard';
import DriverProfile from '../pages/driver/DriverProfile';
import DriverEarnings from '../pages/driver/DriverEarnings';
const NotFound = () => <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}><h1>404 - Not Found</h1></div>;

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/user/dashboard" element={<UserDashboard />} /> {/* User often shares main layout */}
                <Route path="/user/profile" element={<UserProfile />} />            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="vehicles" element={<Vehicles />} />
                <Route path="drivers" element={<Drivers />} />
                <Route path="bookings" element={<Bookings />} />
            </Route>

            {/* Driver Routes */}
            <Route path="/driver" element={<DriverLayout />}>
                <Route index element={<DriverDashboard />} />
                <Route path="profile" element={<DriverProfile />} />
                <Route path="earnings" element={<DriverEarnings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
