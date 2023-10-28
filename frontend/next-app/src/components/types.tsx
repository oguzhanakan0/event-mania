export type UserFieldType = {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password?: string
};

export type PasswordResetFieldType = {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
};

export type EventFieldType = {
    title?: string;
    description?: string;
    date?: moment.Moment;
};

export type LoginFieldType = {
    email?: string;
    password?: string;
};

export interface EventDataType {
    id: string;
    title: string;
    description: string;
    created_by: string;
    user_count: number;
    date: string;
}