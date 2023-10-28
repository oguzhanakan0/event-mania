import { CheckCircleTwoTone } from '@ant-design/icons';
import { Button, DatePicker, Form, Input } from 'antd';
import { useRouter } from 'next/router';
import { EventFieldType } from '../types';

export default function EventForm(
    { disabled, success, onFinish, initialValues, name }:
        {
            disabled: boolean,
            success: boolean,
            onFinish: any,
            initialValues?: object,
            name?: string,
        }) {
    const router = useRouter()

    return (
        <Form
            requiredMark={false}
            name={name || "event-form"}
            layout='vertical'
            initialValues={initialValues}
            onFinish={onFinish}
            autoComplete="off"
            disabled={disabled || success}
        >
            <Form.Item<EventFieldType>
                label="Title"
                name="title"
                rules={[{ required: true, message: 'Please enter a title' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item<EventFieldType>
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter description' }]}
            >
                <Input.TextArea />
            </Form.Item>

            <Form.Item<EventFieldType>
                name="date"
                label="Date"
                rules={[{ required: true, message: 'Please set a date' }]}
            >
                <DatePicker format={"YYYY-MM-DD"} />
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