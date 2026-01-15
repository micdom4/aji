import {type ReactNode, useEffect, useState} from 'react'
import {emptyUser} from "./types.ts";
import LoggedUserContext from "./index.tsx";
import {tokenStorageName} from "./tokenStorageConfig.ts";

export default function LoggedUserContextProvider({children}: { children: ReactNode }) {

    const [loggedUser, setLoggedUser] = useState(emptyUser)

    useEffect(() => {
        if (loggedUser.isAuthenticated()) {
            sessionStorage.setItem(tokenStorageName, loggedUser.token || "( ͡° ͜ʖ ͡°)")
        } else {
            sessionStorage.removeItem(tokenStorageName)
        }
    }, [loggedUser])

    return (
        <LoggedUserContext value={{user: loggedUser, setUser: setLoggedUser}}>
            {children}
        </LoggedUserContext>
    )
}

