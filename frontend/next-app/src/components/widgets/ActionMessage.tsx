import { CheckCircleTwoTone, ExclamationCircleTwoTone } from '@ant-design/icons';
import { Space, Typography } from 'antd';
const { Text } = Typography;

export default function ActionMessage(
    { success, failure }:
        {
            success: boolean,
            failure?: boolean,
        }) {

    return (
        success ? <CheckCircleTwoTone style={{ marginLeft: 12 }} twoToneColor="#52c41a" /> :
            failure && <Space style={{ marginLeft: 12 }} size={4}><ExclamationCircleTwoTone twoToneColor="#eb2f96" /><Text>Failed</Text></Space>
    );
}