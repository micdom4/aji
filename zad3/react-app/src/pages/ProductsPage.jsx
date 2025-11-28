import { useEffect, useState } from 'react'
import { Container, Row, Col, Spinner, Alert, Table } from 'react-bootstrap'
import { apiCall } from '../utils/api'

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
         <Table bordered striped>
            <thead>
               <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Weight</th>
                  <th>Category</th>
               </tr>
            </thead>
            <tbody>

               {error && <Alert variant="danger">{error}</Alert>}

               {products === null ? (
                  <Spinner animation="border" />
               ) : products.length === 0 ? (
                  <Alert variant="info">No products available</Alert>
               ) : (
                  ProductsList(products)
               )}
            </tbody>
         </Table>
      </Container>
   )
}

function ProductsList(products) {
   return products.map((p) => {
      return <tr>
         <td>{p.name}</td>
         <td>{p.description}</td>
         <td>{p.unitPrice}</td>
         <td>{p.unitWeight}</td>
         <td>{p.category.name}</td>
      </tr>
   })
}
