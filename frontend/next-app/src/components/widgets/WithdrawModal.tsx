import { Modal, Typography } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";
import { API_URL } from "../../pages/_app";
import { delay, getHeaders } from "../util";
const { Text } = Typography;


export default function WithdrawEvent({ event, isModalOpen, setSuccess, setIsModalOpen }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleOk = () => {
        setLoading(true)
        const req = new Request(
            `${API_URL}/api/events/withdraw/`,
            {
                method: 'POST',
                body: JSON.stringify({ "pk": event.id }),
                headers: getHeaders()
            })
        delay(1000, 1).then(() => fetch(req))
            .then(res => {
                if (res.ok) {
                    setSuccess(true);
                    setIsModalOpen(false);
                    router.reload()
                }
            })
            .then(res => setIsModalOpen(false))
            .finally(() => { setLoading(false) })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return <Modal
        title={`Withdrawing from event happening on ${moment(event.date).format("YYYY-MM-DD")} `}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={"Confirm"}
        confirmLoading={loading}
    >
        <Text>Are you sure you withdraw from event "<strong>{event.title}</strong>"?</Text>
    </Modal>
}