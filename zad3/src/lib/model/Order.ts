import { type Product } from "./Product";
import { Schema, model, type Document, type ObjectId } from 'mongoose';

enum State {
  UNACCEPTED,
  ACCEPTED,
  CANCELED,
  REALIZED
}

export interface OrderState {
  id: string;
  state: State;
}

export interface Order {
  id: string;
  date?: Date;
  state: OrderState;
  username: String;
  email: String;
  phoneNumber: String;
  productList: Product[];
}



