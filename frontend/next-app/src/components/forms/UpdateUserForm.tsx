import { Button, Form, Input } from 'antd';
import { UserFieldType } from '../types';
import ActionMessage from '../widgets/ActionMessage';

export default function UpdateUserForm(
    { disabled, success, onFinish, initialValues, name, failure }:
        {
            disabled: boolean,
            success: boolean,
            onFinish: any,
            initialValues?: any,
            name?: string,
            failure?: boolean,
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
                label="Username"
                name="username"
            >
                <Input disabled={true} />
            </Form.Item>

            <Form.Item<UserFieldType>
                label="First Name"
                name="first_name"
                rules={[{ required: true, message: 'This field cannot be empty' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item<UserFieldType>
                label="Last Name"
                name="last_name"
                rules={[{ required: true, message: 'This field cannot be empty' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item<UserFieldType>
                label="Email Address"
                name="email"
                rules={[{ required: true, message: 'This field cannot be empty' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={disabled}>
                    Submit
                </Button>
                <ActionMessage success={success} failure={failure} />
            </Form.Item>
        </Form>
    );
}