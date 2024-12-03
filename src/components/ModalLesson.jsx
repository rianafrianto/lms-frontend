import { Button, Input, Modal, Form, Upload, Spin, Image, Select } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { CourseContext } from '../context/CourseContext'
import Swal from 'sweetalert2'
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ModalLesson = (props) => {
    const { visible, onClose, id, form } = props
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
        fetchDataLesson,
        loadingUpload,
        typeSubLesson,
        setSelectedSubLesson,
        selectedSubLesson
    } = useContext(CourseContext)
    // const [form] = Form.useForm();
    const [selectedContentType, setSelectedContentType] = useState(null);

    const handleFormSubmit = async (values) => {
        typeModal === "Create" ? await submitLesson(values, Number(id), Number(selectedLesson?.id)) : await updateLesson(values, Number(id))
        await fetchDataLesson(id)
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
        if (!typeSubLesson && selectedLesson) {
            form.setFieldsValue({
                title: selectedLesson?.title,
                content: selectedLesson?.content,
                media: selectedLesson.mediaUrl,
                content_type: selectedLesson.content_type,
                value: selectedLesson.value,
                position: selectedLesson.position,
            });
            setImageUrl(selectedLesson.mediaUrl);
        } else if (typeSubLesson && selectedSubLesson) {
            form.setFieldsValue({
                title: selectedSubLesson?.title,
                content: selectedSubLesson?.content,
                media: selectedSubLesson.mediaUrl,
                content_type: selectedSubLesson.content_type,
                value: selectedSubLesson.value,
                position: selectedSubLesson.position,
            });
            setImageUrl(selectedSubLesson.mediaUrl);
        }
    }, [selectedLesson, form, setImageUrl, selectedSubLesson]);

    const disabledButtonSubmit = 
    (selectedContentType === 'video' || selectedContentType === 'image' || selectedContentType === 'pdf') 
        ? loadingUpload 
        : loading;

    const title = typeSubLesson ? " Sub Lesson" : " Lesson"
    return (
        <>
            <Modal
                title={typeModal + title}
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
                        value: 0,
                        content: "",
                        position: 0,
                        mediaUrl: "",
                    }}

                >
                    <Form.Item
                        label={title + " Name"}
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the lesson name'
                            }
                        ]}
                    >
                        <Input placeholder='Please input the lesson name' />
                    </Form.Item>
                    <Form.Item
                        label="Value"
                        name="value"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the value'
                            }
                        ]}
                    >
                        <Input placeholder='Please input the value' />
                    </Form.Item>
                    <Form.Item
                        name="content_type"
                        label="Content Type"
                        rules={[{ required: true, message: "Please select a content type" }]}
                    >
                        <Select
                            placeholder="Select a content type"
                            allowClear
                            onChange={(value) => setSelectedContentType(value)}
                        >
                            <Select.Option value="video">Video</Select.Option>
                            <Select.Option value="image">Image</Select.Option>
                            <Select.Option value="h5p">H5P</Select.Option>
                            <Select.Option value="pdf">PDF</Select.Option>
                            <Select.Option value="url">URL</Select.Option>
                            <Select.Option value="gwc">GWC</Select.Option>
                            <Select.Option value="pre game">Pre-Game</Select.Option>
                            <Select.Option value="game result">Game-Result</Select.Option>
                            <Select.Option value="game">Game</Select.Option>
                            <Select.Option value="preliteracy game">Pre Literacy Game</Select.Option>
                        </Select>
                    </Form.Item>


                    {selectedContentType === 'video' && (
                        <Form.Item
                            name="video"
                            label="Upload Video"
                            rules={[{ required: true, message: "Please upload a video file" }]}
                        >
                            <Upload
                                accept="video/*"
                                listType="text"
                                beforeUpload={(file) => {
                                    const isVideo = ['video/mp4', 'video/mkv', 'video/avi', 'video/flv'].includes(file.type);
                                    if (!isVideo) {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Invalid File Type',
                                            text: 'Only MP4, MKV, AVI and FLV video files are allowed.',
                                        });
                                        return false;
                                    }
                                    uploadFile(file);
                                    return false;
                                }}
                            >
                                <Button
                                    icon={<UploadOutlined />}
                                    disabled={loadingUpload}
                                >
                                    {loadingUpload ? 'Uploading In Progress...' : 'Upload Video'}
                                </Button>
                            </Upload>
                        </Form.Item>
                    )}

                    {selectedContentType === 'image' && (
                        <Form.Item
                            name="image"
                            label="Upload Image"
                            rules={[{ required: true, message: "Please upload an image file" }]}
                        >
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
                            >
                                <Button
                                    icon={<UploadOutlined />}
                                    disabled={loading}
                                >
                                    {loading ? 'Uploading In Progress...' : 'Upload Image'}
                                </Button>
                            </Upload>
                        </Form.Item>
                    )}

                    {selectedContentType === 'h5p' && (
                        <Form.Item
                            label="Content URL"
                            name="content_url"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter the content URL'
                                }
                            ]}
                        >
                            <Input placeholder='Please input the content URL' />
                        </Form.Item>
                    )}

                    {selectedContentType === 'pdf' && (
                        <Form.Item
                            name="media_pdf"
                            label="Upload PDF"
                            rules={[{ required: true, message: "Please upload a PDF file" }]}
                        >
                            <Upload
                                accept="application/pdf"
                                listType="text"
                                beforeUpload={(file) => {
                                    if (file.type !== 'application/pdf') {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Invalid File Type',
                                            text: 'Only PDF files are allowed.',
                                        });
                                        return false;
                                    }
                                    uploadFile(file);
                                    return false;
                                }}
                            >
                                <Button icon={<UploadOutlined />}>Upload PDF</Button>
                            </Upload>
                        </Form.Item>
                    )}

                    {selectedContentType === 'url' && (
                        <Form.Item
                            label="Content URL"
                            name="content_url"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter the content URL'
                                }
                            ]}
                        >
                            <Input placeholder='Please input the content URL' />
                        </Form.Item>
                    )}

                    {selectedContentType === 'gwc' && (
                        <Form.Item
                            label="Content URL"
                            name="content_url"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter the content URL'
                                }
                            ]}
                        >
                            <Input placeholder='Please input the content URL' />
                        </Form.Item>
                    )}

                    {selectedContentType === 'game' && (
                        <Form.Item
                            name="game_type"
                            label="Game Type"
                            rules={[{ required: true, message: "Please select a game type" }]}
                        >
                            <Select
                                placeholder="Select a game type"
                                allowClear
                            >
                                <Select.Option value="flash and dash">Flash and Dash</Select.Option>
                                <Select.Option value="visual processing">Visual Processing</Select.Option>
                                <Select.Option value="logic and reasoning">Logic and Reasoning</Select.Option>
                                <Select.Option value="working memory">Working Memory</Select.Option>
                            </Select>
                        </Form.Item>
                    )}

                    {selectedContentType === 'preliteracy game' && (
                        <Form.Item
                            name="game_type"
                            label="Game Type"
                            rules={[{ required: true, message: "Please select a game type" }]}
                        >
                            <Select
                                placeholder="Select a game type"
                                allowClear
                            >
                                <Select.Option value="avatar">Avatar</Select.Option>
                                <Select.Option value="game score">Game Score</Select.Option>
                                <Select.Option value="alliteration 1">Alliteration 1</Select.Option>
                                <Select.Option value="alliteration 2">Alliteration 2</Select.Option>
                                <Select.Option value="alliteration 3">Alliteration 3</Select.Option>
                                <Select.Option value="rhyme 1">Rhyme 1</Select.Option>
                                <Select.Option value="rhyme 2">Rhyme 2</Select.Option>
                                <Select.Option value="rhyme 3">Rhyme 3</Select.Option>
                                <Select.Option value="syllable">Syllable</Select.Option>
                            </Select>
                        </Form.Item>
                    )}

                    <Form.Item
                        label="Position"
                        name="position"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the position'
                            }
                        ]}
                    >
                        <Input placeholder='Please input the position' />
                    </Form.Item>
                    <Form.Item
                        label="Content Information"
                        name="content"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the lesson content'
                            }
                        ]}
                        getValueFromEvent={(value) => value}
                    >
                        {/* <Input.TextArea placeholder='Please input the lesson content' /> */}
                        <ReactQuill
                            theme="snow"
                            placeholder="Please input the lesson content"
                            className="custom-quill"
                        />
                    </Form.Item>

                    {/* Cover Image */}
                    {/* <div style={{ textAlign: 'center' }}>
                        <Form.Item
                            name="media"
                            label="Lesson Media"
                            rules={[{ required: true, message: "Please upload a lesson media" }]}
                        >
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

                            {loading && <Spin style={{ marginTop: 16 }} />}

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
                                                        color: "red",
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
                    </div> */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className='w-full' 
                        disabled={disabledButtonSubmit}
                        >
                            Submit
                        </Button>

                    </Form.Item>

                </Form>
            </Modal>

        </>
    )
}

export default ModalLesson
