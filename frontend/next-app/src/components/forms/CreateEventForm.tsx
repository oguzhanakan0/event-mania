import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useState } from "react";
import { API_URL } from '../../pages/_app';
import { delay } from '../util';
import EventForm from './EventForm';

export default function CreateEventForm({ setIsModalOpen }) {
    const [disabled, setDisabled] = useState(false)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const onFinish = (formData: any) => {
        setDisabled(true)
        const req = new Request(
            `${API_URL}/api/events/create/`,
            {
                method: 'POST',
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
                router.push(`/events/${res.id}/`)
                setIsModalOpen(false)
            }))
            .finally(() => { setDisabled(false); setSuccess(false); })
    };


    return (
        <EventForm name="create-event-form" disabled={disabled} success={success} onFinish={onFinish} />
    );
}