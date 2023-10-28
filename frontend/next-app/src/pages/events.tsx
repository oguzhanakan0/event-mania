import { Affix, Button, Divider, Input, List, Skeleton, Space, Typography } from 'antd';
import { getCookie } from 'cookies-next';
import { useEffect, useState, type ReactElement } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import EventsLayout from '../components/layout';
import { EventDataType } from '../components/types';
import EventCard from '../components/widgets/EventCard';
import { API_URL, type NextPageWithLayout } from './_app';
const { Text, Title } = Typography;

const Page: NextPageWithLayout = () => {
    const [pageNumber, setPageNumber] = useState(1)
    const [loading, setLoading] = useState(false)
    const [searchString, setSearchString] = useState("")
    const [searchResultText, setSearchResultText] = useState("")
    const [hasMore, setHasMore] = useState(true)
    const [data, setData] = useState<EventDataType[]>([])
    const [totalEvents, setTotalEvents] = useState(0)

    const loadMoreData = (reset?: boolean) => {
        if (loading) return;
        let p = pageNumber
        let d = data
        if (reset) {
            p = 1
            d = []
        }
        setLoading(true);
        const req = new Request(
            `${API_URL}/api/events/?page=${p}&search=${searchString}`,
            {
                method: 'GET',
                headers: { "Authorization": `Token ${getCookie('auth_token')}` }
            })
        fetch(req)
            .then((res) => res.json())
            .then((body) => {
                if (body.next == null) setHasMore(false)
                setData([...d, ...body.results]);
                setLoading(false);
                setPageNumber(p + 1)
                setTotalEvents(body.count)
                if (searchString != "") {
                    setSearchResultText(body.count == 0 ? "Oops.. there is no event matching your search term 😰" : `Found ${body.count} events. Yay! 🥳`)
                } else {
                    setSearchResultText("")
                }
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadMoreData()
    }, []);

    const handleSearch = () => {
        loadMoreData(true)
    }


    return <>
        <Title level={2}>Explore Events 💫</Title>
        <Affix offsetTop={15} style={{ marginBottom: 12 }}>
            <Space.Compact style={{ width: '100%' }} >
                <Input
                    value={searchString}
                    onChange={(event) => setSearchString(event.target.value)}
                    placeholder={`Search to filter for the ones you are interested in 🧏🏽‍♀️`}
                />
                <Button onKeyDown={handleSearch} type="primary" onClick={handleSearch}>Search</Button>
            </Space.Compact>
        </Affix>
        {searchResultText != "" && <Text>{searchResultText}</Text>}
        <Divider />
        <div
            id="scrollableDiv"
            style={{
                height: '80vh',
                overflow: 'auto',
            }}
        >
            <InfiniteScroll
                dataLength={data.length}
                next={loadMoreData}
                hasMore={hasMore}
                loader={<Skeleton paragraph={{ rows: 2 }} active />}
                scrollableTarget="scrollableDiv"
            >
                <List
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item>
                            <EventCard event={item} />
                        </List.Item>
                    )}
                />
            </InfiniteScroll>
        </div>
    </>
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <EventsLayout children={page} />
    )
}

export default Page