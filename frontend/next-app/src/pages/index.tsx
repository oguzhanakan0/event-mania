import { UserAddOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Modal, Row, Space, Typography } from 'antd';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LoginForm from '../components/forms/LoginForm';
import RegisterForm from '../components/forms/RegisterForm';
import { API_URL } from './_app';

const { Text, Title } = Typography;

export default function Index() {
    const [loading, setLoading] = useState(true)

    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false)
    const [registerSuccess, setRegisterSuccess] = useState(false)

    const router = useRouter()

    const handleRegisterCancel = () => setIsRegisterModalOpen(false);
    const showRegisterModal = () => setIsRegisterModalOpen(true);
    const handleRegisterOk = (formData) => {
        setRegisterLoading(true)
        const req = new Request(
            `${API_URL}/api/users/create/`,
            {
                method: 'POST',
                body: JSON.stringify(formData)
            }
        )
        fetch(req)
            .then(res => {
                if (res.ok) {
                    setRegisterSuccess(true)
                } else {
                    throw Error("Oops")
                }
            })
            .catch(() => null)
            .finally(() => setRegisterLoading(false))
    };

    useEffect(() => {
        if (getCookie('auth_token') != null) router.push('/home')
        else setLoading(false)
    }, [])

    return loading ? <></> :
        <Row style={{ display: "flex", alignItems: "center" }}>
            <Col
                span={14}
                style={{
                    backgroundColor: "#bae7ff",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",

                }}
            >
                <Space direction="vertical" size={0}>
                    <Text style={{ margin: 0 }} italic>Welcome to</Text>
                    <Title style={{ margin: 0, fontFamily: "Roboto" }}>EventMania🎈</Title>
                    <Text style={{ margin: 0 }}>There are dreamers and planners. The planners make their dreams come true.</Text>
                </Space>
            </Col>
            <Col span={10}>
                <div style={{ width: "200px", marginLeft: "4em" }}>
                    <LoginForm />
                    <Divider>or</Divider>
                    <Button icon={<UserAddOutlined />} onClick={showRegisterModal}>Create an account</Button>
                    <Modal
                        title={registerSuccess ? <Text type='success'>Registration was successful.</Text> : `Create new account`}
                        open={isRegisterModalOpen}
                        onCancel={handleRegisterCancel}
                        footer={null}
                        destroyOnClose={true}
                        width={400}
                    >
                        {registerSuccess ?
                            <>
                                <p><Text>Now you can sign in with your credentials.</Text></p>
                                <Button type='primary' onClick={() => setIsRegisterModalOpen(false)}>OK</Button>
                            </> :
                            <RegisterForm disabled={registerLoading} success={registerSuccess} onFinish={handleRegisterOk} />
                        }
                    </Modal>
                </div>
            </Col>
        </Row>
}