import {Container, Nav, Navbar} from "react-bootstrap";
import {Paths} from "../../routes/paths.ts";
import {type ReactNode, use} from "react";
import {useNavigate} from "react-router-dom";
import LoggedUserContext from "../../contexts/LoggedUserContext";
import {emptyUser} from "../../contexts/LoggedUserContext/types.ts";

interface LayoutProps {
    children: ReactNode
}

export default function DefaultLayout({children}: LayoutProps) {
    const navigate = useNavigate()
    const {user, setUser} = use(LoggedUserContext)

    function logOut() {
        setUser(emptyUser)
    }

    return (
        <div>
            <Navbar collapseOnSelect bg={"primary"} fixed={"top"} expand="lg" data-bs-theme={"dark"}>
                <Container fluid>
                    <Navbar.Brand onClick={() => navigate(Paths.default.home)}>Vivo</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => navigate(Paths.default.home)}>Home</Nav.Link>
                        {user.isAuthenticated() && <>
                            <Nav.Link onClick={() => navigate(Paths.client.listProducts)}>
                                Products
                            </Nav.Link>
                            <Nav.Link onClick={() => navigate(Paths.client.listOrders)}>
                                Orders
                            </Nav.Link>
                            <Nav.Link onClick={() => navigate(Paths.client.createOrder)}>
                                Create Order
                            </Nav.Link>
                            <Nav.Link onClick={logOut}>
                                Log Out
                            </Nav.Link>
                        </>}
                        {!user.isAuthenticated() && <>
                            <Nav.Link onClick={() => navigate(Paths.anonymous.login)}>
                                Log In
                            </Nav.Link>
                            <Nav.Link onClick={() => navigate(Paths.anonymous.register)}>
                                Sign Up
                            </Nav.Link>
                        </>}
                    </Nav>
                </Container>
            </Navbar>
            <Container style={{marginTop: '80px'}}>
                {children}
            </Container>
        </div>
    );
}