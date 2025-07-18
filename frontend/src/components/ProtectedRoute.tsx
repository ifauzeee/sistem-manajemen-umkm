import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    // Jika ada token, izinkan akses ke halaman. Jika tidak, arahkan ke halaman login.
    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;