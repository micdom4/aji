import {CrudApi} from "./BasicCrudRestApi.ts";
import {type AxiosResponse} from "axios";
import type {
    CreateOpinionType,
    CreateOrderType,
    EditOrderType,
    OrderStateType,
    OrderType
} from "../types/OrderTypes.ts";
import {apiInstance} from "./api.config.ts";

const order_path = "/orders"

const orderCrud = new CrudApi<OrderType, CreateOrderType, EditOrderType>(order_path)

export const orderApi = {
    getAll: async (): Promise<AxiosResponse<OrderType[]>> => {
        return await orderCrud.getAll()
    },

    getStates: async (): Promise<AxiosResponse<OrderStateType[]>> => {
        return await apiInstance.get(`${order_path}/status`)
    },

    getById: async (id: string): Promise<AxiosResponse<OrderType>> => {
        return await orderCrud.getById(id)
            .catch((error) => {
                throw error;
            })
    },

    create: async (order: CreateOrderType): Promise<AxiosResponse<OrderType>> => {
        return await orderCrud.create(order)
            .catch((error) => {
                throw error;
            })
    },

    edit: async (id: string, data: EditOrderType) => {
        return await orderCrud.update(id, data)
            .catch((error) => {
                throw error;
            })
    },

    addOpinion: async (id: string, opinion: CreateOpinionType) => {
        return await apiInstance.post(`${order_path}/${id}/opinions`, opinion)
            .catch((error) => {
                throw error;
            })
    }
}