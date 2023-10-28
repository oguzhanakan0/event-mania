import { EditOutlined, KeyOutlined, LogoutOutlined } from '@ant-design/icons';
import { Card, Modal, Space, Statistic, Tooltip, Typography } from 'antd';
import moment from 'moment';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { API_URL } from '../../pages/_app';
import UpdatePasswordForm from '../forms/UpdatePasswordForm';
import UpdateUserForm from '../forms/UpdateUserForm';
import { delay, getHeaders } from '../util';

const { Text } = Typography;


export default function ProfileWidget() {
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
    const [profileData, setProfileData] = useState(null)
    const [profileDataLoading, setProfileDataLoading] = useState(false)
    const [signOutLoading, setSignutLoading] = useState(false)
    const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
    const [updateUserLoading, setUpdateUserLoading] = useState(false)
    const [updateUserSuccess, setUpdateUserSuccess] = useState(false)
    const [updateUserFailure, setUpdateUserFailure] = useState(false)
    const [isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen] = useState(false);
    const [updatePasswordLoading, setUpdatePasswordLoading] = useState(false)
    const [updatePasswordSuccess, setUpdatePasswordSuccess] = useState(false)
    const [updatePasswordFailure, setUpdatePasswordFailure] = useState(false)

    const loadProfileData = () => {
        if (profileDataLoading) return;
        setProfileDataLoading(true);
        const req = new Request(`${API_URL}/api/profile/`, {
            method: 'GET',
            headers: getHeaders()
        })
        fetch(req)
            .then((res) => res.json())
            .then((body) => {
                setProfileData(body);
                setProfileDataLoading(false);
            })
            .catch(() => setProfileDataLoading(false));
    };

    useEffect(() => {
        loadProfileData()
    }, []);

    const handleSignOutCancel = () => setIsSignOutModalOpen(false);
    const showSignOutModal = () => setIsSignOutModalOpen(true);
    const handleSignOutOk = () => {
        setSignutLoading(true)
        const req = new Request(
            `${API_URL}/api/auth/sign-out/`,
            {
                method: 'GET',
                credentials: 'include',
            }
        )
        fetch(req)
            .then(res => {
                if (res.ok) router.push('/')
            })
            .finally(() => setSignutLoading(false))
    };

    const handleUpdateUserCancel = () => setIsUpdateUserModalOpen(false);
    const showUpdateUserModal = () => setIsUpdateUserModalOpen(true);
    const onUpdateUserFinish = (formData: any) => {
        setUpdateUserLoading(true)
        setUpdateUserFailure(false)
        const req = new Request(
            `${API_URL}/api/users/update/`,
            {
                method: 'PATCH',
                body: JSON.stringify(formData),
                headers: getHeaders()
            })
        delay(1000, 1).then(() => fetch(req))
            .then(res => {
                if (res.ok) {
                    setUpdateUserSuccess(true);
                    return res.json()
                } else throw Error("Could not update user info.")
            })
            .then(res =>
                delay(2000, 1)
                    .then(() => {
                        setIsUpdateUserModalOpen(false)
                        router.reload()
                    }))
            .catch(error => {
                setUpdateUserFailure(true)
            })
            .finally(() => { setUpdateUserLoading(false); setUpdateUserSuccess(false); })
    };

    const handleUpdatePasswordCancel = () => setIsUpdatePasswordModalOpen(false);
    const showUpdatePasswordModal = () => setIsUpdatePasswordModalOpen(true);
    const onUpdatePasswordFinish = (formData: any) => {
        setUpdatePasswordLoading(true)
        setUpdatePasswordFailure(false)
        const req = new Request(
            `${API_URL}/api/users/change-password/`,
            {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: getHeaders()
            })
        delay(1000, 1).then(() => fetch(req))
            .then(res => {
                if (res.ok) {
                    setUpdatePasswordSuccess(true);
                    return res.json()
                } else {
                    throw new Error("Ooops")
                }
            })
            .then(res =>
                delay(2000, 1)
                    .then(() => {
                        setIsUpdatePasswordModalOpen(false)
                    }))
            .catch(error => {
                setUpdatePasswordFailure(true)
            })
            .finally(() => { setUpdatePasswordLoading(false); setUpdatePasswordSuccess(false); })
    };

    return (<>
        {profileData != null &&
            <Card
                title={`@${profileData.username}`}
                style={{ textAlign: 'center' }}
                actions={[
                    <Tooltip title={"Edit Profile"}><EditOutlined onClick={showUpdateUserModal} /></Tooltip>,
                    <Tooltip title={"Change Password"}><KeyOutlined onClick={showUpdatePasswordModal} /></Tooltip>,
                    <Tooltip title={"Sign Out"}><LogoutOutlined style={{ color: "#eb2f96" }} onClick={showSignOutModal} /></Tooltip>,

                ]}
            >
                <Space style={{ display: "flex", justifyContent: "space-between" }}>
                    <Statistic title="Full Name" value={`${profileData.first_name} ${profileData.last_name}`} valueStyle={{ fontSize: 12 }} />
                    <Statistic title="E-mail address" value={profileData.email} valueStyle={{ fontSize: 12 }} />
                    <Statistic title="Date Joined" value={moment(profileData.date_joined).format("YYYY-MM-DD")} valueStyle={{ fontSize: 12 }} />
                    <Statistic title="Last Login" value={moment(profileData.last_login).format("YYYY-MM-DD")} valueStyle={{ fontSize: 12 }} />
                </Space>
                <Modal
                    title={`Signing out`}
                    open={isSignOutModalOpen}
                    onOk={handleSignOutOk}
                    onCancel={handleSignOutCancel}
                    okText={"Confirm"}
                    confirmLoading={signOutLoading}
                >
                    <Text>Are you sure you want to sign out?</Text>
                </Modal>
                <Modal
                    title={`Update Information`}
                    open={isUpdateUserModalOpen}
                    onCancel={handleUpdateUserCancel}
                    footer={null}
                >
                    <UpdateUserForm
                        disabled={updateUserLoading}
                        success={updateUserSuccess}
                        onFinish={onUpdateUserFinish}
                        initialValues={profileData}
                        failure={updateUserFailure}
                    />
                </Modal>
                <Modal
                    title={`Change Password`}
                    open={isUpdatePasswordModalOpen}
                    onCancel={handleUpdatePasswordCancel}
                    footer={null}
                >
                    <UpdatePasswordForm
                        disabled={updatePasswordLoading}
                        success={updatePasswordSuccess}
                        onFinish={onUpdatePasswordFinish}
                        failure={updatePasswordFailure}
                    />
                </Modal>
            </Card>
        }
    </>
    );
}