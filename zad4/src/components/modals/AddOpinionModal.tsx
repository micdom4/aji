import React from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import {Formik} from 'formik';
import useToast from '../toasts/useToast';
import {orderApi} from '../../api/OrderRestApi';
import {OpinionSchema, type OrderType} from '../../types/OrderTypes';
import {formatDate} from "../../utils";

interface AddOpinionModalProps {
    show: boolean;
    handleClose: () => void;
    order: OrderType | null;
    onSuccess: () => void;
}

export const AddOpinionModal: React.FC<AddOpinionModalProps> = ({show, handleClose, order, onSuccess}) => {
    const {addToast} = useToast();

    if (!order) return null;

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Rate Order #{order._id}</Modal.Title>
            </Modal.Header>

            <Formik
                initialValues={{date: new Date(), rating: 5, content: ''}}
                validationSchema={OpinionSchema}
                onSubmit={(values, {setSubmitting}) => {
                    orderApi.addOpinion(order._id, {rating: values.rating, content: values.content})
                        .then(() => {
                            addToast('Success', 'Your opinion has been added.', 'success');
                            onSuccess();
                            handleClose();
                        })
                        .catch((err) => {
                            console.error(err);
                            addToast('Error', `Failed to add opinion. Error: ${err}`, 'danger');
                        })
                        .finally(() => setSubmitting(false));
                }}
            >
                {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                  }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3" controlId="formContent">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type='text'
                                    name="date"
                                    value={formatDate(values.date)}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formRating">
                                <Form.Label>Rating (1-5)</Form.Label>
                                <Form.Select
                                    name="rating"
                                    value={values.rating}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.rating && !!errors.rating}
                                >
                                    <option value="5">5 - Excellent</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="3">3 - Average</option>
                                    <option value="2">2 - Poor</option>
                                    <option value="1">1 - Terrible</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formContent">
                                <Form.Label>Your Opinion</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="content"
                                    placeholder="Describe your experience..."
                                    value={values.content}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.content && !!errors.content}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.content}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="success" disabled={isSubmitting}>
                                {isSubmitting ? 'Sending...' : 'Submit Opinion'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};