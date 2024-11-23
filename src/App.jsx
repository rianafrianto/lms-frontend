import { Route, Routes } from 'react-router-dom';
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import { CourseContext } from './context/CourseContext';
import { useContext } from 'react';
import NotFound from './components/NotFound';

const App = () => {
    const { user } = useContext(CourseContext);
    return (
        <Routes>
            {/* Halaman Login hanya untuk pengguna yang belum login */}
            <Route path="/login" element={
                <GuestRoute user={user}>
                    <Login />
                </GuestRoute>
            } />

            {/* Halaman Register hanya untuk pengguna yang belum login */}
            <Route path="/register" element={
                <GuestRoute user={user}>
                    <Register />
                </GuestRoute>
            } />

            {/* Halaman Admin Dashboard hanya untuk admin */}
            <Route path="/admin-dashboard" element={
                <ProtectedRoute allowedRoles={['admin']} user={user}>
                    <AdminDashboard />
                </ProtectedRoute>
            } />

            {/* Halaman User Dashboard hanya untuk user */}
            <Route path="/user-dashboard" element={
                <ProtectedRoute allowedRoles={['user']} user={user}>
                    <UserDashboard />
                </ProtectedRoute>
            } />

            <Route path="*" element={
                <NotFound />
            } />
        </Routes>
    )
}

export default App