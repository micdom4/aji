import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Paths } from "../../routes/paths";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode
}

const DefaultLayout = ({children}: LayoutProps) => {
    const navigate = useNavigate()

    return (
        <div>
            <Navbar collapseOnSelect bg={"primary"} fixed={"top"} expand="lg" data-bs-theme={"dark"}>
                <Container>
                    <Navbar.Brand onClick={() => navigate(Paths.default.home)}>polVirt</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link onClick={() => navigate(Paths.default.home)}>Home</Nav.Link>
                            <NavDropdown title="Products" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => navigate(Paths.default.listUsers)}>
                                    List Products
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => navigate(Paths.default.createUser)}>
                                    Create New User
                                </NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Resources" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => navigate(Paths.default.listResources)}>
                                    List Resources
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => navigate(Paths.default.createResource)}>
                                    Create New Resource
                                </NavDropdown.Item>
                            </NavDropdown>
                                <NavDropdown.Item onClick={() => navigate(Paths.anonymous.login)}>
                                    List Allocations
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => navigate(Paths.default.createAllocations)}>
                                    Create New Allocation
                                </NavDropdown.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container style={{ marginTop: '80px' }}>
                {children}
            </Container>
        </div>
    );
}

export default DefaultLayout;