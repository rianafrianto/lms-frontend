import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { API_URL } from '../config/api';
import Swal from 'sweetalert2';
import { Form, Button, Input, Select } from 'antd';
import { useNavigate } from 'react-router-dom';


export const CourseContext = createContext();
export const CourseProvider = ({ children }) => {
    const [authForm] = Form.useForm();
    const [token, setToken] = useState(null)
    const [dataCourse, setDataCourse] = useState([])
    const [dataCourseUser, setDataCourseUser] = useState([])
    const [detailCourse, setDetailCourse] = useState({})
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModal, setIsDetailModal] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [imageUrl, setImageUrl] = useState(null)
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
            if (response.data.success) {
                navigate('/login');
            }
        } catch (error) {
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
            setToken(token)
            const userData = JSON.parse(atob(token.split('.')[1])); // Decode payload JWT
            setUser(userData);
        }
    }, []);

    useEffect(() => {
        navigate("/register")
    }, [])

    const fetchDataCourseAdmin = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL + "/feature/courses/admin", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setDataCourse(response.data.data);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (courseId) => {
        try {
            const response = await axios.post(
                `${API_URL}/feature/courses/${courseId}/approved`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Course berhasil disetujui.',
            });
            fetchDataCourseAdmin();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Course gagal disetujui!',
            });
        }
    };

    const handleReject = async () => {
        if (!feedback.trim()) {
            return Swal.fire({
                icon: 'warning',
                title: 'Feedback diperlukan',
                text: 'Silakan berikan feedback untuk menolak kursus.',
            });
        }

        try {
            const response = await axios.post(
                `${API_URL}/feature/courses/${selectedCourse.id}/rejected`,
                { feedback },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Course ditolak dan feedback dikirim.',
            });
            setFeedback("")
            fetchDataCourseAdmin();
            setIsModalOpen(false);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Course gagal ditolak!",
            });
        }
    };

    const fetchDetailCourse = async (courseId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL + `/feature/courses/detail/${courseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setDetailCourse(response.data.data);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || error.message,
            });
        } finally {
            setLoading(false);
        }
    }

    const fetchDataCourseUser = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL + `/feature/courses/user/${user?.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setDataCourseUser(response.data.data);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || error.message,
            });
        } finally {
            setLoading(false);
        }
    };


    const uploadFile = async (file) => {
        if (!file) {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'Please select a file to upload.',
            });
            return;
        }

        const formData = new FormData();
        formData.append('coverImage', file);

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_URL}/s3/upload-cover-image`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data?.success) {
                setImageUrl(response?.data?.fileUrl)
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Cover image uploaded successfully.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const submitCourse = async (values) => {
        setLoading(true)
        setError(null)
        try {
            const courseData = {
                ...values,
                createdBy: user?.id,
                coverImage: imageUrl
            };
            const response = await axios.post(API_URL + "/feature/courses", courseData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                await fetchDataCourseUser()
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.message,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCourse = async (courseId) => {
        try {
          const response = await axios.delete(
            `${API_URL}/feature/courses/delete/${courseId}`,
            { 
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              data: { deleted_by: user?.id },
            }
          );
          if (response.data.success) {
            await fetchDataCourseUser();
            Swal.fire({
              icon: 'success',
              title: 'Berhasil',
              text: 'Course berhasil dihapus!',
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Course gagal dihapus!',
          });
        }
      };
      

    const handleOpenDetailModal = (record) => {
        setIsDetailModal(true);
        fetchDetailCourse(record?.id)
    };

    const handleModalClose = () => {
        setIsDetailModal(false);
    };

    const value = {
        authForm, Button, Form, Input, Select, login, navigate, user, setUser, register,
        loading, error, dataCourse, fetchDataCourseAdmin, token, handleApprove, isModalOpen,
        setIsModalOpen, selectedCourse, setSelectedCourse, feedback, setFeedback, handleReject,
        handleOpenDetailModal, handleModalClose, isDetailModal, setIsDetailModal, detailCourse,
        fetchDataCourseUser, dataCourseUser, uploadFile, imageUrl, setImageUrl, submitCourse,
        handleDeleteCourse
    }


    return (
        <CourseContext.Provider value={value}>
            {children}
        </CourseContext.Provider>
    )
}