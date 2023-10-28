import { CalendarOutlined, ThunderboltOutlined, UserOutlined } from '@ant-design/icons';
import { Divider, List, Space, Typography } from 'antd';
import Link from 'next/link';
import { useEffect, useState, type ReactElement } from 'react';
import EventsLayout from '../components/layout';
import { EventDataType } from '../components/types';
import { getHeaders } from '../components/util';
import EventCard from '../components/widgets/EventCard';
import { API_URL, type NextPageWithLayout } from './_app';
const { Text, Title } = Typography;

const Page: NextPageWithLayout = () => {

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<EventDataType[]>([])
    const [myEvents, setMyEvents] = useState<EventDataType[]>([])
    const [owningEvents, setOwningEvents] = useState<EventDataType[]>([])
    const [profileData, setProfileData] = useState(null)
    const [profileDataLoading, setProfileDataLoading] = useState(false)

    const loadEvents = (reset?: boolean) => {
        if (loading) return;
        setLoading(true);
        const req = new Request(`${API_URL}/api/home-events/`, {
            method: 'GET',
            headers: getHeaders()
        })
        fetch(req)
            .then((res) => res.json())
            .then((body) => {
                setData(body.results.slice(0, 3));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const loadMyEvents = (reset?: boolean) => {
        if (loading) return;
        setLoading(true);
        const req = new Request(`${API_URL}/api/my-events/`, {
            method: 'GET',
            headers: getHeaders()
        })
        fetch(req)
            .then((res) => res.json())
            .then((body) => {
                setMyEvents(body.slice(0, 3));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const loadOwningEvents = (reset?: boolean) => {
        if (loading) return;
        setLoading(true);
        const req = new Request(`${API_URL}/api/owning-events/`, {
            method: 'GET',
            headers: getHeaders()
        })
        fetch(req)
            .then((res) => res.json())
            .then((body) => {
                setOwningEvents(body.results.slice(0, 3));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const loadProfileData = () => {
        if (loading) return;
        setProfileDataLoading(true);
        const req = new Request(`${API_URL}/api/profile/`, {
            method: 'GET',
            headers: getHeaders()
        })
        fetch(req)
            .then((res) => res.json())
            .then((body) => {
                setProfileData(body);
                setProfileDataLoading(false);
            })
            .catch(() => setProfileDataLoading(false));
    };

    useEffect(() => {
        loadEvents()
        loadMyEvents()
        loadOwningEvents()
        loadProfileData()
    }, []);

    return <>
        <Title level={2}>Hello, <Link href={"/profile"}>{profileData == null ? "" : profileData.first_name}</Link> ✨</Title>
        <Divider orientation="left" orientationMargin={0}>
            <Link href={"/calendar"}>
                <Space size={6}>
                    <CalendarOutlined />
                    Up Next
                </Space>
            </Link>
        </Divider>
        <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={myEvents}
            locale={{ emptyText: 'All clear!' }}
            renderItem={(item) => (
                <List.Item>
                    <EventCard event={item} />
                </List.Item>
            )}
        />
        <Divider orientation="left" orientationMargin={0}>
            <Link href={"/profile"}>
                <Space size={6}>
                    <UserOutlined />
                    Events Created by You
                </Space>
            </Link>
        </Divider>
        <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={owningEvents}
            locale={{ emptyText: 'You did not create any events.' }}
            renderItem={(item) => (
                <List.Item>
                    <EventCard event={item} />
                </List.Item>
            )}
        />
        <Divider orientation="left" orientationMargin={0}>
            <Link href={"/events"}>
                <Space size={6}>
                    <ThunderboltOutlined />
                    Explore Events
                </Space>
            </Link>
        </Divider>
        <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={data}
            locale={{ emptyText: 'Seems like there are no other events.' }}
            renderItem={(item) => (
                <List.Item>
                    <EventCard event={item} />
                </List.Item>
            )}
        />

    </>
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <EventsLayout children={page} />
    )
}

export default Page