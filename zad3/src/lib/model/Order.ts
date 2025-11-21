import { type Product, ProductSchema } from "./Product";
import { Schema, model } from 'mongoose';

enum State {
  UNACCEPTED = 'UNACCEPTED',
  ACCEPTED = 'ACCEPTED',
  CANCELED = 'CANCELED',
  REALIZED = 'REALIZED'
}

export interface OrderState {
  name: State;
}

export interface Order {
  date?: Date;
  state: OrderState;
  username: String;
  email: String;
  phoneNumber: String;
  productList: Product[];
}

const orderStateSchema = new Schema(
  {
    name: {
      type: String, enum: Object.values(State), required: true
    },
  }
);

const orderSchema = new Schema(
  {
    date: { type: Date },
    state: { type: orderStateSchema, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    productList: { type: [ProductSchema], required: true }
  }
);

export const OrderStateModel = model<OrderState>('statuses', orderStateSchema);
export const OrderModel = model<Order>('orders', orderSchema);
