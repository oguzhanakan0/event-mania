import { List, Typography } from 'antd';
import { useEffect, useState, type ReactElement } from 'react';
import EventsLayout from '../components/layout';
import { EventDataType } from '../components/types';
import { getHeaders } from '../components/util';
import EventCard from '../components/widgets/EventCard';
import { API_URL, type NextPageWithLayout } from './_app';
const { Title } = Typography;

const Page: NextPageWithLayout = () => {

    const [loading, setLoading] = useState(false)
    const [myEvents, setMyEvents] = useState<EventDataType[]>([])


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
                setMyEvents(body);
                setLoading(false);
            })
            .finally(() => setLoading(false));
    };


    useEffect(() => {
        loadMyEvents()
    }, []);

    return <>
        <Title level={2}>Calendar 🗓️</Title>

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

    </>
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <EventsLayout children={page} />
    )
}

export default Page