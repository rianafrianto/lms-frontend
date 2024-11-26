import { useContext } from "react";
import { Modal, Button, Input, Select, Form, Upload, Spin, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { CourseContext } from "../context/CourseContext";
import Swal from "sweetalert2";

const CourseModal = (props) => {
    const { uploadFile, loading, imageUrl, submitCourse, setImageUrl } = useContext(CourseContext)
    const { visible, onClose } = props;
    const [form] = Form.useForm();

    const handleFormSubmit = async (values) => {
        await submitCourse(values)
        form.resetFields()
        setImageUrl(null)
        onClose()
    };

    return (
        <>
            <Modal
                title="Create New Course"
                visible={visible}
                onCancel={onClose}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                    initialValues={{
                        title: "",
                        description: "",
                        category: "",
                        coverImage: "",
                    }}
                >
                    {/* Title */}
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: "Please enter the course title" }]}
                    >
                        <Input placeholder="Enter course title" />
                    </Form.Item>

                    {/* Description */}
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: "Please enter the course description" }]}
                    >
                        <Input.TextArea placeholder="Enter course description" rows={4} />
                    </Form.Item>

                    {/* Category */}
                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[{ required: true, message: "Please select a category" }]}
                    >
                        <Select placeholder="Select a category" allowClear>
                            <Select.Option value="test category">Test Category</Select.Option>
                            <Select.Option value="programming">Programming</Select.Option>
                            <Select.Option value="design">Design</Select.Option>
                        </Select>
                    </Form.Item>

                    {/* Cover Image */}
                    <div style={{ textAlign: 'center' }}>
                        <Form.Item
                            name="image"
                            label="Cover Image"
                            rules={[
                                { required: true, message: "Please upload a cover image" },
                            ]}
                            style={{ width: '100%' }}
                        >
                            {/* Komponen Upload */}
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

                            {/* Spinner untuk Loading */}
                            {loading && <Spin style={{ marginTop: 16 }} />}

                            {/* Pratinjau Gambar */}
                            {imageUrl && (
                                <div style={{ marginTop: 16, textAlign: 'center' }}>
                                    <Image
                                        src={imageUrl}
                                        alt="Uploaded Cover"
                                        width="100%"
                                        height="70%"
                                        style={{ borderRadius: 8 }}
                                        preview={true}
                                    />
                                </div>
                            )}
                        </Form.Item>
                    </div>


                    {/* Submit Button */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CourseModal;
