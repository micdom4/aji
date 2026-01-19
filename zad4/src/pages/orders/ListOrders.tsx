import {use, useEffect, useMemo, useState, useTransition} from "react";
import {type Column, GenericTable} from "../../components/GenericTable.tsx";
import useToast from "../../components/toasts/useToast.tsx";
import {formatDate} from "../../utils";
import LoggedUserContext from "../../contexts/LoggedUserContext";
import {type OrderStateType, OrderStatus, type OrderType} from "../../types/OrderTypes.ts";
import {orderApi} from "../../api/OrderRestApi.ts";
import {Button, Col, Dropdown, Form, InputGroup, ListGroup, Row, Spinner} from "react-bootstrap";
import {AddOpinionModal} from "../../components/modals/AddOpinionModal.tsx";
import {ViewOpinionsModal} from "../../components/modals/ViewOpinionsModal.tsx";

export default function ListOrders() {
    const [orders, setOrders] = useState<OrderType[]>([])
    const [states, setStates] = useState<OrderStateType[]>([])
    const [isPending, startTransition] = useTransition()

    const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
    const [showAddOpinionModal, setShowAddOpinionModal] = useState(false);
    const [showViewOpinionModal, setShowViewOpinionModal] = useState(false);

    const {addToast} = useToast()
    const {user} = use(LoggedUserContext);

    const [searchText, setSearchText] = useState("");
    const [selectedStateFilter, setSelectedStateFilter] = useState("");

    const loadOrders = () => {
        startTransition(async () => {
            await orderApi.getAll().then((response) => {
                const sorted = response.data.sort((a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                setOrders(sorted);
            })
        })
    }

    const handleAddOpinion = (order: OrderType) => {
        setSelectedOrder(order);
        setShowAddOpinionModal(true);
    };

    const handleViewOpinion = (order: OrderType) => {
        setSelectedOrder(order);
        setShowViewOpinionModal(true);
    };

    const handleOpinionSuccess = () => {
        loadOrders();
        setShowViewOpinionModal(true);
    };

    const handleStateChange = (order: OrderType, state: OrderStateType) => {
        const payload = {
            email: order.email,
            phoneNumber: order.phoneNumber,
            state: state,
            username: order.username,
            productList: order.productList,
        }
        console.log("payload", payload)
        orderApi.edit(order._id, payload)
            .then(() => {
                addToast(
                    "Successfully updated order",
                    "Order with id: " + order._id + " has been successfully updated.",
                    'success'
                )
                loadOrders()
            })
            .catch((error) => {
                console.log(error);
                addToast(
                    "Could not update order",
                    `Error while updating order with id: ${order._id}. Error: ${error}`,
                    'danger'
                )
            })
    }

    const columns: Column<OrderType>[] = useMemo(() => [
        {
            header: 'Date',
            render: (o) => <span className="text-secondary">{formatDate(o.date)}</span>
        },
        {
            header: 'Email',
            render: (o) => o.email
        },
        {
            header: 'Phone Number',
            render: (o) => o.phoneNumber
        },
        {
            header: 'Current State',
            render: (o) => <span className="fw-bold text-warning">{o.state.name}</span>
        },
        {
            header: 'Client\'s Username',
            render: (o) => <span className="fw-bold">{o.username}</span>
        },
        {
            header: 'Selected Products',
            render: (o) => {
                const productCounts = o.productList.reduce((acc, product) => {
                    const id = product._id;
                    if (!acc[id]) {
                        acc[id] = {name: product.name, count: 0};
                    }
                    acc[id].count += 1;
                    return acc;
                }, {} as Record<string, { name: string; count: number }>);

                return (
                    <ListGroup variant={'flush'}>
                        {Object.values(productCounts).map((item, index) => (
                            <ListGroup.Item variant={'success'} key={index}>
                                {item.name} <span className="text-muted">- x{item.count}</span>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                );
            }
        },
        {
            header: 'Actions',
            render: (o) => {
                const hasOpinions = o.opinions && o.opinions.length > 0;
                const canAddOpinion =
                    !hasOpinions &&
                    (o.state.name === OrderStatus.REALIZED || o.state.name === OrderStatus.CANCELED) &&
                    user.isClient() &&
                    user.username === o.username;

                return (
                    <div className="d-flex flex-column gap-2">
                        {user.isWorker() && (
                            <Dropdown>
                                <Dropdown.Toggle variant={'info'} size="sm" className="w-100">
                                    Change state
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {states.map((s) => (
                                        <Dropdown.Item
                                            key={s._id}
                                            onClick={() => handleStateChange(o, s)}
                                            active={o.state._id === s._id}
                                        >
                                            {s.name}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        )}

                        {canAddOpinion && (
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleAddOpinion(o)}
                            >
                                Rate Order
                            </Button>
                        )}

                        {hasOpinions && (
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleViewOpinion(o)}
                            >
                                View Opinion
                            </Button>
                        )}
                    </div>
                );
            }
        }
    ], [handleStateChange, user, states]);

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const searchString = searchText.toLowerCase();
            const matchesText =
                order.email.toLowerCase().includes(searchString) ||
                order.username.toLowerCase().includes(searchString) ||
                (order.phoneNumber && order.phoneNumber.includes(searchString));

            const matchesState = selectedStateFilter === "" || order.state._id === selectedStateFilter;

            return matchesText && matchesState;
        });
    }, [orders, searchText, selectedStateFilter]);

    useEffect(() => {
        orderApi.getStates()
            .then((r) => {
                setStates(r.data);
            })
        loadOrders()
    }, [])

    return (
        <div className="container">
            <h2 className={'mb-4'}>Order List</h2>

            <Row className="mb-3 g-2">
                <Col md={8} lg={9}>
                    <InputGroup>
                        <InputGroup.Text>Search:</InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search by email, username or phone..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        {searchText && (
                            <Button variant="outline-secondary" onClick={() => setSearchText("")}>
                                ✕
                            </Button>
                        )}
                    </InputGroup>
                </Col>
                <Col md={4} lg={3}>
                    <Form.Select
                        value={selectedStateFilter}
                        onChange={(e) => setSelectedStateFilter(e.target.value)}
                        aria-label="Filter by order state"
                        className="fw-bold text-warning"
                    >
                        <option value="">All States</option>
                        {states.map((state) => (
                            <option key={state._id} value={state._id}>
                                {state.name}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            {isPending ? <>
                <p>Fetching orders...</p>
                <Spinner animation="border" variant="warning"/>
            </> : <GenericTable data={filteredOrders} columns={columns}/>}

            <AddOpinionModal
                show={showAddOpinionModal}
                handleClose={() => setShowAddOpinionModal(false)}
                order={selectedOrder}
                onSuccess={handleOpinionSuccess}
            />

            <ViewOpinionsModal
                show={showViewOpinionModal}
                handleClose={() => setShowViewOpinionModal(false)}
                order={selectedOrder}
            />
        </div>
    );
}