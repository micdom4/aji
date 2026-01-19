import type {BaseType} from "./BaseType.ts";
import type {CategoryType} from "./CategoryTypes.ts";
import * as Yup from "yup";

export interface ProductType extends BaseType {
    name: string;
    description: string;
    unitPrice: number;
    unitWeight: number;
    category: CategoryType;
}

export const ProductSchema = Yup.object().shape({
    name: Yup.string().required(),
    description: Yup.string().required(),
    unitPrice: Yup.number().positive().required(),
    unitWeight: Yup.number().positive().required(),
    category: Yup.string().required(),
})

export interface CreateProductType {
    name: string;
    description: string;
    unitPrice: number;
    unitWeight: number;
    category: CategoryType | undefined;
}

export interface EditProductType {
    name: string;
    description: string;
    unitPrice: number;
    unitWeight: number;
    category: CategoryType | undefined;
}

export interface SeoDescriptionType {
    description: string;
}