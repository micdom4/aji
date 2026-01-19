import type {BaseType} from "./BaseType.ts";

export interface CategoryType extends BaseType {
    name: string;
}

export interface CreateCategoryType {
    name: string;
}