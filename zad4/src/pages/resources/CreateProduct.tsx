import {Formik} from 'formik';
import {Button, Col, Form, Row} from 'react-bootstrap';
import useToast from "../../components/toasts/useToast.tsx";
import useModal from "../../components/modals/useModal.tsx";
import {productApi} from "../../api/ProductRestApi.ts";
import type {CategoryType} from "../../model/CategoryTypes.ts";
import {useEffect, useState} from "react";
import {categoryApi} from "../../api/CategoryRestApi.ts";
import {ProductSchema} from "../../model/ProductTypes.ts";

export default function CreateProduct() {
    const {addToast} = useToast()
    const {showConfirmation} = useModal()
    const [categories, setCategories] = useState<CategoryType[]>([]);

    useEffect(() => {
        categoryApi.getAll().then((r) => setCategories(r.data));
    }, []);

    return (
        <Formik
            enableReinitialize={true}
            validationSchema={ProductSchema}
            initialValues={{
                name: '',
                description: '',
                unitPrice: 0.0,
                unitWeight: 0.0,
                category: '',
            }}
            onSubmit={(values, {setSubmitting}) => {
                const selectedCategoryObject = categories.find(c => c._id === values.category);

                const payload = {
                    ...values,
                    category: selectedCategoryObject,
                }

                showConfirmation({
                    title: 'Product data change',
                    message: `Do you want to create new product with name: "${values.name}"?`,
                    cancelLabel: 'No',
                    confirmLabel: 'Yes',
                    variant: 'primary',

                    onConfirm: () => {
                        console.log("Sending: ", payload);

                        productApi.create(payload)
                            .then(() => {
                                addToast('Success!',
                                    `New product with name ${payload.name} has been created`,
                                    'success');
                            })
                            .catch((e) => {
                                if (e)
                                    addToast('Error!',
                                        `Error occurred while creating new product. Error: ${e}`,
                                        'danger');
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
                <Form noValidate onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-white">
                    <h2 className={"mb-3"}>Create new product</h2>
                    <Row>
                        <Col md={8} className={'align-content-center'}>
                            <Form.Group controlId="formName" className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder={"e.g. Good stuff"}
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.name && !!errors.name}
                                    autoFocus
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formDesc" className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    as={"textarea"}
                                    rows={2}
                                    name="description"
                                    placeholder={"e.g. Very good stuff"}
                                    value={values.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.description && !!errors.description}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.description}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={4} className={'align-content-center'}>
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
                                <Form.Control.Feedback type="invalid">
                                    {errors.unitPrice}
                                </Form.Control.Feedback>
                            </Form.Group>

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
                                <Form.Control.Feedback type="invalid">
                                    {errors.unitWeight}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group controlId="formPrice" className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            name="category"
                            value={values.category}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.category && !!errors.category}
                        >
                            <option>-- Select category --</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.category}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                </Form>
            )}
        </Formik>
    );
};