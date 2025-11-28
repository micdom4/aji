import { useState } from 'react'
import { Container, Form, Button, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   const [error, setError] = useState('')
   const { login, loading } = useAuth()
   const navigate = useNavigate()

   const handleSubmit = async (e) => {
      e.preventDefault()
      setError('')
      const success = await login(username, password)
      if (success) {
         navigate('/products')
      } else {
         setError('Invalid username or password')
      }
   }

   return (
      <Container className="py-5">
         <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h1 className="mb-4">Login</h1>
            <Form onSubmit={handleSubmit}>
               <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                     type="text"
                     placeholder="Enter username"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     required
                  />
               </Form.Group>
               <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                     type="password"
                     placeholder="Enter password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                  />
               </Form.Group>
               {error && <Alert variant="danger">{error}</Alert>}
               <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
               </Button>
            </Form>
         </div>
      </Container>
   )
}
