import {useEffect, useMemo, useState, useTransition} from "react";
import {type Column, GenericTable} from "../../components/GenericTable.tsx";
import type {ProductType} from "../../model/ProductTypes.ts";
import {productApi} from "../../api/ProductRestApi.ts";

export default function ListProducts() {
    const [resources, setResources] = useState<ProductType[]>([])
    const [isPending, startTransition] = useTransition()

    const columns: Column<ProductType>[] = useMemo(() => [
        {header: 'ID', render: (p) => <span className="text-secondary">#{p._id}</span>},
        {header: 'Name', render: (p) => p.name},
        {header: 'Description', render: (p) => p.description},
        {header: 'Price', render: (p) => p.unitPrice},
        {header: 'Weight', render: (p) => p.unitWeight},
        {header: 'Category', render: (p) => p.category.name},
    ], []);

    const loadProducts = () => {
        startTransition(() => {
            productApi.getAll().then((response) => {
                setResources(response.data);
            })
        })
    }

    useEffect(() => {
        loadProducts()
    }, [])

    return (
        <div className="container mt-4">
            <h2>Products</h2>
            {isPending ? <p>Fetching data...</p> : <GenericTable data={resources} columns={columns}/>}
        </div>
    );
}