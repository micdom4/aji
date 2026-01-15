import type {Dispatch, SetStateAction} from 'react';

export enum RoleEnum {
    WORKER = 'WORKER',
    CLIENT = 'CLIENT',
}

export class LoggedUser {
    username: string | null;
    token: string | null;
    role: RoleEnum | null;

    constructor(username: string | null, token: string | null, role: RoleEnum | null) {
        this.username = username;
        this.token = token;
        this.role = role;
    }

    isAuthenticated() {
        return (!!this.username && !!this.token);
    }

    isWorker() {
        return !!this.role && this.role.includes(RoleEnum.WORKER)
    }

    isClient() {
        return !!this.role && this.role.includes(RoleEnum.CLIENT)
    }

}

export const emptyUser = new LoggedUser(null, null, null)

export type LoggedUserContextType = {
    user: LoggedUser;
    setUser: Dispatch<SetStateAction<LoggedUser>>;
}

export type LoginResponse = {
    message: string,
    accessToken: string,
    refreshToken: string,
    role: RoleEnum
}
