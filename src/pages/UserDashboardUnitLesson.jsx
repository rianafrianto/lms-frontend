import { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import { Button, Form, Input, Spin, Table, Row, Col, Modal } from 'antd'
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, RightOutlined, DownOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { CourseContext } from '../context/CourseContext';
import ModalLesson from '../components/ModalLesson';
import Swal from 'sweetalert2';

const UserDashboardUnitLesson = () => {
    const {
        navigate,
        dataLesson = [],
        fetchDataLesson,
        token,
        setTypeModal,
        setSelectedLesson,
        handleDeleteLesson,
        loading,
        tokenInStorage,
        setImageUrl,
        setTypeSubLesson,
        fetchDataSubLesson,
        dataSubLesson = [],
        setSelectedSubLesson,
        handleDeleteSubLesson
    } = useContext(CourseContext)
    
    const { courseId, id } = useParams();
    const [expandedRows, setExpandedRows] = useState([]);
    const [pageSize, setPageSize] = useState(5);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const showModal = () => setIsModalVisible(true);
    const closeModal = () => {
        setIsModalVisible(false);
        setTypeSubLesson(false)
        setSelectedLesson(null)
        setSelectedSubLesson(null)
    };
    const [form] = Form.useForm();

    // Filtered data based on search term
    const filteredData = dataLesson?.filter(lesson =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Fetch data when the component mounts or token changes
    useEffect(() => {
        if (tokenInStorage || token) {
            fetchDataLesson(id)
            fetchDataSubLesson()
        }
    }, [token]);

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
                    fetchDataLesson(id)
                    setImageUrl(null)
                })
            }
        });
    };

    const handleDeleteSubClick = (subLessonId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteSubLesson(subLessonId).then(() => {
                    fetchDataLesson(id)
                    fetchDataSubLesson()
                    setImageUrl(null)
                })
            }
        });
    };

    const columns = [
        {
            title: 'Lesson Name',
            dataIndex: 'title',
            key: 'name',
            render: (text, record) => (
                <span className="capitalize font-semibold text-gray-700"
                    onClick={() => handleExpandClick(record?.id)}
                >
                    {text}
                </span>
            )
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
            title: 'Content Type',
            dataIndex: 'content_type',
            key: 'content_type',
            render: (text) => (
                <span className="capitalize font-semibold text-gray-700">{text}</span>
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
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (text, record) => (
                <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 justify-center">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            showModal();
                            setTypeSubLesson(true)
                            setSelectedLesson(record)
                        }}
                        size="small"
                    >
                        Create Sub Lesson
                    </Button>
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

    const handleExpandClick = (key) => {
        setExpandedRows((prev) => {
            if (prev.includes(key)) {
                // Menghapus key jika sudah ada dalam expandedRows
                return prev.filter((rowKey) => rowKey !== key);
            } else {
                // Menambahkan key untuk memperluas baris
                return [...prev, key];
            }
        });
    };


    const expandedRowRender = (record) => {
        // Filter dataSubLesson berdasarkan lesson_id yang sama dengan record.id
        const relatedSubLessons = dataSubLesson.filter(subLesson => subLesson.lesson_id === record.id);

        const columns = [
            {
                title: 'Sub Lesson Name',
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: 'Value',
                dataIndex: 'value',
                key: 'value',
            },
            {
                title: 'Content Type',
                dataIndex: 'content_type',
                key: 'content_type',
                render: (text) => (
                    <span className="capitalize font-semibold text-gray-700">{text}</span>
                ),
            },
            {
                title: 'Position',
                dataIndex: 'position',
                key: 'position',
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
                                setSelectedSubLesson(record);
                                setIsModalVisible(true);
                                setTypeSubLesson(true)
                            }}
                            className="mr-2"
                            size="small"
                        >
                            Edit
                        </Button>
                        <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                            onClick={() => 
                                handleDeleteSubClick(record?.id)
                            }
                            size="small"
                        >
                            Delete
                        </Button>
                    </div>
                ),
            },
        ];

        return expandedRows.includes(record?.id) ? (
            <Row>
                <Col span={24}>
                    <div className="bg-gray-100 p-4 mt-2 rounded-lg">
                        {/* <h4 className="font-semibold mb-4">Sub Lesson Details:</h4> */}
                        {relatedSubLessons.length > 0 ? (
                            <Table
                                dataSource={relatedSubLessons}
                                columns={columns}
                                rowKey="id"
                                pagination={false}
                            />
                        ) : (
                            <p>No sub-lessons available.</p>
                        )}
                    </div>
                </Col>
            </Row>
        ) : null;
    };


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
                            expandedRowRender={expandedRowRender} // Gunakan expandedRowRender untuk konten yang diperluas
                            expandedRowKeys={expandedRows} // Tentukan baris mana yang diperluas
                            onExpand={(expanded, record) => handleExpandClick(record.id)} // Menangani ekspansi saat baris diperluas
                        />
                    </div>
                </div>
            </div>
            <ModalLesson visible={isModalVisible} onClose={closeModal} id={id} form={form} />
        </>
    )
}

export default UserDashboardUnitLesson;
