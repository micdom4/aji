import {use, useEffect, useMemo, useState, useTransition} from "react";
import {type Column, GenericTable} from "../../components/GenericTable.tsx";
import type {ProductType} from "../../types/ProductTypes.ts";
import {productApi} from "../../api/ProductRestApi.ts";
import LoggedUserContext from "../../contexts/LoggedUserContext";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import {EditProductModal} from "../../components/modals/EditProductModal.tsx";
import type {CategoryType} from "../../types/CategoryTypes.ts";
import {categoryApi} from "../../api/CategoryRestApi.ts";
import {useCart} from "../../contexts/useCart.tsx";
import {useNavigate} from "react-router-dom";
import useModal from "../../components/modals/useModal.tsx";
import useToast from "../../components/toasts/useToast.tsx";
import {Paths} from "../../routes/paths.ts";

export default function ListProducts() {
    const [products, setProducts] = useState<ProductType[]>([])
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [isPending, startTransition] = useTransition()

    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const {user} = use(LoggedUserContext)

    const navigate = useNavigate();

    const {addToCart} = useCart();

    const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const {showConfirmation} = useModal()
    const {addToast} = useToast()

    const handleEdit = (product: ProductType) => {
        setEditingProduct(product);
        setShowEditModal(true);
    };

    const handleEditSuccess = () => {
        loadProducts();
    };

    const handleDelete = (product: ProductType) => {
        showConfirmation({
            title: "Unrecoverable operation",
            message: `This operation will permanently delete product: "${product.name}".`,
            confirmLabel: "Delete it.",
            cancelLabel: "Cancel deleting.",
            variant: "danger",

            onConfirm: () => {
                productApi.delete(product._id)
                    .then(() => {
                        addToast(
                            "Successfully deleted",
                            `Product ${product.name} has been successfully deleted.`,
                            'success'
                        )
                        loadProducts();
                    })
                    .catch((error) => {
                        console.log(error);
                        addToast(
                            "Error while deleting",
                            `Cannot delete product "${product.name}". Error: ${error}.`,
                            'danger'
                        )
                    })
            }
        })
    }

// eslint-disable-next-line react-hooks/preserve-manual-memoization
    const columns: Column<ProductType>[] = useMemo(() => [
        {header: 'ID', render: (p) => <span className="text-secondary">#{p._id}</span>},
        {header: 'Name', render: (p) => p.name},
        {header: 'Description', render: (p) => p.description},
        {header: 'Price', render: (p) => p.unitPrice},
        {header: 'Weight', render: (p) => p.unitWeight},
        {header: 'Category', render: (p) => p.category?.name},
        {
            header: 'Action',
            render: (p) => {
                return (
                    <>
                        <Button onClick={() => addToCart(p)} variant={'success'}>Add to the Cart</Button>
                        {user.isWorker() && <Button onClick={() => handleEdit(p)} variant={'primary'}>Edit</Button>}
                        {user.isWorker() && <Button onClick={() => handleDelete(p)} variant={'danger'}>Delete</Button>}
                    </>
                )
            }
        }
    ], [user]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesName = product.name.toLowerCase().includes(searchText.toLowerCase());

            const matchesCategory = selectedCategory === "" || product.category?._id === selectedCategory;

            return matchesName && matchesCategory;
        });
    }, [products, searchText, selectedCategory]);

    const loadProducts = () => {
        startTransition(() => {
            productApi.getAll().then((response) => {
                setProducts(response.data);
            })
        })
    }

    useEffect(() => {
        loadProducts()
        categoryApi.getAll().then((response) => {
            setCategories(response.data);
        });
    }, [])

    return (
        <div className="container mt-4">
            <h2>Products</h2>

            <Row className="mb-3 g-2">
                <Col md={8} lg={9}>
                    <InputGroup>
                        <InputGroup.Text>🔍Search:</InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Type product name..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={4} lg={3}>
                    <Form.Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        aria-label="Filter by category"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            {isPending ? <p>Fetching data...</p> : <GenericTable data={filteredProducts} columns={columns}/>}

            {user.isWorker() ?
                <Button onClick={() => navigate(Paths.worker.createProduct)}>Create new product</Button> :
                null}

            <EditProductModal
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                product={editingProduct}
                onSuccess={handleEditSuccess}
            />
        </div>
    );
}