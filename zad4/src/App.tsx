import './App.css'
import RoutesComponent from "./routes";
import {BrowserRouter} from "react-router-dom";
import {ToastProvider} from "./components/toasts/ToastProvider.tsx";
import {ModalProvider} from "./components/modals/ModalProvider.tsx";
import LoggedUserContextProvider from "./contexts/LoggedUserContext/LoggedUserContextProvider.tsx";


function App() {

    return (
        <>
            <ToastProvider>
                <ModalProvider>
                    <LoggedUserContextProvider>
                        <BrowserRouter>
                            <RoutesComponent/>
                        </BrowserRouter>
                    </LoggedUserContextProvider>
                </ModalProvider>
            </ToastProvider>
        </>
    )
}

export default App
