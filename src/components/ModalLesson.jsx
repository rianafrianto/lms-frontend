import { Button, Input, Modal, Form, Upload, Spin, Image } from 'antd'
import { useContext, useEffect } from 'react'
import { CourseContext } from '../context/CourseContext'
import Swal from 'sweetalert2'
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";

const ModalLesson = (props) => {
    const { visible, onClose, id } = props
    const {
        typeModal,
        setTypeModal,
        setSelectedLesson,
        selectedLesson,
        loading,
        uploadFile,
        imageUrl,
        setImageUrl,
        submitLesson,
        updateLesson,
        fetchDataLesson
    } = useContext(CourseContext)
    const [form] = Form.useForm();

    const handleFormSubmit = async (values) => {
        typeModal === "Create" ? await submitLesson(values, Number(id)) : await updateLesson(values, Number(id))
        form.resetFields();
        setImageUrl(null);
        onClose();
    }

    const handleClose = () => {
        if (typeModal === "Edit") {
            setTypeModal("Create");
            form.resetFields();
            setSelectedLesson(null)
            setImageUrl(null)
            onClose()
        } else {
            onClose();
        }
    }

    useEffect(() => {
        if (selectedLesson) {
            form.setFieldsValue({
                title: selectedLesson?.title,
                content: selectedLesson?.content,
                media: selectedLesson.mediaUrl,
            });
            setImageUrl(selectedLesson.mediaUrl);
        }
    }, [selectedLesson, form, setImageUrl]);

    return (
        <>
            <Modal
                title={`${typeModal && `${typeModal} Lesson`}`}
                visible={visible}
                onCancel={handleClose}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                    initialValues={{
                        title: "",
                        content: "",
                        mediaUrl: "",
                    }}

                >
                    <Form.Item
                        label="Lesson Title"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the lesson title'
                            }
                        ]}
                    >
                        <Input placeholder='Please input the lesson title' />
                    </Form.Item>
                    <Form.Item
                        label="Lesson Content"
                        name="content"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the lesson content'
                            }
                        ]}
                    >
                        <Input.TextArea placeholder='Please input the lesson content' />
                    </Form.Item>

                    {/* Cover Image */}
                    <div style={{ textAlign: 'center' }}>
                        <Form.Item
                            name="media"
                            label="Lesson Media"
                            rules={[{ required: true, message: "Please upload a lesson media" }]}
                        >
                            {/* Upload Component */}
                            <Upload
                                accept="image/*"
                                listType="text"
                                beforeUpload={(file) => {
                                    const isImage = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
                                    if (!isImage) {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Invalid File Type',
                                            text: 'Only JPG, JPEG, and PNG files are allowed.',
                                        });
                                        return false;
                                    }
                                    uploadFile(file);
                                    return false;
                                }}
                                style={{ width: '100%' }}
                            >
                                <Button
                                    icon={<UploadOutlined />}
                                    disabled={loading}
                                    style={{ width: '100%' }}
                                >
                                    {loading ? 'Uploading...' : 'Upload Cover Image'}
                                </Button>
                            </Upload>

                            {/* Spinner for Loading */}
                            {loading && <Spin style={{ marginTop: 16 }} />}

                            {/* Image Preview */}
                            {imageUrl && (
                                <div style={{ marginTop: 16, textAlign: 'center' }}>
                                    <div style={{ position: 'relative', width: '100%' }}>
                                        {imageUrl && (
                                            <>
                                                <Image
                                                    src={imageUrl}
                                                    alt="Uploaded Cover"
                                                    width="100%"
                                                    height="70%"
                                                    style={{ borderRadius: 8 }}
                                                    preview={true}
                                                />
                                                <DeleteOutlined
                                                    onClick={() => setImageUrl(null)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 10,
                                                        right: 10,
                                                        color:"red",
                                                        fontSize: '24px',
                                                        cursor: 'pointer',
                                                        zIndex: 10,
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className='w-full' disabled={loading}>
                            Submit
                        </Button>

                    </Form.Item>

                </Form>
            </Modal>

        </>
    )
}

export default ModalLesson
