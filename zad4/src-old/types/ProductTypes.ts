export interface Category {
  name: String;
}

export interface Product {
  name: String;
  description: String;
  unitPrice: number;
  unitWeight: number;
  category: Category;
}