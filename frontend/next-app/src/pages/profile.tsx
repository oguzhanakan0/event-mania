import type { TabsProps } from 'antd';
import { List, Tabs, Typography } from 'antd';
import { useEffect, useState, type ReactElement } from 'react';
import EventsLayout from '../components/layout';
import { EventDataType } from '../components/types';
import { getHeaders } from '../components/util';
import EventCard from '../components/widgets/EventCard';
import ProfileWidget from '../components/widgets/ProfileWidget';
import { API_URL, type NextPageWithLayout } from './_app';

const { Title } = Typography;

const Page: NextPageWithLayout = () => {
    const [loading, setLoading] = useState(false)
    const [owningEvents, setOwningEvents] = useState<EventDataType[]>([])

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
                setOwningEvents(body.results);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };


    useEffect(() => {
        loadOwningEvents()
    }, []);


    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Information',
            children: <ProfileWidget />,
        },
        {
            key: '2',
            label: 'Your Events',
            children: <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={owningEvents}
                locale={{ emptyText: 'You did not create any events.' }}
                renderItem={(item) => (
                    <List.Item>
                        <EventCard event={item} />
                    </List.Item>
                )}
            />,
        },
    ];

    return <>
        <Title level={2}>Profile 🐤</Title>
        <Tabs defaultActiveKey="1" items={items} />
    </>
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <EventsLayout children={page} />
    )
}

export default Page