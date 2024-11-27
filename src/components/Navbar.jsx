import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseContext } from '../context/CourseContext';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import { assets } from '../assets/asset';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(CourseContext);

    const handleLogout = () => {
        navigate('/login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const handleBack = () => {
        if(user?.role === "admin") {
            navigate('/admin-dashboard');
        } else {
            navigate('/user-dashboard');
        }
    }

    const menu = (
        <Menu>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                Logout
            </Menu.Item>
        </Menu>
    );


    return (
        <nav className="bg-white flex justify-between items-center p-5 text-black shadow-lg border-b-2 border-gray-200">
            <div className="flex items-center">
                <div className="text-xl font-bold cursor-pointer ml-3">
                    <img src={assets.logo} className="w-20 h-auto" alt="Logo" onClick={handleBack} />
                </div>
            </div>

            <div className="flex items-center space-x-4 mr-5">
                {user && (
                    <Dropdown overlay={menu} trigger={['click', 'hover']}>
                        <div className="flex items-center cursor-pointer space-x-2">
                            <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                <UserOutlined className="text-xl" />
                            </div>
                            <span>Hi, {user?.username}</span>
                        </div>
                    </Dropdown>
                )}
            </div>
        </nav>

    );
};

export default Navbar;
