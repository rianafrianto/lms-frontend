import { useContext, useEffect, useState } from 'react';
import { CourseContext } from '../context/CourseContext';
import { Table, Button, Modal, Input, Tag } from 'antd';
import Navbar from '../components/Navbar';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import ModalFeedback from '../components/ModalFeedback';
import ModalDetail from '../components/ModalDetail';

const AdminDashboard = () => {
  const {
    dataCourse,
    fetchDataCourse,
    setIsModalOpen,
    token,
    handleApprove,
    setSelectedCourse,
    handleOpenDetailModal,
  } = useContext(CourseContext);

  const columns = [
    {
      title: 'Course Name',
      dataIndex: 'title',
      key: 'name',
      render: (text) => (
        <span className="font-semibold text-gray-700">{text}</span>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (text) => (
        <span className="font-semibold text-gray-700">{text}</span>
      ),
    },
    {
      title: 'Owner',
      dataIndex: 'created_name',
      key: 'created_name',
      render: (text) => (
        <span className="text-sm font-medium text-gray-600">{text}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag
          color={status === 'approved' ? 'green' : status === 'pending' ? 'blue' : 'red'}
          className="capitalize text-xs font-semibold"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Detail',
      key: 'detail',
      align: 'center',
      render: (_, record) => (
        <div className="flex justify-center">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleOpenDetailModal(record)}
            className="text-gray-600"
          >
            Detail
          </Button>
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (text, record) => (
        <div className="flex justify-center space-x-2">
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record.id)}
            className="mr-2"
            size="small"
          >
            Setujui
          </Button>
          <Button
            type="danger"
            icon={<CloseOutlined />}
            onClick={() => {
              setSelectedCourse(record);
              setIsModalOpen(true);
            }}
            size="small"
          >
            Tolak
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (token) {
      fetchDataCourse();
    }
  }, [token]);

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-6 shadow-lg rounded-lg mx-auto max-w-screen-xl w-full mt-6">
        <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>
        <div className="w-16 h-1 bg-white mx-auto mt-2 mb-4"></div>
        <p className="text-center text-lg">
          Kelola kursus yang diajukan oleh instruktur dengan mudah.
        </p>
      </div>

      <div className="container mx-auto mt-6 max-w-screen-xl w-full p-4 bg-white shadow-lg rounded-lg">
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={dataCourse}
            rowKey="id"
            className="shadow-md rounded-lg overflow-hidden"
          />
        </div>
        <ModalFeedback/>
        <ModalDetail/>
      </div>
    </>
  );
};

export default AdminDashboard;
