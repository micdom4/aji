import { Schema, model } from 'mongoose';

export interface Category {
  name: string;
}

export interface Product {
  name: string;
  description: string;
  unitPrice: number;
  unitWeight: number;
  category: Category;
}

const CategorySchema = new Schema(
  {
    name: {
      type: String, required: true, index: true
    },
  }
);

export const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    unitPrice: {
      type: Number, required: true,
      min: [0.1, "must cost at least one tenth of a dolla to be worth a holla"],
      max: [10000, "ten k is the max"],
    },
    unitWeight: {
      type: Number, required: true,
      min: [1, "I ain't selling less than a kilo"],
      max: [100, "And no more than 100"],
    },
    category: { type: CategorySchema }
  }
);

export const CategoryModel = model<Category>('categories', CategorySchema);
export const ProductModel = model<Product>('products', ProductSchema);
