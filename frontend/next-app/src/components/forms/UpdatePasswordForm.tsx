import { CheckCircleTwoTone } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import ActionMessage from '../widgets/ActionMessage';
import { PasswordResetFieldType } from '../types';

export default function UpdatePasswordForm(
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
            disabled={disabled}
        >
            <Form.Item<PasswordResetFieldType>
                label="Old Password"
                name="old_password"
                rules={[{ required: true, message: 'Please enter your old password' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item<PasswordResetFieldType>
                label="New Password"
                name="new_password"
                rules={[{ required: true, message: 'Please enter your new password' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item<PasswordResetFieldType>
                label="New Password (confirm)"
                name="new_password_confirm"
                rules={[{ required: true, message: 'Please confirm your new password' }]}
            >
                <Input.Password />
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