import { CheckCircleTwoTone } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import { UserFieldType } from '../types';

export default function RegisterForm(
    { disabled, success, onFinish, initialValues, name }:
        {
            disabled: boolean,
            success: boolean,
            onFinish: any,
            initialValues?: any,
            name?: string,
        }) {

    return (
        <Form
            requiredMark={false}
            name={name || "update-user-form"}
            layout='vertical'
            initialValues={initialValues}
            onFinish={onFinish}
            autoComplete="off"
            disabled={false}
        >
            <Form.Item<UserFieldType>
                label="Email Address"
                name="email"
                rules={[{ required: true, message: 'Please enter a valid email address', type: "email" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item<UserFieldType>
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please enter a username' }]}
            >
                <Input />
            </Form.Item>

            <div style={{ display: "flex" }}>
                <Space>
                    <Form.Item<UserFieldType>
                        label="First Name"
                        name="first_name"
                        rules={[{ required: true, message: 'Please enter your first name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<UserFieldType>
                        label="Last Name"
                        name="last_name"
                        rules={[{ required: true, message: 'Please enter your last name' }]}
                    >
                        <Input />
                    </Form.Item>
                </Space>
            </div>

            <Form.Item<UserFieldType>
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please enter a password' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={disabled}>
                    Submit
                </Button>
                {success ? <CheckCircleTwoTone style={{ marginLeft: 12 }} twoToneColor="#52c41a" /> : null}
            </Form.Item>
        </Form>
    );
}