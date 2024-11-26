import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseContext } from '../context/CourseContext';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(CourseContext);

    const handleLogout = () => {
        navigate('/login'); 
        localStorage.removeItem('token');
        setUser(null);
    };

    const menu = (
        <Menu>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                Logout
            </Menu.Item>
        </Menu>
    );


    return (
        <nav className="flex justify-between items-center p-5 bg-blue-600 text-white shadow-md">
            <div className="flex items-center">
                {/* Left side: Logo */}
                <div className="text-xl font-bold cursor-pointer ml-5">
                    <span className="text-white">Logo</span>
                </div>
            </div>

            <div className="flex items-center space-x-4 mr-5">
                {user && (
                    <Dropdown overlay={menu} trigger={['click', 'hover']}>
                        <div className="flex items-center cursor-pointer space-x-2">
                            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
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
