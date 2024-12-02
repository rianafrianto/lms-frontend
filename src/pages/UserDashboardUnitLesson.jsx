import { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import { Button, Form, Image, Input, Spin, Table } from 'antd'
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined  } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { CourseContext } from '../context/CourseContext';
import ModalLesson from '../components/ModalLesson';
import Swal from 'sweetalert2';

const UserDashboardUnitLesson = () => {
    const {
        navigate,
        dataLesson,
        fetchDataLesson,
        token,
        setTypeModal,
        setSelectedLesson,
        handleDeleteLesson,
        loading,
        tokenInStorage,
        setImageUrl
    } = useContext(CourseContext)
    const { courseId, id } = useParams();

    const [pageSize, setPageSize] = useState(5);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const showModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);
    const [form] = Form.useForm();

    // Filter the data based on the search term
    const filteredData = dataLesson?.filter(lesson =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (tokenInStorage || token ) {
            fetchDataLesson(id)
        }
    }, [token])

    const handleDeleteClick = (lessonId) => {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You won\'t be able to revert this!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            handleDeleteLesson(lessonId).then(() => {
              form.resetFields();
              fetchDataLesson(id)
              setImageUrl(null)
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
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            render: (text) => (
                <span
                className="font-semibold text-gray-700"
                dangerouslySetInnerHTML={{ __html: text }}
            />
            ),
        },
        {
            title: 'Sub Lesson',
            dataIndex: 'sub_lesson',
            key: 'sub_lesson',
            render: (text) => (
                <span className="font-semibold text-gray-700">{text}</span>
            ),
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            render: (text) => (
                <span className="font-semibold text-gray-700">{text}</span>
            ),
        },
        {
            title: 'Content-Type',
            dataIndex: 'content_type',
            key: 'content_type',
            render: (text) => (
                <span className="font-semibold text-gray-700">{text}</span>
            ),
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
            render: (text) => (
                <span className="font-semibold text-gray-700">{text}</span>
            ),
        },
        // {
        //     title: 'Media',
        //     dataIndex: 'mediaUrl',
        //     key: 'mediaUrl',
        //     align: "center",
        //     render: (mediaUrl) => {
        //         if (!mediaUrl) return 'Tidak ada media';

        //         // Cek tipe file dan render sesuai dengan jenisnya
        //         const fileExtension = mediaUrl.split('.').pop().toLowerCase();
        //         if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png' || fileExtension === 'gif') {
        //             // Tampilkan gambar
        //             return <Image src={mediaUrl} alt="Media" style={{ width: '100px', height: 'auto' }} />;
        //         } else if (fileExtension === 'mp4' || fileExtension === 'webm' || fileExtension === 'ogg') {
        //             // Tampilkan video
        //             return (
        //                 <video width="100" height="auto" controls>
        //                     <source src={mediaUrl} type={`video/${fileExtension}`} />
        //                     Your browser does not support the video tag.
        //                 </video>
        //             );
        //         } else if (fileExtension === 'pdf') {
        //             // Tampilkan PDF sebagai link untuk diunduh
        //             return <a href={mediaUrl} target="_blank" rel="noopener noreferrer">Download PDF</a>;
        //         } else {
        //             // Tampilkan link untuk tipe media lainnya
        //             return <a href={mediaUrl} target="_blank" rel="noopener noreferrer">Open Media</a>;
        //         }
        //     },
        // },
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
                            setSelectedLesson(record);
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
                        disabled={dataLesson.length === 1} style={{ cursor: dataLesson.length === 1 ? 'not-allowed' : 'pointer' }}
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
                                Create New Lesson
                            </Button>
                            <Input
                                placeholder="Search Lesson Name"
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
                            onClick={() => navigate(`user-dashboard/unit/${courseId}`)}
                            icon={<ArrowLeftOutlined />}
                        >
                            Back To Unit
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
            <ModalLesson visible={isModalVisible} onClose={closeModal} id={id} form={form} />
        </>
    )
}

export default UserDashboardUnitLesson
