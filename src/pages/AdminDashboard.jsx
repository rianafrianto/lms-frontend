import { useContext, useEffect, useState } from 'react';
import { CourseContext } from '../context/CourseContext';
import { Table, Button, Input, Tag, Select } from 'antd';
import Navbar from '../components/Navbar';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import ModalFeedback from '../components/ModalFeedback';
import ModalDetail from '../components/ModalDetail';
import Header from '../components/Header';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const {
    dataCourse,
    fetchDataCourseAdmin,
    setIsModalOpen,
    token,
    handleUpdateCourse,
    setSelectedCourse,
    handleOpenDetailModal,
  } = useContext(CourseContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [filteredCourses, setFilteredCourses] = useState(dataCourse);
  const [pageSize, setPageSize] = useState(5); // Default to 5 items per page

  useEffect(() => {
    if (token) {
      fetchDataCourseAdmin();
    }
  }, [token]);

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

  const handleConfirmation = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Kindly confirm, do you wish to approve this course?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpdateCourse(id, "approved").then(()=>{
          fetchDataCourseAdmin()
        })
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
      title: 'Owner',
      dataIndex: 'created_name',
      key: 'created_name',
      render: (text) => (
        <span className="capitalize text-sm font-medium text-gray-600">{text}</span>
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
            onClick={() => handleConfirmation(record.id)}
            className="mr-2"
            size="small"
            disabled={record?.status === "approved"}
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
            disabled={record?.status === "approved"}
          >
            Tolak
          </Button>
        </div>
      ),
    },
  ];

 

  return (
    <>
      <Navbar />

      {/* Wrapper container */}
      <div className="container mx-auto p-10 bg-white shadow-lg rounded-lg max-w-full">

        <Header type="Admin" />

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
