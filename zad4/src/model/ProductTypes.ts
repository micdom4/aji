import type {BaseType} from "./BaseType.ts";

export interface Category {
  name: string;
}

export interface ProductType extends BaseType {
  name: string;
  description: string;
  unitPrice: number;
  unitWeight: number;
  category: Category;
}

export interface CreateProductType {
  name: string;
  description: string;
  unitPrice: number;
  unitWeight: number;
  category: Category;
}