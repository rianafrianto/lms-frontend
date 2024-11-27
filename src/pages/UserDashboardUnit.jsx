import { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import { Input, Button, Table } from 'antd';
import { CourseContext } from '../context/CourseContext';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import ModalUnit from '../components/ModalUnit';
import Swal from 'sweetalert2';
const UserDashboardUnit = () => {
  const { navigate, token, fetchDataUnit, dataUnit, handleDeleteUnit } = useContext(CourseContext)
  const { id } = useParams();
  const [pageSize, setPageSize] = useState(5);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  useEffect(() => {
    if (token) {
      fetchDataUnit(id)
    }
  }, [token])

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
            // onClick={() => navigate("/user-dashboard/unit")}
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
              console.log(record)

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
        <div className="shadow-sm rounded-lg p-4 bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
              <Button
                type="primary"
                className="w-full sm:w-auto lg:w-auto"
                onClick={showModal}
                icon={<PlusOutlined />}
              >
                Create Unit
              </Button>
              <Input
                placeholder="Search Unit Name"
                // value={searchTerm}
                // onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-auto lg:w-auto"
                allowClear
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
              dataSource={dataUnit}
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
      <ModalUnit visible={isModalVisible} onClose={closeModal} id={id} />
    </>
  )
}

export default UserDashboardUnit
