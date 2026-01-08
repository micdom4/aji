import { type Product } from "./ProductTypes";

export enum State {
  CANCELED = 'CANCELED',
  UNACCEPTED = 'UNACCEPTED',
  ACCEPTED = 'ACCEPTED',
  REALIZED = 'REALIZED'
}

export interface OrderState {
  name: State;
}

export interface Opinion {
  rating: number;
  content: string;
  createdAt: Date;
}

export interface Order {
  date?: Date;
  state: OrderState;
  username: string;
  email: string;
  phoneNumber: string;
  productList: Product[];
  opinions: Opinion[];
}