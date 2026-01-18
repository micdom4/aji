import {CrudApi} from "./BasicCrudRestApi.ts";
import axios, {type AxiosResponse} from "axios";
import type {CreateProductType, EditProductType, ProductType} from "../model/ProductTypes.ts";

const products_api = "/products"

const productsCrud = new CrudApi<ProductType, CreateProductType, EditProductType>(products_api)

const errorMessages = {
    notFound: "Product not found",
    invalidId: "Invalid ID of Product",
    invalidData: "Product data validation error"
}

export const productApi = {
    getAll: async (): Promise<AxiosResponse<ProductType[]>> => {
        return await productsCrud.getAll()
    },

    getById: async (id: string): Promise<AxiosResponse<ProductType>> => {
        return await productsCrud.getById(id)
            .catch((error) => {
                if (axios.isAxiosError(error) && error.response) {
                    if (error.response.status === 404) {
                        throw new Error(errorMessages.notFound)
                    }
                    if (error.response.status === 422) {
                        throw new Error(errorMessages.invalidId)
                    }
                }

                throw error;
            })
    },

    create: async (product: CreateProductType): Promise<AxiosResponse<ProductType>> => {
        return await productsCrud.create(product)
            .catch((error) => {
                if (axios.isAxiosError(error) && error.response) {
                    if (error.response.status === 400) {
                        throw new Error(errorMessages.invalidData)
                    }
                }

                throw error;
            })
    },

    edit: async (id: string, data: EditProductType): Promise<AxiosResponse<ProductType>> => {
        return await productsCrud.update(id, data)
            .catch((error) => {
                if (axios.isAxiosError(error) && error.response) {
                    if (error.response.status === 400) {
                        throw new Error(errorMessages.invalidData)
                    }
                    if (error.response.status === 404) {
                        throw new Error(errorMessages.notFound)
                    }
                    if (error.response.status === 422) {
                        throw new Error(errorMessages.invalidId)
                    }
                }


                throw error;
            })
    },

    delete: async (id: string) => {
        return await productsCrud.delete(id)
            .catch((error) => {
                if (axios.isAxiosError(error) && error.response) {
                    if (error.response.status === 404) {
                        throw new Error(errorMessages.notFound)
                    }
                    if (error.response.status === 422) {
                        throw new Error(errorMessages.invalidId)
                    }
                }

                throw error;
            })
    }
}