import { Modal, Button, Typography, Tag, Collapse, Table, Image } from 'antd';
import { useContext } from 'react';
import { CourseContext } from '../context/CourseContext';

const { Panel } = Collapse;

const ModalDetail = () => {
    const {
        handleModalClose,
        isDetailModal,
        setIsDetailModal,
        detailCourse,
    } = useContext(CourseContext);

    return (
        <Modal
            title={<span className="font-bold text-lg">Detail Course</span>}
            visible={isDetailModal}
            onCancel={() => setIsDetailModal(false)}
            footer={[
                <Button key="cancel" onClick={handleModalClose}>
                    Tutup
                </Button>,
            ]}
        >
            {detailCourse ? (
                <div className="text-gray-700 space-y-4">
                    {/* Cover Image */}
                    {/* {detailCourse.coverImage && (
                        <div className="mb-4">
                            <Image
                                src={detailCourse.coverImage}
                                alt="Course Cover"
                                className="w-full h-auto border rounded-md"
                                preview={false}
                            />
                        </div>
                    )} */}

                    {/* Course Title */}
                    <div>
                        <Typography.Paragraph>Title: {detailCourse.title}</Typography.Paragraph>
                        <Typography.Paragraph>Description: {detailCourse.description}</Typography.Paragraph>
                        <Typography.Paragraph>Category: {detailCourse.category}</Typography.Paragraph>
                    </div>

                    {/* Status and Feedback */}
                    <div className="border rounded-md p-3 bg-gray-50">
                        <div className="mb-2">
                            <Typography.Text strong>Status:</Typography.Text>{' '}
                            <Tag
                                className='capitalize'
                                color={
                                    detailCourse.status === 'approved'
                                        ? 'green'
                                        : detailCourse.status === 'rejected'
                                            ? 'red'
                                            : 'blue'
                                }
                            >
                                {detailCourse.status || 'Pending'}
                            </Tag>
                        </div>
                        {detailCourse.feedback && (
                            <div>
                                <Typography.Text strong>Feedback:</Typography.Text>
                                <Typography.Paragraph className="italic">
                                    {detailCourse.feedback}
                                </Typography.Paragraph>
                            </div>
                        )}
                    </div>

                    {/* Units with Collapse */}
                    <div>
                        <Typography.Title level={5} className="text-gray-800 mb-2">
                            Detail Units & Lessons
                        </Typography.Title>
                        {detailCourse.units && detailCourse.units.length > 0 ? (
                            <Collapse accordion>
                                {detailCourse.units.map((unit) => (
                                    <Panel
                                        header={
                                            <div className="flex justify-between items-center">
                                                <Typography.Text strong>
                                                    Title Unit : {unit.title}
                                                </Typography.Text>
                                                <Typography.Text type="secondary">
                                                    ({unit.lessons ? unit.lessons.length : 0} Lessons)
                                                </Typography.Text>
                                            </div>
                                        }
                                        key={unit.unit_id}
                                    >
                                        {/* Lessons Table */}
                                        {unit.lessons && unit.lessons.length > 0 ? (
                                            <div>
                                                <span className='text-gray-800 font-semibold'>List Lesson</span>
                                                <Table
                                                    className='mt-3'
                                                    dataSource={unit.lessons.map((lesson, index) => ({
                                                        key: lesson.lesson_id,
                                                        number: index + 1,
                                                        title: lesson.title,
                                                        content: lesson.content || 'Tidak ada konten untuk pelajaran ini',
                                                    }))}
                                                    columns={[
                                                        {
                                                            title: 'No',
                                                            dataIndex: 'number',
                                                            key: 'number',
                                                            width: '10%',
                                                        },
                                                        {
                                                            title: 'Title',
                                                            dataIndex: 'title',
                                                            key: 'title',
                                                        },
                                                        {
                                                            title: 'Content',
                                                            dataIndex: 'content',
                                                            key: 'content',
                                                        },
                                                    ]}
                                                    pagination={false}
                                                    bordered
                                                />
                                            </div>
                                        ) : (
                                            <Typography.Text type="secondary">
                                                Tidak ada lesson dalam unit ini.
                                            </Typography.Text>
                                        )}
                                    </Panel>
                                ))}
                            </Collapse>
                        ) : (
                            <Typography.Text type="secondary">
                                Tidak ada unit untuk course ini.
                            </Typography.Text>
                        )}
                    </div>
                </div>
            ) : (
                <Typography.Text type="secondary">Detail tidak tersedia.</Typography.Text>
            )}
        </Modal>
    );
};

export default ModalDetail;
