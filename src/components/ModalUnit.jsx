import { Button, Input, Modal, Form } from 'antd'
import { useContext } from 'react'
import { CourseContext } from '../context/CourseContext'

const ModalUnit = (props) => {

    const { visible, onClose, id } = props
    const { submitUnit, fetchDataUnit } = useContext(CourseContext)
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        await submitUnit(values, Number(id))
        onClose()
        await fetchDataUnit(Number(id))
        form.resetFields()
    }
    return (
        <>
            <Modal
                title={<span className="font-bold text-lg">Create Unit For This Course</span>}
                visible={visible}
                onCancel={onClose}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        title: ""
                    }}
                >
                    <Form.Item
                        name="title"
                        label="Unit Title"
                        rules={[{ required: true, message: "Please enter the unit title" }]}
                    >
                        <Input.TextArea
                            placeholder="Enter unit title"
                            rows={4}
                            className="border-gray-300"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full">
                            Submit
                        </Button>
                    </Form.Item>

                </Form>
            </Modal>

        </>
    )
}

export default ModalUnit
