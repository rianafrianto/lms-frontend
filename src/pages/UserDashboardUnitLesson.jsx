import { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import { Button, Image, Input, Table } from 'antd'
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { CourseContext } from '../context/CourseContext';
import ModalLesson from '../components/ModalLesson';

const UserDashboardUnitLesson = () => {
    const { navigate, dataLesson, fetchDataLesson, token } = useContext(CourseContext)
    const { courseId, id } = useParams();

    const [pageSize, setPageSize] = useState(5);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const showModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);

    useEffect(() => {
        if (token) {
            fetchDataLesson(id)
        }
    }, [token])

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
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            render: (text) => (
                <span className="capitalize font-semibold text-gray-700">{text}</span>
            ),
        },
        {
            title: 'Media',
            dataIndex: 'mediaUrl',
            key: 'mediaUrl',
            align:"center",
            render: (mediaUrl) => {
                if (!mediaUrl) return 'Tidak ada media';

                // Cek tipe file dan render sesuai dengan jenisnya
                const fileExtension = mediaUrl.split('.').pop().toLowerCase();
                if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png' || fileExtension === 'gif') {
                    // Tampilkan gambar
                    return <Image src={mediaUrl} alt="Media" style={{ width: '100px', height: 'auto' }} />;
                } else if (fileExtension === 'mp4' || fileExtension === 'webm' || fileExtension === 'ogg') {
                    // Tampilkan video
                    return (
                        <video width="100" height="auto" controls>
                            <source src={mediaUrl} type={`video/${fileExtension}`} />
                            Your browser does not support the video tag.
                        </video>
                    );
                } else if (fileExtension === 'pdf') {
                    // Tampilkan PDF sebagai link untuk diunduh
                    return <a href={mediaUrl} target="_blank" rel="noopener noreferrer">Download PDF</a>;
                } else {
                    // Tampilkan link untuk tipe media lainnya
                    return <a href={mediaUrl} target="_blank" rel="noopener noreferrer">Open Media</a>;
                }
            },
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
                //   setTypeModal("Edit");
                //   setSelectedUnit(record);
                //   setIsModalVisible(true);
                }}
                className="mr-2"
                size="small"
              >
                Edit
              </Button>
              <Button
                type="danger"
                icon={<DeleteOutlined />}
                // onClick={() => handleDeleteClick(record?.id)}
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
                                Create New Lesson
                            </Button>
                            <Input
                                placeholder="Search Lesson Name"
                                // value={searchTerm}
                                // onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-auto lg:w-auto"
                                allowClear
                            />
                        </div>
                        <Button
                            type="primary"
                            className="w-full sm:w-auto lg:w-auto"
                            onClick={() => navigate(`user-dashboard/unit/${courseId}`)}
                            icon={<ArrowLeftOutlined />}
                        >
                            Back To Unit
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <Table
                            columns={columns}
                            dataSource={dataLesson}
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
            <ModalLesson visible={isModalVisible} onClose={closeModal} id={id} />
        </>
    )
}

export default UserDashboardUnitLesson