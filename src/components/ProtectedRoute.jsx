import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, user, children }) => {
    if (!user || !allowedRoles.includes(user.role)) {
        // Jika tidak ada user atau role tidak sesuai, redirect ke halaman login atau error page
        return <Navigate to="/login" replace />;
    }

    // Jika user memiliki role yang sesuai, render children (halaman yang diakses)
    return children;
};

export default ProtectedRoute;
