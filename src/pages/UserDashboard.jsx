import React, { useState, useContext, useEffect } from 'react';
import { Button, Input, Form, Table, message } from 'antd';
import Swal from 'sweetalert2';
import { CourseContext } from '../context/CourseContext';
import Navbar from '../components/Navbar';
import Header from '../components/Header';

const UserDashboard = () => {
  const { user, dataCourse, fetchDataCourseAdmin } = useContext(CourseContext);
  const [courseDetails, setCourseDetails] = useState({
    name: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!courseDetails.name.trim() || !courseDetails.description.trim()) {
      return Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Nama dan deskripsi kursus tidak boleh kosong.',
      });
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(courseDetails),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Kursus berhasil dibuat.',
        });
        fetchDataCourseAdmin(); // Refresh data setelah menambahkan kursus
        setCourseDetails({ name: '', description: '' }); // Reset form
      } else {
        message.error('Gagal membuat kursus.');
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      title: 'Nama Kursus',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Deskripsi',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <>
      <Navbar />
      <div className='container mx-auto p-10 bg-white shadow-lg rounded-lg max-w-full'>
        <Header type="User" />
      </div>
    </>

  );
};

export default UserDashboard;
