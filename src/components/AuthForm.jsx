import React, { useContext } from 'react';
import { CourseContext } from '../context/CourseContext';
import { assets } from '../assets/asset';

const AuthForm = (props) => {
    const { Button, Form, Input, Select, login, navigate, register } = useContext(CourseContext);
    const { type } = props;

    const onFinish = async (values) => {
        try {
            if (type === "Login") {
                await login(values)
            } else {
                await register(values)
            }
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Bagian Kiri: Form */}
            <div className="w-1/2 flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg  w-96">
                    <h2 className="text-2xl font-bold mb-6">{type}</h2>
                    <Form layout="vertical" onFinish={onFinish}>
                        {type === "Register" && (
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[{ required: true, message: "Please enter your username!" }]}
                            >
                                <Input placeholder="Enter your username" />
                            </Form.Item>
                        )}
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: "Please enter your email!" }]}
                        >
                            <Input type="email" placeholder="Enter your email" />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: "Please enter your password!" }]}
                        >
                            <Input.Password placeholder="Enter your password" />
                        </Form.Item>

                        {type === "Register" && (
                            <Form.Item
                                label="Role"
                                name="role"
                                rules={[{ required: true, message: "Please Select Role!" }]}
                            >
                                <Select
                                    options={[
                                        { value: 'admin', label: 'Admin' },
                                        { value: 'user', label: 'User' },
                                    ]}
                                    placeholder="Select Role"
                                />
                            </Form.Item>
                        )}

                        <Button type="primary" htmlType="submit" block>
                            {type}
                        </Button>
                    </Form>
                    <div className="mt-4 text-center">
                        {type === "Register" ? (
                            <p className="text-sm">
                                Have an account?{' '}
                                <span onClick={() => navigate('/login')} className="text-blue-500 hover:underline cursor-pointer">
                                    Login
                                </span>
                            </p>
                        ) : (
                            <p className="text-sm">
                                Don’t have an account?{' '}
                                <span onClick={() => navigate('/register')} className="text-blue-500 hover:underline cursor-pointer">
                                    Create Account
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Bagian Kanan: Gambar */}
            <div className="w-1/2 flex items-center justify-center">
                <img
                    src={assets.backgroundAuth}
                    alt="Learning Illustration"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default AuthForm;
