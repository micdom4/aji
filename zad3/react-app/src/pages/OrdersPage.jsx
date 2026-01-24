import { useEffect, useState } from 'react'
import { Container, Spinner, Alert, Table } from 'react-bootstrap'
import { apiCall } from '../utils/api'

export default function OrdersPage() {
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiCall('/api/orders')
        setOrders(data)
      } catch (e) {
        setError(e.message)
        setOrders([])
      }
    }

    fetchOrders()
  }, [])

  return (
    <Container className="py-4">
      <h1 className="mb-4">My Orders</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {orders === null ? (
        <Spinner animation="border" />
      ) : orders.length === 0 ? (
        <Alert variant="info">No orders yet</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.status || 'pending'}</td>
                <td>${order.total?.toFixed(2) || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  )
}
