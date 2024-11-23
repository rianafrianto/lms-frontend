import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { API_URL } from '../config/api';
import Swal from 'sweetalert2';
import { Form, Button, Input, Select } from 'antd';
import { useNavigate } from 'react-router-dom';


export const CourseContext = createContext();
export const CourseProvider = ({ children }) => {
    const [authForm] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate()

    // login 
    const login = async (values) => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.post(API_URL + "/auth/login", values);
            if (response.data.success) {
                const { token, user } = response.data;
                localStorage.setItem("token", token);
                setUser(user);
                if (user.role === 'admin') {
                    navigate('/admin-dashboard');
                } else if (user.role === 'user') {
                    navigate('/user-dashboard');
                }
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || error.message
            });
        } finally {
            setLoading(false);
        }
    };

    // register 
    const register = async (values) => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.post(API_URL + "/auth/register", values);
            console.log(response)
            if (response.data.success) {
                navigate('/login');
            }
        } catch (error) {
            console.error("Register failed:", error.response?.data?.message || error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || error.message
            });
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const userData = JSON.parse(atob(token.split('.')[1])); // Decode payload JWT
            setUser(userData);
        }
    }, []);

    useEffect(() => {
        navigate("/register")
    }, [])


    const value = {
        authForm, Button, Form, Input, Select, login, navigate, user, setUser, register,
        loading, error
    }


    return (
        <CourseContext.Provider value={value}>
            {children}
        </CourseContext.Provider>
    )
}