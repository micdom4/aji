import { useEffect, useState } from 'react'
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap'
import { apiCall } from '../utils/api'
import ProductCard from '../components/ProductCard'

export default function ProductsPage() {
   const [products, setProducts] = useState(null)
   const [error, setError] = useState('')

   useEffect(() => {
      const fetchProducts = async () => {
         try {
            const data = await apiCall('/api/products')
            setProducts(data)
         } catch (e) {
            setError(e.message)
            setProducts([])
         }
      }

      fetchProducts()
   }, [])

   return (
      <Container className="py-4">
         <h1 className="mb-4">Products</h1>

         {error && <Alert variant="danger">{error}</Alert>}

         {products === null ? (
            <Spinner animation="border" />
         ) : products.length === 0 ? (
            <Alert variant="info">No products available</Alert>
         ) : (
            <Row>
               {products.map((product) => (
                  <Col key={product._id} md={4} className="mb-4">
                     <ProductCard product={product} />
                  </Col>
               ))}
            </Row>
         )}
      </Container>
   )
}
