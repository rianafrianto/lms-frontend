import { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import { Input, Button, Table, Spin, Form } from 'antd';
import { CourseContext } from '../context/CourseContext';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import ModalUnit from '../components/ModalUnit';
import Swal from 'sweetalert2';

const UserDashboardUnit = () => {
  const {
    navigate,
    token,
    fetchDataUnit,
    dataUnit,
    handleDeleteUnit,
    setSelectedUnit,
    setTypeModal,
    loading,
    tokenInStorage
  } = useContext(CourseContext)
  const { id } = useParams();
  const [pageSize, setPageSize] = useState(5);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (tokenInStorage || token) {
      fetchDataUnit(id)
    }
  }, [token]);

  // Filter the data based on the search term
  const filteredData = dataUnit?.filter(unit =>
    unit.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (unitId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteUnit(unitId).then(() => {
          form.resetFields();
          fetchDataUnit(id)
        })
      }
    });
  };

  const columns = [
    {
      title: 'Unit Name',
      dataIndex: 'title',
      key: 'name',
      render: (text) => (
        <span className="capitalize font-semibold text-gray-700">{text}</span>
      ),
    },

    {
      title: 'Lesson',
      key: 'lesson',
      align: 'center',
      render: (_, record) => (
        <div className="flex justify-center">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(`/user-dashboard/unit/${record?.course_id}/lesson/${record?.id}`)}
            size="small"
          >
            Create Lesson
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
            icon={<EditOutlined />}
            onClick={() => {
              setTypeModal("Edit");
              setSelectedUnit(record);
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
            onClick={() => handleDeleteClick(record?.id)}
            size="small"
            disabled={dataUnit.length === 1} style={{ cursor: dataUnit.length === 1 ? 'not-allowed' : 'pointer' }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className='container mx-auto p-10 bg-white shadow-lg rounded-lg max-w-full'>
        <Header type="User" />
        <div className="shadow-sm rounded-lg p-4 bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
              <Button
                type="primary"
                className="w-full sm:w-auto lg:w-auto"
                onClick={showModal}
                icon={<PlusOutlined />}
              >
                Create New Unit
              </Button>
              <Input
                placeholder="Search Unit Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-auto lg:w-auto"
                allowClear
                suffix={<SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
              />
            </div>
            <Button
              type="primary"
              className="w-full sm:w-auto lg:w-auto"
              onClick={() => navigate("user-dashboard")}
              icon={<ArrowLeftOutlined />}
            >
              Back To Course
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={filteredData}
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
      <ModalUnit visible={isModalVisible} onClose={closeModal} id={id} form={form} />
    </>
  )
}

export default UserDashboardUnit
