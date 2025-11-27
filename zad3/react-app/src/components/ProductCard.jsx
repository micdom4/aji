import { Card, Button } from 'react-bootstrap'

export default function ProductCard({ product }) {
  return (
    <Card className="h-100">
      {product.imageUrl && (
        <Card.Img variant="top" src={product.imageUrl} alt={product.name} />
      )}
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text className="text-muted">{product.description}</Card.Text>
        <h5 className="mb-3">${product.price?.toFixed(2) || 'N/A'}</h5>
        <Button variant="primary" size="sm">
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  )
}
