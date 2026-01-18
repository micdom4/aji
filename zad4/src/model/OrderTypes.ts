import type {BaseType} from "./BaseType.ts";
import type {ProductType} from "./ProductTypes.ts";
import * as Yup from "yup";

export enum OrderStatus {
    UNACCEPTED = 'UNACCEPTED',
    ACCEPTED = 'ACCEPTED',
    CANCELED = 'CANCELED',
    REALIZED = 'REALIZED',
}

export const OrderSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: Yup.string().required('Phone number is required').min(9, 'Phone number is too short'),
    username: Yup.string().required('Username is required'),
});

export interface OrderStateType extends BaseType {
    name: OrderStatus
}

export interface OrderType extends BaseType {
    date: Date,
    email: string,
    phoneNumber: string,
    state: OrderStateType,
    username: string,
    productList: ProductType[],
}

export interface EditOrderType {
    email: string,
    phoneNumber: string,
    state: OrderStateType,
    username: string,
}

export interface CreateOrderType {
    date: string,
    email: string,
    phoneNumber: string,
    state: OrderStateType,
    username: string,
    productList: ProductType[],
}
