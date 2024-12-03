import { Button, Input, Modal, Form, Upload, Spin, Image, Select } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { CourseContext } from '../context/CourseContext'
import Swal from 'sweetalert2'
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import MediaDisplay from './MediaDisplay';

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

    const [selectedContentType, setSelectedContentType] = useState(null);

    const handleFormSubmit = async (values) => {
        typeModal === "Create" ? await submitLesson(values, Number(id), Number(selectedLesson?.id)) : await updateLesson(values, Number(id), Number(selectedSubLesson?.id))
        await fetchDataLesson(id)
        form.resetFields();
        setImageUrl(null);
        setSelectedContentType(null)
        // onClose()
        handleClose();
    }

    const handleClose = () => {
        if (typeModal === "Edit") {
            setTypeModal("Create");
            form.resetFields();
            setSelectedLesson(null)
            setSelectedSubLesson(null)
            setImageUrl(null)
            setSelectedContentType(null)
            onClose()
        } else {
            onClose();
            setSelectedContentType(null)
        }
    }

    useEffect(() => {
        const urlLesson = selectedLesson?.content_type === "h5p" ||  selectedLesson?.content_type === "url" ||  selectedLesson?.content_type === "gwc"
        const urlSubLesson = selectedSubLesson?.content_type === "h5p" ||  selectedSubLesson?.content_type === "url" ||  selectedSubLesson?.content_type === "gwc"
        if (!typeSubLesson && selectedLesson) {
            form.setFieldsValue({
                title: selectedLesson?.title,
                content: selectedLesson?.content,
                media: selectedLesson?.mediaUrl || imageUrl,
                content_type: selectedLesson?.content_type,
                value: selectedLesson?.value,
                position: selectedLesson?.position,
                game_type : selectedLesson?.game_type,
                content_url : urlLesson ? selectedLesson?.mediaUrl : null
            });
            setImageUrl(selectedLesson?.mediaUrl);
            setSelectedContentType(selectedLesson?.content_type);
        } else if (typeSubLesson && selectedSubLesson) {
            form.setFieldsValue({
                title: selectedSubLesson?.title,
                content: selectedSubLesson?.content,
                media: selectedSubLesson?.mediaUrl || imageUrl,
                content_type: selectedSubLesson?.content_type,
                value: selectedSubLesson?.value,
                position: selectedSubLesson?.position,
                game_type : selectedSubLesson?.game_type,
                content_url : urlSubLesson ? selectedSubLesson?.mediaUrl : null
            });
            setSelectedContentType(selectedSubLesson?.content_type);
            setImageUrl(selectedSubLesson?.mediaUrl);
        }
    }, [selectedLesson, form, setImageUrl, selectedSubLesson, setSelectedContentType]);

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
                            name="media"
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

                    {
                        <MediaDisplay
                            mediaType="video"
                            mediaUrl={imageUrl}
                            selectedSubLesson={selectedSubLesson}
                            selectedLesson={selectedLesson}
                            setMediaUrl={setImageUrl} />
                    }

                    {selectedContentType === 'image' && (
                        <Form.Item
                            name="media"
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
                    
                    {
                        <MediaDisplay
                            mediaType="image"
                            mediaUrl={imageUrl}
                            selectedSubLesson={selectedSubLesson}
                            selectedLesson={selectedLesson}
                            setMediaUrl={setImageUrl} />
                    }

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
                            name="media"
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

                    {
                        <MediaDisplay
                        mediaType="pdf"
                        mediaUrl={imageUrl}
                        selectedSubLesson={selectedSubLesson}
                        selectedLesson={selectedLesson}
                        setMediaUrl={setImageUrl}
                      />
                    }

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
