import { Button, Input, Modal, Form } from 'antd'
import { useContext, useEffect } from 'react'
import { CourseContext } from '../context/CourseContext'

const ModalUnit = (props) => {
    const { visible, onClose, id } = props
    const { submitUnit, fetchDataUnit, updateUnit, typeModal, setTypeModal, selectedUnit, setSelectedUnit, loading } = useContext(CourseContext)
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
      typeModal === "Create" ?  await submitUnit(values, Number(id)) : await updateUnit(values)
      form.resetFields()
      await fetchDataUnit(Number(id))
      onClose()
    }

    useEffect(() => {
        if (selectedUnit) {
            form.setFieldsValue({
                title: selectedUnit?.title,
            });
        }
    }, [selectedUnit, form]);

    const handleClose = () => {
        if (typeModal === "Edit") {
            setTypeModal("Create");
            form.resetFields();
            setSelectedUnit(null)
            onClose()
        } else {
            onClose();
        }
    }


    return (
        <>
            <Modal
                title={`${typeModal && `${typeModal} Unit`}`}
                visible={visible}
                onCancel={handleClose}
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
                        <Button type="primary" htmlType="submit" className="w-full" disabled={loading}>
                            Submit
                        </Button>
                    </Form.Item>

                </Form>
            </Modal>

        </>
    )
}

export default ModalUnit
