import { useRouter } from 'next/router'
import { CheckCircleTwoTone, ClockCircleOutlined, MinusOutlined, PlusOutlined, SettingOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Divider, Modal, Row, Space, Statistic, Tag, Typography } from 'antd'
import { getCookie } from 'cookies-next'
import moment from 'moment'
import { useEffect, useState, type ReactElement } from 'react'
import UpdateEventForm from '../../components/forms/UpdateEventForm'
import EventsLayout from '../../components/layout'
import { delay, getHeaders } from '../../components/util'
import JoinEventModal from '../../components/widgets/JoinEventModal'
import WithdrawModal from '../../components/widgets/WithdrawModal'
import { API_URL, type NextPageWithLayout } from './../_app'

const { Title, Text } = Typography;

const Page: NextPageWithLayout = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [cancelLoading, setCancelLoading] = useState(false)
    const [event, setEvent] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [cancelClickCount, setCancelClickCount] = useState(0)
    const [cancelSuccess, setCancelSuccess] = useState(false)
    const [isAttendModalOpen, setIsAttendModalOpen] = useState(false)
    const [attendSuccess, setAttendSuccess] = useState(false)
    const showAttendModal = () => setIsAttendModalOpen(true);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
    const [withdrawSuccess, setWithdrawSuccess] = useState(false)
    const showWithdrawModal = () => setIsWithdrawModalOpen(true);

    const handleManageEvent = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleCancelEvent = () => {
        if (cancelClickCount == 0) setCancelClickCount(1)
        else {
            setCancelClickCount(2)
            setCancelLoading(true);
            const req = new Request(
                `${API_URL}/api/events/update/`,
                {
                    method: 'DELETE',
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
                        setCancelSuccess(true);
                        return res.json()
                    } else {
                        throw Error("Could not delete the event.")
                    }
                })
                .then(res => delay(2000, 1).then(() => {
                    router.push(`/home`)
                    setIsModalOpen(false)
                }))
                .catch(() => null)
                .finally(() => { setCancelClickCount(0); setCancelSuccess(false); })
        }
    };

    useEffect(() => {
        if (router.query.id == null) return;
        const req = new Request(
            `${API_URL}/api/events/${router.query.id}/`,
            {
                method: 'GET',
                headers: getHeaders()
            })
        fetch(req)
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    throw Error("Could not delete the event.")
                }
            })
            .then(res => {
                res.date = moment(res.date)
                setEvent(res)
            })
            .catch(error => {
                setEvent(null)
            })
            .finally(() => setLoading(false))
    }, [router.query.id])


    return event == null ? <p></p> : <>
        <Space direction='horizontal'>
            {event.is_creator ?
                <Button onClick={handleManageEvent} icon={<SettingOutlined />}>Manage Event</Button> : <></>}
            {(event.attending || attendSuccess) && <Tag color='green'>You're attending</Tag>}
        </Space>
        <Modal title="Updating Event" open={isModalOpen} footer={null} onCancel={handleCancel} destroyOnClose={true}>
            <UpdateEventForm event={event} setIsModalOpen={setIsModalOpen} />
            <Divider />
            <Space direction='horizontal'>
                <Button loading={cancelLoading} type="primary" danger onClick={handleCancelEvent}>{cancelClickCount == 0 ? "Cancel Event" : cancelClickCount == 1 ? "Confim Cancellation" : "Cancelling"}</Button>
                <Text italic>{cancelClickCount == 0 ? "Sometimes plans change and it's OK!" : cancelClickCount == 1 ? "Click again to confirm." : ""}</Text>
                {cancelSuccess ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : null}
            </Space>
        </Modal>
        <Title>{event.title}</Title>

        <Text>{event.description}</Text>
        <Divider />
        <Row style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Statistic
                title="Date"
                value={event.date.format('YYYY-MM-DD')}
                prefix={<ClockCircleOutlined />}
            />
            <Statistic title="Attendants" value={event.user_count} prefix={<TeamOutlined />} />
            <Statistic title="Created by" value={event.is_creator ? "You" : event.created_by} prefix={<UserOutlined />} />
            {
                (event.attending || attendSuccess) ?
                    <Button danger icon={<MinusOutlined />} onClick={showWithdrawModal}>Withdraw</Button> :
                    <Button icon={<PlusOutlined />} onClick={showAttendModal}>Attend to this event</Button>}
            <JoinEventModal event={event} isModalOpen={isAttendModalOpen} setSuccess={setAttendSuccess} setIsModalOpen={setIsAttendModalOpen} />
            <WithdrawModal event={event} isModalOpen={isWithdrawModalOpen} setSuccess={setWithdrawSuccess} setIsModalOpen={setIsWithdrawModalOpen} />
        </Row>
        <Divider />
        <Text type='secondary'>Event ID: {router.query.id}</Text>
    </>
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <EventsLayout children={page} />
    )
}

export default Page