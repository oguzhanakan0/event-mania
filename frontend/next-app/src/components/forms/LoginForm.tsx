import { Button, Form, Input, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useState } from "react";
import { API_URL } from '../../pages/_app';
import { LoginFieldType } from '../types';
const { Text } = Typography;

export default function LoginForm() {
    const router = useRouter()
    const [disabled, setDisabled] = useState(false)
    const [error, setError] = useState(false)

    const onFinish = (formData: any) => {
        setDisabled(true)
        const req = new Request(
            `${API_URL}/api/auth/sign-in/`,
            {
                method: 'POST',
                body: JSON.stringify(formData),
                credentials: 'include'
            })
        fetch(req)
            .then(res => router.push('/home'))
            .catch(error => {
                setError(true)
            })
            .finally(() => setDisabled(false))
    };


    return (
        <Form
            layout='vertical'
            name="basic"
            initialValues={{}}
            onFinish={onFinish}
            autoComplete="off"
            disabled={disabled}
            requiredMark={false}
        >
            <Form.Item<LoginFieldType>
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please enter your email address', type: 'email' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item<LoginFieldType>
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please enter your password' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={disabled}>
                    Sign In
                </Button>
            </Form.Item>
            {error && <Text type='danger'>Please check your email address and password.</Text>}
        </Form>
    );
}