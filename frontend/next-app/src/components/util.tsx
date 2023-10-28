import { getCookie } from "cookies-next";

export function delay(t, val) {
    return new Promise(resolve => setTimeout(resolve, t, val));
}

export function getHeaders() {
    return { "Authorization": `Token ${getCookie('auth_token')}` }
}