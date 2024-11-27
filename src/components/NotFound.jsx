import { useContext } from 'react';
import { Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { CourseContext } from '../context/CourseContext';

const NotFound = () => {
    const { user, navigate } = useContext(CourseContext)
    const handleGoBack = () => {
        if (user && user.role === 'admin') {
            navigate('/admin-dashboard');
        } else {
            navigate('/user-dashboard');
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
            <ExclamationCircleOutlined className="icon" />
            <p className="mb-4">Sorry, the page you are looking for does not exist.</p>
            <Button type="primary" onClick={handleGoBack}>
                Go Back
            </Button>
        </div>
    );
};

export default NotFound;