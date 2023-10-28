import { CarryOutTwoTone, ClockCircleOutlined, ExpandOutlined, PlusOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Space, Tooltip, Typography } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import { useState } from 'react';
import JoinEventModal from './JoinEventModal';

const { Text } = Typography;


export default function EventListItem({ event }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [success, setSuccess] = useState(false)
    const showModal = () => setIsModalOpen(true);

    return (
        <Card
            title={<Link href={`/events/${event.id}/`}>{event.title}</Link>}
            style={{ width: "100%" }}
            extra={<Tooltip title="Details"><Link href={`/events/${event.id}/`}><ExpandOutlined /></Link></Tooltip>}
            actions={[
                <Tooltip title={event.attending || success ? "You are attending" : "Join"}>
                    {event.attending || success ? <CarryOutTwoTone twoToneColor="#52c41a" /> : <PlusOutlined onClick={showModal} />}
                </Tooltip>,
            ]}
        >
            <Space direction='vertical'>
                <Space size={12}>
                    <Space size={4}><ClockCircleOutlined style={{ fontSize: "0.8em" }} /><Text type='secondary' style={{ fontSize: "0.8em" }}>{moment(event.date).format("YYYY-MM-DD")}</Text></Space>
                    <Space size={4}><TeamOutlined style={{ fontSize: "0.8em" }} /><Text type='secondary' style={{ fontSize: "0.8em" }}>{event.user_count}</Text></Space>
                    <Space size={4}><UserOutlined style={{ fontSize: "0.8em" }} /><Text type='secondary' style={{ fontSize: "0.8em" }}>{event.created_by}</Text></Space>
                </Space>
                {`${event.description.slice(0, 180)}${event.description.length > 180 ? "..." : ""}`}
            </Space>
            <JoinEventModal event={event} isModalOpen={isModalOpen} setSuccess={setSuccess} setIsModalOpen={setIsModalOpen} />

        </Card>
    );
}