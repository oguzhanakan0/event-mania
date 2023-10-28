import { Modal, Typography } from "antd";
import { getCookie } from "cookies-next";
import moment from "moment";
import { useState } from "react";
import { API_URL } from "../../pages/_app";
import { delay } from "../util";
const { Text } = Typography;


export default function JoinEventModal({ event, isModalOpen, setSuccess, setIsModalOpen }) {
    const [loading, setLoading] = useState(false)

    const handleOk = () => {
        setLoading(true)
        const req = new Request(
            `${API_URL}/api/events/join/`,
            {
                method: 'POST',
                body: JSON.stringify({ "pk": event.id }),
                headers: {
                    "Authorization": `Token ${getCookie('auth_token')}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
        delay(1000, 1).then(() => fetch(req))
            .then(res => {
                if (res.ok) {
                    setSuccess(true);
                    event.user_count += 1
                    setIsModalOpen(false);
                }
            })
            .then(res => setIsModalOpen(false))
            .finally(() => { setLoading(false) })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return <Modal
        title={`Joining to event happening on ${moment(event.date).format("YYYY-MM-DD")} `}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={"Confirm"}
        confirmLoading={loading}
    >
        <Text>Are you sure you want to join "<strong>{event.title}</strong>"?</Text>
    </Modal>
}