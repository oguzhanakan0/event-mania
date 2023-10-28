import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useState } from "react";
import { API_URL } from '../../pages/_app';
import { delay } from '../util';
import EventForm from './EventForm';

export default function UpdateEventForm({ event, setIsModalOpen }) {
    const [disabled, setDisabled] = useState(false)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const onFinish = (formData: any) => {
        formData.pk = event.id
        setDisabled(true)
        const req = new Request(
            `${API_URL}/api/events/update/`,
            {
                method: 'PATCH',
                body: JSON.stringify(formData),
                headers: {
                    "Authorization": `Token ${getCookie('auth_token')}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
        delay(1000, 1).then(() => fetch(req))
            .then(res => {
                if (res.ok) {
                    setSuccess(true);
                    return res.json()
                }
            })
            .then(res => delay(2000, 1).then(() => {
                router.reload()
                setIsModalOpen(false)
            }))
            .catch(error => { })
            .finally(() => { setDisabled(false); setSuccess(false); })
    };


    return (
        <EventForm name="update-event-form" disabled={disabled} success={success} onFinish={onFinish} initialValues={event} />
    );
}