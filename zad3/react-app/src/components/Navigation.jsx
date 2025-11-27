import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { isAuthenticated } from '../utils/storage'

export default function Navigation() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const authenticated = isAuthenticated()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Navbar bg="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Web Shop
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {authenticated ? (
              <>
                <Nav.Link as={Link} to="/products">
                  Products
                </Nav.Link>
                <Nav.Link as={Link} to="/orders">
                  Orders
                </Nav.Link>
                <Button variant="outline-light" size="sm" onClick={handleLogout} className="ms-2">
                  Logout
                </Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
