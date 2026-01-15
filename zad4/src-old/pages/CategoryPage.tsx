import { useEffect, useState } from "react"
import { fetchCategories } from "../services/CategoryService";
import { type Category } from "../types/ProductTypes";

const CategoryPage = function () {
    const [categories, setCategories] = useState<Category[]>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories()
        .then((value) => {
            setCategories(value);
            setLoading(categories === null);
        }).then((error) => {
            console.error(error);
        })
    }, [])

    if (loading) {
        return <h4>Fetching categories...</h4>
    }

    return <>
        <ul>
            {categories?.map((c) => {
                return <li>{c.name}</li>
            })}
        </ul>
    </>
}

export default CategoryPage