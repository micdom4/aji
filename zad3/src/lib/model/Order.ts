import { Schema, model } from 'mongoose';
import { type Product, ProductSchema } from './Product';

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

const orderStateSchema = new Schema({
  name: {
    type: String,
    enum: Object.values(State),
    required: true
  }
});

const opinionSchema = new Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const orderSchema = new Schema({
  date: { type: Date, default: Date.now },
  state: { type: orderStateSchema, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  productList: { type: [ProductSchema], required: true },
  opinions: { type: [opinionSchema], default: [] }
});

export const OrderStateModel = model<OrderState>('statuses', orderStateSchema);
export const OrderModel = model<Order>('orders', orderSchema);
