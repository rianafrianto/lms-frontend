import { Route, Routes, Navigate } from 'react-router-dom';
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import UserDashboardUnit from './pages/UserDashboardUnit';
import UserDashboardUnitLesson from './pages/UserDashboardUnitLesson';
import LandingPage from './pages/LandingPage';
import NotFound from './components/NotFound';
import { CourseContext } from './context/CourseContext';
import { useContext, useEffect, useState } from 'react';

const App = () => {
    const { user } = useContext(CourseContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timeout);
    }, []);

    if (isLoading) {
        return null;
    }

    const isAuthenticated = !!user; // Check if user is authenticated

    return (
        <Routes>
            {/* Routes for unauthenticated users */}
            {!isAuthenticated && (
                <>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<LandingPage />} />
                </>
            )}

            {/* Redirect authenticated users to their respective dashboard */}
            {isAuthenticated && (
                <>
                    <Route
                        path="/login"
                        element={<Navigate to={user?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'} replace />}
                    />
                    <Route
                        path="/register"
                        element={<Navigate to={user?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'} replace />}
                    />
                    <Route
                        path="/"
                        element={<Navigate to={user?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'} replace />}
                    />
                </>
            )}

            {/* Protected routes for authenticated users */}
            {isAuthenticated && user?.role === 'admin' && (
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
            )}

            {isAuthenticated && user?.role === 'user' && (
                <>
                    <Route path="/user-dashboard" element={<UserDashboard />} />
                    <Route path="/user-dashboard/unit/:id" element={<UserDashboardUnit />} />
                    <Route path="/user-dashboard/unit/:courseId/lesson/:id" element={<UserDashboardUnitLesson />} />
                </>
            )}

            {/* Catch-all for 404 page */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default App;
