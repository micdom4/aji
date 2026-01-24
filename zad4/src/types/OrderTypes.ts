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
    opinions: OpinionType[]
}

export interface EditOrderType {
    email: string,
    phoneNumber: string,
    state: OrderStateType,
    username: string,
    productList: ProductType[],
}

export interface CreateOrderType {
    date: string,
    email: string,
    phoneNumber: string,
    state: OrderStateType,
    username: string,
    productList: ProductType[],
}

export interface OpinionType {
    rating: number;
    content: string;
    createdAt: Date;
}

export interface CreateOpinionType {
    rating: number;
    content: string;
}

export const OpinionSchema = Yup.object().shape({
    rating: Yup.number()
        .min(1, 'Minimum rating is 1')
        .max(5, 'Maximum rating is 5')
        .required('Rating is required'),
    content: Yup.string()
        .required('Content is required')
        .min(5, 'Opinion is too short'),
});