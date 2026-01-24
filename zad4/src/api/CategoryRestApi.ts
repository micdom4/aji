import type {AxiosResponse} from "axios";
import {CrudApi} from "./BasicCrudRestApi.ts";
import type {CategoryType, CreateCategoryType} from "../types/CategoryTypes.ts";

const category_path = '/categories';

const categoryCrudApi = new CrudApi<CategoryType, CreateCategoryType>(category_path);

export const categoryApi = {

    getAll: async (): Promise<AxiosResponse<CategoryType[]>> => {
        return categoryCrudApi.getAll();
    },

    getById: async (id: string): Promise<AxiosResponse<CategoryType>> => {
        return categoryCrudApi.getById(id);
    },

    create: async (category: CreateCategoryType): Promise<AxiosResponse<CategoryType>> => {
        return categoryCrudApi.create(category);
    }
}

