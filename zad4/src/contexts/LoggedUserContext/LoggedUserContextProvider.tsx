import {type ReactNode, useEffect, useLayoutEffect, useState} from 'react'
import {emptyUser, LoggedUser, RoleEnum} from "./types.ts";
import LoggedUserContext from "./index.tsx";
import {
    refreshTokenStorageName,
    tokenStorageName,
    userRoleStorageName,
    userUsernameStorageName
} from "./tokenStorageConfig.ts";

export default function LoggedUserContextProvider({children}: { children: ReactNode }) {

    const [loggedUser, setLoggedUser] = useState(emptyUser)
    const [isInitialized, setIsInitialized] = useState(false);

    useLayoutEffect(() => {
        const accessToken = sessionStorage.getItem(tokenStorageName);
        const refreshToken = sessionStorage.getItem(refreshTokenStorageName);
        const username = sessionStorage.getItem(userUsernameStorageName);
        const role = sessionStorage.getItem(userRoleStorageName) as RoleEnum;

        if (accessToken && username && role) {
            const restoredUser = new LoggedUser(username, accessToken, refreshToken, role);
            setLoggedUser(restoredUser);
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (loggedUser.isAuthenticated()) {
            sessionStorage.setItem(tokenStorageName, loggedUser.accessToken || "");
            if (loggedUser.refreshToken) {
                sessionStorage.setItem(refreshTokenStorageName, loggedUser.refreshToken);
            }
            if (loggedUser.username) {
                sessionStorage.setItem(userUsernameStorageName, loggedUser.username);
            }
            if (loggedUser.role) {
                sessionStorage.setItem(userRoleStorageName, loggedUser.role);
            }
        } else if (isInitialized) {
            sessionStorage.removeItem(tokenStorageName);
            sessionStorage.removeItem(refreshTokenStorageName);
            sessionStorage.removeItem(userUsernameStorageName);
            sessionStorage.removeItem(userRoleStorageName);
        }
    }, [loggedUser, isInitialized]);

    if (!isInitialized) {
        return null;
    }

    return (
        <LoggedUserContext value={{user: loggedUser, setUser: setLoggedUser}}>
            {children}
        </LoggedUserContext>
    )
}

