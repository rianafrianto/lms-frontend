import React from 'react';
import { Navigate } from 'react-router-dom';

const GuestRoute = ({ user, children }) => {
    if (user) {
        // Jika sudah login, arahkan pengguna ke dashboard sesuai role mereka
        if (user.role === 'admin') {
            return <Navigate to="/admin-dashboard" replace />;
        } else {
            return <Navigate to="/user-dashboard" replace />;
        }
    }

    // Jika tidak ada user, render halaman anak (Login/Register)
    return children;
};

export default GuestRoute;
