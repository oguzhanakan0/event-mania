import { CalendarOutlined, HomeOutlined, PlusOutlined, ThunderboltOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { ConfigProvider, FloatButton, Layout, Menu, Modal, Switch, theme } from 'antd';
import MenuItem from 'antd/es/menu/MenuItem';
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import CreateEventForm from './forms/CreateEventForm';

const { Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}


const { defaultAlgorithm, darkAlgorithm } = theme;

export default function EventsLayout({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter()

    const handleAddEvent = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleClick = () => {
        setIsDarkMode((previousValue) => !previousValue);
    };

    const [current, setCurrent] = useState(router.pathname);
    useEffect(() => {
        setCurrent(router.pathname)
    }, [router.pathname])

    useEffect(() => {
        setIsDarkMode(getCookie("theme") == "dark" ? true : false)
        if (getCookie('auth_token') == null) router.push('/')
    }, [])

    const items: MenuProps['items'] = [
        getItem(<Link href="/home">Home</Link>, '/home', <HomeOutlined />),
        getItem(<Link href="/calendar">Calendar</Link>, '/calendar', <CalendarOutlined />),
        getItem(<Link href="/events">Events</Link>, '/events', <ThunderboltOutlined />),
        getItem(<Link href="/profile">Profile</Link>, '/profile', <UserOutlined />),
    ];

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
                components: {
                    Card: {
                        actionsLiMargin: "6px"
                    },
                }
            }}
        >
            <Layout style={{ minHeight: '100vh' }}>
                <Sider>
                    <Menu
                        style={{
                            overflow: 'auto',
                            height: '100vh',
                            position: 'fixed',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: "200px"
                        }}
                        selectedKeys={[current]}
                        mode="inline"
                        items={items}
                    />
                </Sider>
                <Layout>
                    <Content style={{ margin: '16px 16px' }}>
                        <Switch checkedChildren="🌞" unCheckedChildren="🌚" defaultChecked onChange={handleClick}
                            style={{
                                position: 'fixed',
                                bottom: 0,
                                left: 0,
                                width: 36,
                                margin: 12
                            }}
                        />
                        <div style={{ margin: 24, minHeight: 360 }}>
                            {children}
                        </div>
                        <FloatButton onClick={handleAddEvent} icon={<PlusOutlined />} />
                        <Modal title="Create an Event" open={isModalOpen}
                            onOk={handleOk} onCancel={handleCancel} footer={null}>
                            <CreateEventForm setIsModalOpen={setIsModalOpen} />
                        </Modal>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>EventMania ©2023</Footer>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};