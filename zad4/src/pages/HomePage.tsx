import LoggedUserContext from "../contexts/LoggedUserContext";
import {use} from "react";

export default function HomePage() {
    const {user} = use(LoggedUserContext)

    return <>
        <h1>Welcome in Vivo
            {user.isAuthenticated() ? ', ' + user.username : ''}!
        </h1>
        <h5 className={'fst-italic text-capitalize'}>Vivo. Faster than allegro</h5>
    </>
}