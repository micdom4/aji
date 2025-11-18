import { Schema, model, type Document, type ObjectId } from 'mongoose';

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
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

const productSchema = new Schema(
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

