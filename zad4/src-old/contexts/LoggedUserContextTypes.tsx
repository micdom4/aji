import {Dispatch, SetStateAction} from 'react';

export class LoggedUser {
    login: string | null;
    token: string | null;
    roles: RoleEnum[];

    constructor(login: string | null, token: string | null, roles: RoleEnum[]) {
        this.login = login;
        this.token = token;
        this.roles = roles;
    }

    isAuthenticated() {
        return (!!this.login && !!this.token);
    }

    isWorker() {return this.}
    isClient() {return this.roles.includes(RoleEnum.CLIENT)}

}

export const emptyUser = new LoggedUser(null,null,[])

// Ustalenie struktury kontekstu przechowującego dane zalogowanego użytkownika
export type LoggedUserContextType = {
    user: LoggedUser;
    setUser: Dispatch<SetStateAction<LoggedUser>>;
}
