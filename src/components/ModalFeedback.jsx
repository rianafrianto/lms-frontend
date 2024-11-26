import { Modal, Input, Button } from 'antd';
import { CourseContext } from '../context/CourseContext';
import { useContext } from 'react';

const ModalFeedback = () => {
    const {
        isModalOpen,
        setIsModalOpen,
        handleReject,
        feedback,
        setFeedback,
    } = useContext(CourseContext);
    return (
        <>
            <Modal
                title={<span className="font-bold text-lg">Feedback untuk Menolak Kursus</span>}
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                        Batal
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleReject}>
                        Kirim Feedback
                    </Button>,
                ]}
            >
                <p className="text-gray-600 mb-2">
                    Silakan berikan alasan mengapa kursus ini ditolak.
                </p>
                <Input.TextArea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Berikan alasan mengapa kursus ini ditolak"
                    rows={4}
                    className="border-gray-300"
                />
            </Modal>

        </>
    )
}

export default ModalFeedback
