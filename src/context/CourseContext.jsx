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
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [imageUrl, setImageUrl] = useState(null)
    const [typeModal, setTypeModal] = useState("Create")
    const [dataUnit, setDataUnit] = useState([])
    const [dataLesson, setDataLesson] = useState([])
    const [selectedLesson, setSelectedLesson] = useState(null);
    const tokenInStorage = localStorage.getItem("token");
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [typeSubLesson, setTypeSubLesson] = useState(false)
    const [dataSubLesson, setDataSubLesson] = useState([])
    const [selectedSubLesson, setSelectedSubLesson] = useState(null);
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
                localStorage.setItem("user", JSON.stringify(user));
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
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.message,
                });
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
        if (tokenInStorage) {
            setToken(tokenInStorage)
            const userData = JSON.parse(atob(tokenInStorage.split('.')[1])); // Decode payload JWT
            setUser(userData);
        }
    }, [token]);

    // useEffect(() => {
    //     if(!token) {
    //         navigate("/register")
    //     }
    // }, [token])

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

    const handleUpdateCourse = async (courseId, status) => {
        try {
            const response = await axios.post(
                `${API_URL}/feature/courses/${courseId}/${status}`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token || tokenInStorage}`,
                    },
                }
            );
            if (response.data.success) {
                setImageUrl(null)
                setSelectedCourse(null)
                setSelectedUnit(null)
                setDataLesson(null)
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.message || 'Course berhasil disetujui.',
                });
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message || 'Course gagal disetujui!',
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
                        Authorization: `Bearer ${token || tokenInStorage}`,
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
            setImageUrl(null)
            setSelectedCourse(null)
            setSelectedUnit(null)
            setDataLesson(null)
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
                    Authorization: `Bearer ${token || tokenInStorage}`,
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
                    Authorization: `Bearer ${token || tokenInStorage}`,
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

        setLoadingUpload(true);
        setError(null);

        const formData = new FormData();
        formData.append('coverImage', file);

        try {
            const response = await axios.post(`${API_URL}/s3/upload-cover-image`, formData, {
                headers: {
                    Authorization: `Bearer ${token || tokenInStorage}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data?.success) {
                setImageUrl(response?.data?.fileUrl)
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.message || 'Cover image uploaded successfully.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || error.message,
            });
        } finally {
            setLoadingUpload(false);
        }
    };

    const submitCourse = async (values) => {
        setLoading(true)
        setError(null)
        try {
            const { image, ...restValues } = values;
            const courseData = {
                ...restValues,
                createdBy: user?.id,
                coverImage: imageUrl
            };
            const response = await axios.post(API_URL + "/feature/courses", courseData, {
                headers: {
                    Authorization: `Bearer ${token || tokenInStorage}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                await fetchDataCourseUser()
                setSelectedCourse(null)
                setSelectedUnit(null)
                setDataLesson(null)
                setImageUrl(null)
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
                        Authorization: `Bearer ${token || tokenInStorage}`,
                    },
                    data: { deleted_by: user?.id },
                }
            );
            if (response.data.success) {
                await fetchDataCourseUser();
                setImageUrl(null)
                setSelectedCourse(null)
                setSelectedUnit(null)
                setDataLesson(null)
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

    const updateCourse = async (values) => {
        setLoading(true)
        setError(null)
        try {
            const { image, ...restValues } = values;
            const courseData = {
                ...restValues,
                createdBy: user?.id,
                coverImage: imageUrl
            };
            const response = await axios.put(API_URL + `/feature/courses/${selectedCourse?.id}`, courseData, {
                headers: {
                    Authorization: `Bearer ${token || tokenInStorage}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                await fetchDataCourseUser()
                setTypeModal("Create")
                setImageUrl(null)
                setSelectedCourse(null)
                setSelectedUnit(null)
                setDataLesson(null)
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

    const fetchDataUnit = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL + `/feature/units/${id}`, {
                headers: {
                    Authorization: `Bearer ${token || tokenInStorage}`,
                },
            });
            if (response.data.success) {
                setDataUnit(response.data.data);
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

    const submitUnit = async (values, id) => {
        setLoading(true)
        setError(null)
        try {

            const response = await axios.post(API_URL + `/feature/courses/${id}`, { title: values?.title }, {
                headers: {
                    Authorization: `Bearer ${token || tokenInStorage}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                setImageUrl(null)
                setSelectedCourse(null)
                setSelectedUnit(null)
                setDataLesson(null)
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

    const handleDeleteUnit = async (unitId) => {
        try {
            const response = await axios.delete(
                `${API_URL}/feature/units/delete/${unitId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token || tokenInStorage}`,
                    },
                    data: { deleted_by: user?.id },
                }
            );
            if (response.data.success) {
                setImageUrl(null)
                setSelectedCourse(null)
                setSelectedUnit(null)
                setDataLesson(null)
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: response.data.message || 'Unit berhasil dihapus!',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unit gagal dihapus!',
            });
        }
    };

    const updateUnit = async (values) => {
        setLoading(true)
        setError(null)
        try {
            const { ...restValues } = values;
            const courseData = {
                ...restValues,
            };
            const response = await axios.put(API_URL + `/feature/units/${selectedUnit?.id}`, courseData, {
                headers: {
                    Authorization: `Bearer ${token || tokenInStorage}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                setTypeModal("Create")
                setSelectedCourse(null)
                setSelectedUnit(null)
                setDataLesson(null)
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

    const fetchDataLesson = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL + `/feature/lesson/${id}`, {
                headers: {
                    Authorization: `Bearer ${token || tokenInStorage}`,
                },
            });
            if (response.data.success) {
                setDataLesson(response.data.data);
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

    const submitLesson = async (values, unitId, lessonId) => {
        setLoading(true)
        setError(null)
        const { media, media_pdf, content_url, ...restValues } = values;
        const courseData = {
            ...restValues,
            mediaUrl: imageUrl || content_url || null
        };
        const url = typeSubLesson ? `/feature/sublesson/${lessonId}` : `/feature/units/${unitId}`
        try {
            const response = await axios.post(API_URL + url, courseData, {
                headers: {
                    Authorization: `Bearer ${token || tokenInStorage}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                await fetchDataLesson(unitId)
                await fetchDataSubLesson()
                setImageUrl(null)
                setSelectedCourse(null)
                setSelectedUnit(null)
                setDataLesson(null)
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

    const updateLesson = async (values, unitId, lessonId) => {
        setLoading(true)
        setError(null)
        const { media, media_pdf, content_url, ...restValues } = values;
        const courseData = {
            ...restValues,
            mediaUrl: imageUrl || content_url || null
        };
        const url = typeSubLesson ? `/feature/sublesson/${lessonId}` : `/feature/lesson/${selectedLesson?.id}`
        try {
            const response = await axios.put(API_URL + url, courseData, {
                headers: {
                    Authorization: `Bearer ${token || tokenInStorage}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                await fetchDataLesson(unitId)
                await fetchDataSubLesson()
                setTypeModal("Create")
                setImageUrl(null)
                setSelectedCourse(null)
                setSelectedLesson(null)
                setSelectedSubLesson(null)
                setSelectedUnit(null)
                setDataLesson(null)
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

    const handleDeleteLesson = async (id) => {
        const url = `/feature/lesson/delete/${id}`
        try {
            const response = await axios.delete(
                API_URL + url,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token || tokenInStorage}`,
                    },
                    data: { deleted_by: user?.id },
                }
            );
            if (response.data.success) {
                setImageUrl(null)
                setSelectedCourse(null)
                setSelectedUnit(null)
                setSelectedLesson(null)
                setSelectedSubLesson(null)
                setDataLesson(null)
                fetchDataSubLesson()
                setTypeSubLesson(false)
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: response.data.message || 'Lesson berhasil dihapus!',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Lesson gagal dihapus!',
            });
        }
    };

    const fetchDataSubLesson = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL + "/feature/sublesson", {
                headers: {
                    Authorization: `Bearer ${token || tokenInStorage}`,
                },
            });
            if (response.data.success) {
                setDataSubLesson(response.data.data);
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

    const handleDeleteSubLesson = async (id) => {
        const url = `/feature/sublesson/delete/${id}`
        try {
            const response = await axios.delete(
                API_URL + url,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token || tokenInStorage}`,
                    },
                    data: { deleted_by: user?.id },
                }
            );
            if (response.data.success) {
                setImageUrl(null)
                setSelectedCourse(null)
                setSelectedUnit(null)
                setSelectedLesson(null)
                setSelectedSubLesson(null)
                setDataLesson(null)
                fetchDataSubLesson()
                setTypeSubLesson(false)
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: response.data.message || 'Lesson berhasil dihapus!',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Lesson gagal dihapus!',
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
        loading, error, dataCourse, fetchDataCourseAdmin, token, handleUpdateCourse, isModalOpen,
        setIsModalOpen, selectedCourse, setSelectedCourse, feedback, setFeedback, handleReject,
        handleOpenDetailModal, handleModalClose, isDetailModal, setIsDetailModal, detailCourse,
        fetchDataCourseUser, dataCourseUser, uploadFile, imageUrl, setImageUrl, submitCourse,
        handleDeleteCourse, typeModal, setTypeModal, updateCourse, fetchDataUnit, dataUnit, setDataUnit,
        submitUnit, handleDeleteUnit, updateUnit, selectedUnit, setSelectedUnit, dataLesson, fetchDataLesson,
        setSelectedLesson, selectedLesson, submitLesson, updateLesson, handleDeleteLesson, tokenInStorage,
        loadingUpload, setLoadingUpload, typeSubLesson, setTypeSubLesson, fetchDataSubLesson, dataSubLesson,
        selectedSubLesson, setSelectedSubLesson, handleDeleteSubLesson, fetchDetailCourse
    }


    return (
        <CourseContext.Provider value={value}>
            {children}
        </CourseContext.Provider>
    )
}