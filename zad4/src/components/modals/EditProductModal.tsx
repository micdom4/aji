import React, {useEffect, useState} from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
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

    useEffect(() => {
        if (show) {
            categoryApi.getAll().then((r) => setCategories(r.data));
        }
    }, [show]);

    if (!product) return null;

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit product: {product.name}</Modal.Title>
            </Modal.Header>

            <Formik
                enableReinitialize={true}
                initialValues={{
                    unitPrice: product.unitPrice,
                    unitWeight: product.unitWeight,
                    category: product.category?._id || ''
                }}
                onSubmit={(values, {setSubmitting}) => {
                    const selectedCategoryObject = categories.find(c => c._id === values.category);

                    const payload = {
                        name: product.name,
                        description: product.description,
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
                                    addToast('Error!', `Error occurred while updating surname. Error: ${e}`, 'danger');
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
                            <Form.Group controlId="formName" className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" value={product.name} disabled/>
                            </Form.Group>

                            <Form.Group controlId="formDesc" className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control type="text" value={product.description} disabled/>
                            </Form.Group>

                            <Form.Group controlId="formPrice" className="mb-3">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="unitPrice"
                                    value={values.unitPrice}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.unitPrice && !!errors.unitPrice}
                                    autoFocus
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