import { Route, Routes } from 'react-router-dom';
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import UserDashboardUnit from './pages/UserDashboardUnit';
import { CourseContext } from './context/CourseContext';
import { useContext } from 'react';
import NotFound from './components/NotFound';
import UserDashboardUnitLesson from './pages/UserDashboardUnitLesson';

const App = () => {
    const { user } = useContext(CourseContext);

    return (
        <Routes>
            <Route path="/login" element={
                <Login />
            } />

            <Route path="/register" element={
                <Register />
            } />

            <Route path="/admin-dashboard" element={
                <AdminDashboard />
            } />

            <Route path="/user-dashboard" element={
                <UserDashboard />
            } />

            <Route path="/user-dashboard/unit/:id" element={
                <UserDashboardUnit />
            } />

            <Route path="/user-dashboard/unit/:courseId/lesson/:id" element={
                <UserDashboardUnitLesson />
            } />

            {/* Halaman 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default App;
