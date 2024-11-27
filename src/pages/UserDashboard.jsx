import { useState, useContext, useEffect } from 'react';
import { Button, Input, Form, Table, message, Select, Tag } from 'antd';
import Swal from 'sweetalert2';
import { CourseContext } from '../context/CourseContext';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import CourseModal from '../components/CourseModal';
import ModalDetail from '../components/ModalDetail';

const UserDashboard = () => {
  const { 
    fetchDataCourseUser, 
    token, 
    dataCourseUser, 
    handleDeleteCourse, 
    setSelectedCourse, 
    setTypeModal,
    handleOpenDetailModal,
    navigate
  } = useContext(CourseContext);
    
  const [pageSize, setPageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [filteredCourses, setFilteredCourses] = useState(dataCourseUser);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  useEffect(() => {
    setFilteredCourses(
      dataCourseUser.filter(course => {
        const matchesStatus = statusFilter
          ? course.status === statusFilter
          : true;
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
      })
    );
  }, [searchTerm, statusFilter, dataCourseUser]);

  useEffect(() => {
    if (token) {
      fetchDataCourseUser()
    }
  }, [token])

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteCourse(id);
      }
    });
  };

  const columns = [
    {
      title: 'Course Name',
      dataIndex: 'title',
      key: 'name',
      render: (text) => (
        <span className="capitalize font-semibold text-gray-700">{text}</span>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (text) => (
        <span className="capitalize font-semibold text-gray-700">{text}</span>
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
            size="small"
          >
            Detail
          </Button>
        </div>
      ),
    },
    {
      title: 'Unit',
      key: 'unit',
      align: 'center',
      render: (_, record) => (
        <div className="flex justify-center">
         <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/user-dashboard-unit")}
            size="small"
          >
            Create Unit
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
            // onClick={() => handleApprove(record.id)}
            className="mr-2"
            size="small"
          >
            Submit
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setTypeModal("Edit")
              setSelectedCourse(record);
              setIsModalVisible(true);
            }}
            className="mr-2"
            size="small"
          >
            Edit
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteClick(record.id)}
            size="small"
          >
            Delete
          </Button>
          
        </div>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <div className='container mx-auto p-10 bg-white shadow-lg rounded-lg max-w-full'>
        <Header type="User" />
        {/* Filter & Table Section */}
        <div className="shadow-sm rounded-lg p-4 bg-white">
          <div className="flex flex-col sm:flex-row items-center mb-4 gap-4 sm:gap-6">
            <Button
              type="primary"
              className="w-full sm:w-auto lg:w-auto"
              onClick={showModal}
              icon={<PlusOutlined />}
            >
              Create New Course
            </Button>
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
      </div>
      <CourseModal visible={isModalVisible} onClose={closeModal} />
      <ModalDetail />
    </>

  );
};

export default UserDashboard;
