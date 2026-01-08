import { useEffect, useState } from "react";
import { type Category, type Product } from "../types/ProductTypes";
import api from "../services/api";
import { Table, Button, Form } from "react-bootstrap";
import { fetchCategories } from "../services/CategoryService";

async function fetchProducts(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products');
    return response.data;
}

const ProductsPage = function () {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [addProduct, setAddProduct] = useState(false);

    useEffect(() => {
        fetchProducts().then((value) => {
            setProducts(value);
        }).then((error) => {
            console.error(error);
        })
    }, [])

    if (products === null) {
        return <h2>Who tf are you?</h2>
    }

    return <>
        <h1>There will be some products you nigger</h1>
        <Button variant="primary" className="w-100" onClick={() => setAddProduct(true)}>Dodaj nowy produkt</Button>
        <Table striped hover bordered>
            <thead>
                <tr>
                    <th>Nazwa</th>
                    <th>Cena</th>
                    <th>Opis</th>
                    <th>Waga</th>
                    <th>Kategoria</th>
                </tr>
            </thead>
            <tbody>
                {ProductsTable(products)}
            </tbody>
        </Table>
        {addProduct ? <ProductForm /> : <></>}
    </>
};

function ProductsTable(products: Product[]) {
    return <>
        {products.map((p) => {
            return <tr>
                <td>{p.name}</td>
                <td>{p.unitPrice}</td>
                <td>{p.description}</td>
                <td>{p.unitWeight}</td>
                <td>{p.category.name}</td>
                <td>{<CartButton />}</td>
            </tr>
        })}
    </>
}

const CartButton = function () {
    return <Button
        variant="outline-secondary"
        size="sm"
        value={"Dodaj do koszyka"}
    >+🛒</Button>
}

const ProductForm = function () {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [weight, setWeight] = useState(0);
    const [category, setCategory] = useState<Category | null>(null);
    const [categories, setCategories] = useState<Category[]>();

    useEffect(() => {
        fetchCategories().then((value) => setCategories(value));
    })

    const addProduct = () => {
        console.log("Adding new product...");
        console.log("Product name: ", name);
        console.log("Product price: ", price);
        console.log("Product description: ", description);
        console.log("Product weight: ", weight);
        console.log("Product category: ", category?.name);
    }

    const stringToCategory = (name: String) => {
        var cat;
        categories?.forEach(c => {
            if (c.name == name) {
                cat = c;
            }
        });

        if (cat !== undefined) {
            return cat;
        }

        throw new Error(`Brak takiej kategori "${name}"`);
    }

    return <>
        <h2>Dodaj nowy produkt:</h2>
        <Form onSubmit={addProduct}>
            <Form.Group>
                <Form.Label>Nazwa</Form.Label>
                <Form.Control type="text" placeholder="np. Laptop gamingowy" value={name}
                    onChange={(e) => setName(e.target.value)} required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Cena</Form.Label>
                <Form.Control type="text" placeholder="np. 3199.99" value={price}
                    onChange={(e) => setPrice(Number(e.target.value))} required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Opis</Form.Label>
                <Form.Control type="text" placeholder="np. Super szybki laptop gejmingowy pozwalająco grać na pełnej petardzie. SZYBKI DYSK SSD!!!"
                    value={description} onChange={(e) => setDescription(e.target.value)} required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Ciężar</Form.Label>
                <Form.Control type="text" placeholder="np. 6.7" value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))} required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Kategoria</Form.Label>
                <Form.Select onChange={(e) => setCategory(stringToCategory(e.target.value))}>
                    {categories?.map((c) => {
                        return <option>{c.name}</option>
                    })}
                </Form.Select>
            </Form.Group>
            <Button type="submit">Dodaj produkt</Button>
        </Form>
    </>
}

export default ProductsPage;