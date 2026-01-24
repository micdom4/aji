import {use, useEffect, useState} from 'react';
import {Button, Card, Col, Container, Form, Row, Table} from 'react-bootstrap';
import {useCart} from '../../contexts/useCart.tsx';
import LoggedUserContext from "../../contexts/LoggedUserContext";
import {useNavigate} from 'react-router-dom';
import {Formik} from 'formik';
import {OrderSchema, type OrderStateType} from "../../types/OrderTypes.ts";
import {orderApi} from "../../api/OrderRestApi.ts";
import type {ProductType} from "../../types/ProductTypes.ts";
import useToast from "../../components/toasts/useToast.tsx";

export default function CartPage() {
    const {items, removeFromCart, changeQuantity, cartTotal, clearCart} = useCart();
    const {user} = use(LoggedUserContext);
    const navigate = useNavigate();
    const {addToast} = useToast();

    const [states, setStates] = useState<OrderStateType[]>([]);

    useEffect(() => {
        orderApi.getStates()
            .then((r) => {
                setStates(r.data);
            })
    })

    const getFlatProductList = (): ProductType[] => {
        return items.flatMap(item =>
            Array(item.quantity).fill(item.product)
        );
    };

    if (items.length === 0) {
        return (
            <Container className="mt-5 text-center">
                <h3>Your Cart is Empty</h3>
                <Button variant="primary" className="mt-3" onClick={() => navigate('/products')}>
                    Go to Products
                </Button>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Shopping Cart</h2>

            <Formik
                initialValues={{
                    email: '',
                    phoneNumber: '',
                    username: user.username ? user.username : '',
                }}
                validationSchema={OrderSchema}
                onSubmit={async (values, {setSubmitting}) => {
                    try {
                        const productListWithDuplicates = getFlatProductList();

                        const orderPayload = {
                            date: (new Date()).toISOString(),
                            email: values.email,
                            phoneNumber: values.phoneNumber,
                            state: states[0],
                            username: values.username,
                            productList: productListWithDuplicates,
                        };

                        console.log("Sending Payload:", orderPayload);

                        await orderApi.create(orderPayload)
                            .then((result) => {
                                addToast(
                                    "Created Successfully",
                                    `Order #${result.data._id} has been created successfully`,
                                    "success"
                                )
                                clearCart();
                                navigate('/products');
                            }).catch((error) => {
                                console.log(error);
                                addToast(
                                    "Failed to create Order",
                                    "Error while creating Order. Error: " + error,
                                    "danger"
                                )
                            })

                    } catch (error) {
                        console.error("Order error", error);
                        alert("Failed to place order.");
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting
                  }) => (
                    <Row>
                        <Col lg={7} xl={8}>
                            <Card className="shadow-sm mb-4">
                                <Card.Body className="p-0">
                                    <Table responsive hover className="mb-0 align-middle">
                                        <thead className="bg-light">
                                        <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th style={{width: '140px'}}>Quantity</th>
                                            <th>Total</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {items.map((item) => (
                                            <tr key={item.product._id}>
                                                <td>
                                                    <span className="fw-bold">{item.product.name}</span>
                                                </td>
                                                <td>{item.product.unitPrice} $</td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Button
                                                            variant="outline-secondary" size="sm"
                                                            onClick={() => changeQuantity(item.product._id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                        >-</Button>
                                                        <span className="fw-bold">{item.quantity}</span>
                                                        <Button
                                                            variant="outline-secondary" size="sm"
                                                            onClick={() => changeQuantity(item.product._id, item.quantity + 1)}
                                                        >+</Button>
                                                    </div>
                                                </td>
                                                <td className="fw-bold">
                                                    {(item.product.unitPrice * item.quantity).toFixed(2)} $
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="link" className="text-danger p-0"
                                                        onClick={() => removeFromCart(item.product._id)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col lg={5} xl={4}>
                            <Card className="shadow-sm">
                                <Card.Header className="bg-white fw-bold">Order Details</Card.Header>
                                <Card.Body>
                                    <Form noValidate onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3" controlId="formUsername">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="username"
                                                placeholder="Enter client's username"
                                                value={values.username}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.username && !!errors.username}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.username}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="formEmail">
                                            <Form.Label>Email address</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                placeholder="Enter email"
                                                value={values.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.email && !!errors.email}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.email}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="formPhone">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="phoneNumber"
                                                placeholder="Enter phone number"
                                                value={values.phoneNumber}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.phoneNumber && !!errors.phoneNumber}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.phoneNumber}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <hr/>

                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Products ({items.reduce((a, b) => a + b.quantity, 0)})</span>
                                            <span>{cartTotal.toFixed(2)} $</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-4 fs-5 fw-bold">
                                            <span>Total Amount</span>
                                            <span>{cartTotal.toFixed(2)} $</span>
                                        </div>

                                        <div className="d-grid gap-2">
                                            <Button
                                                variant="success"
                                                size="lg"
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Processing...' : 'Confirm Order'}
                                            </Button>
                                            <Button
                                                variant="outline-secondary"
                                                onClick={() => navigate('/products')}
                                                disabled={isSubmitting}
                                            >
                                                Continue Shopping
                                            </Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Formik>
        </Container>
    );
}