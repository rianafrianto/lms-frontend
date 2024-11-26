import { useContext, useEffect, useState } from 'react';
import { CourseContext } from '../context/CourseContext';
import { Table, Button, Input, Tag, Select } from 'antd';
import Navbar from '../components/Navbar';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import ModalFeedback from '../components/ModalFeedback';
import ModalDetail from '../components/ModalDetail';

const AdminDashboard = () => {
  const {
    dataCourse,
    fetchDataCourseAdmin,
    setIsModalOpen,
    token,
    handleApprove,
    setSelectedCourse,
    handleOpenDetailModal,
  } = useContext(CourseContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [filteredCourses, setFilteredCourses] = useState(dataCourse);
  const [pageSize, setPageSize] = useState(5); // Default to 5 items per page

  // Update filteredCourses when searchTerm, statusFilter, or dataCourse changes
  useEffect(() => {
    setFilteredCourses(
      dataCourse.filter(course => {
        const matchesStatus = statusFilter
          ? course.status === statusFilter
          : true;
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
      })
    );
  }, [searchTerm, statusFilter, dataCourse]);

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
      align: 'center',
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
        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 justify-center">
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
      fetchDataCourseAdmin();
    }
  }, [token]);

  return (
    <>
      <Navbar />

      {/* Wrapper container */}
      <div className="container mx-auto p-10 bg-white shadow-lg rounded-lg max-w-full">

        {/* Gradient header */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-6 shadow-lg rounded-lg mx-auto mb-6 max-w-full">
          <h1 className="text-3xl font-bold text-center sm:text-4xl">Admin Dashboard</h1>
          <div className="w-16 h-1 bg-white mx-auto mt-2 mb-4"></div>
          <p className="text-center text-lg sm:text-xl">
            Manage the courses submitted by users with ease.
          </p>
        </div>

        {/* Filter & Table Section */}
        <div className="shadow-sm rounded-lg p-4 bg-white">
          <div className="flex flex-col sm:flex-row items-center mb-4 gap-4 sm:gap-6">
            <Input
              placeholder="Search Course Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full sm:w-1/3 lg:w-1/4"
              allowClear
            />
            <Select
              placeholder="Filter by Status"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
               className="w-full sm:w-1/3 lg:w-1/4"
              allowClear
            >
              <Select.Option value="approved">Approved</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="rejected">Rejected</Select.Option>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={filteredCourses}
              rowKey="id"
              className="shadow-md rounded-lg overflow-hidden"
              pagination={{
                pageSize: pageSize,
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '20'],
                onShowSizeChange: (current, size) => setPageSize(size),
              }}
            />
          </div>
        </div>

        <ModalFeedback />
        <ModalDetail />
      </div>
    </>
  );
};

export default AdminDashboard;
