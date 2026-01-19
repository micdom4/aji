import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Modal, Row} from 'react-bootstrap';
import {Formik} from 'formik';
import useToast from '../../components/toasts/useToast.tsx';
import useModal from "./useModal.tsx";
import type {ProductType} from "../../model/ProductTypes.ts";
import {productApi} from "../../api/ProductRestApi.ts";
import type {CategoryType} from "../../model/CategoryTypes.ts";
import {categoryApi} from "../../api/CategoryRestApi.ts";

interface EditProductModalProps {
    show: boolean;
    handleClose: () => void;
    product: ProductType | null;
    onSuccess: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({show, handleClose, product, onSuccess}) => {
    const {addToast} = useToast();
    const {showConfirmation} = useModal()
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (show) {
            categoryApi.getAll().then((r) => setCategories(r.data));
        }
    }, [show]);

    if (!product) return null;

    return (
        <Modal show={show} onHide={handleClose} centered size={'xl'}>
            <Modal.Header closeButton>
                <Modal.Title>Edit product: {product.name}</Modal.Title>
            </Modal.Header>

            <Formik
                enableReinitialize={true}
                initialValues={{
                    description: product.description,
                    unitPrice: product.unitPrice,
                    unitWeight: product.unitWeight,
                    category: product.category?._id || ''
                }}
                onSubmit={(values, {setSubmitting}) => {
                    const selectedCategoryObject = categories.find(c => c._id === values.category);

                    const payload = {
                        name: product.name,
                        ...values,
                        category: selectedCategoryObject
                    };
                    showConfirmation({
                        title: 'Product data change',
                        message: `Do you really want to change data of product "${product.name}"?`,
                        cancelLabel: 'No',
                        confirmLabel: 'Yes',
                        variant: 'warning',

                        onConfirm: () => {
                            console.log("Sending: ", values);

                            productApi.edit(product._id, payload)
                                .then(() => {
                                    addToast('Success!', 'Product data has been updated', 'success');
                                    onSuccess();
                                    handleClose();
                                })
                                .catch((e) => {
                                    if (e)
                                        addToast('Error!', `Error occurred while updating product. Error: ${e}`, 'danger');
                                })
                        }
                    })
                    setSubmitting(false);
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
                            <Row>
                                <Col md={8} className={'align-content-center'}>
                                    <Form.Group controlId="formName" className="mb-3">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" value={product.name} disabled/>
                                    </Form.Group>

                                    <Form.Group controlId="formDesc" className="mb-3">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name='description'
                                            as={'textarea'}
                                            rows={3}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.description}
                                        />
                                    </Form.Group>
                                    <div className={'text-center'}>
                                        <Button variant={'info'} onClick={async () => {
                                            setIsLoading(true);
                                            await productApi.seoDescription(product._id)
                                                .then((r) => {
                                                    console.log(r.data.description);
                                                    values.description = r.data.description;
                                                    addToast(
                                                        'Description updated!',
                                                        'Product\'s description has been optimized.',
                                                        'info'
                                                    );
                                                    setIsLoading(false);
                                                })
                                                .catch((err) => {
                                                    console.error(err);
                                                    addToast(
                                                        'Error!',
                                                        `Error occurred while communicating with server: ${err}`,
                                                        'danger'
                                                    );
                                                    setIsLoading(false);
                                                })
                                        }}
                                        disabled={isLoading}>
                                            {isLoading ? 'Optimizing...' : 'Optimize description'}
                                        </Button>
                                    </div>
                                </Col>

                                <Col md={4}
                                     className={'align-content-center justify-content-center align-items-center'}>
                                    <Form.Group controlId="formPrice" className="mb-3">
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="unitPrice"
                                            value={values.unitPrice}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.unitPrice && !!errors.unitPrice}
                                        />
                                    </Form.Group>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.unitPrice}
                                    </Form.Control.Feedback>

                                    <Form.Group controlId="formWeight" className="mb-3">
                                        <Form.Label>Weight</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="unitWeight"
                                            value={values.unitWeight}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.unitWeight && !!errors.unitWeight}
                                        />
                                    </Form.Group>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.unitWeight}
                                    </Form.Control.Feedback>


                                    <Form.Group controlId="formPrice" className="mb-3">
                                        <Form.Label>Category</Form.Label>
                                        <Form.Select
                                            name="category"
                                            value={values.category}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.category && !!errors.category}
                                        >
                                            {categories.map((c) => (
                                                <option key={c._id} value={c._id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.category}
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};