import React from 'react';
import {Badge, Button, ListGroup, Modal} from 'react-bootstrap';
import type {OrderType} from '../../types/OrderTypes';
import {formatDate} from '../../utils';

interface ViewOpinionsModalProps {
    show: boolean;
    handleClose: () => void;
    order: OrderType | null;
}

export const ViewOpinionsModal: React.FC<ViewOpinionsModalProps> = ({show, handleClose, order}) => {
    if (!order) return null;

    return (
        <Modal show={show} onHide={handleClose} centered scrollable>
            <Modal.Header closeButton>
                <Modal.Title>Opinions for Order #{order._id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {(!order.opinions || order.opinions.length === 0) ? (
                    <p className="text-center text-muted">No opinions yet.</p>
                ) : (
                    <ListGroup variant="flush">
                        {order.opinions.map((op, idx) => (
                            <ListGroup.Item key={idx} className="mb-2 border rounded">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <Badge bg={op.rating >= 4 ? 'success' : op.rating >= 3 ? 'warning' : 'danger'}>
                                        Rating: {op.rating}/5
                                    </Badge>
                                    <small className="text-muted">{formatDate(op.createdAt)}</small>
                                </div>
                                <p className="mb-0 text-break">{op.content}</p>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};