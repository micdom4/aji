import {CrudApi} from "./BasicCrudRestApi.ts";
import {type AxiosResponse} from "axios";
import type {AllocationType, CreateAllocationType} from "../model/AllocationTypes.ts";
import {apiInstance} from "./api.config.ts";

const allocations_path = "/allocations"

const allocationCrud = new CrudApi<AllocationType, CreateAllocationType, AllocationType>(allocations_path)

export const allocationApi = {
    getAll: async (): Promise<AxiosResponse<AllocationType[]>> => {
        return await allocationCrud.getAll()
    },

    getById: async (id: string): Promise<AxiosResponse<AllocationType>> => {
        return await allocationCrud.getById(id)
            .catch((error) => {
                throw error;
            })
    },

    getActiveForClient: async (id: string): Promise<AxiosResponse<AllocationType[]>> => {
        return await apiInstance.get(`${allocations_path}/active/client/${id}`)
            .catch((error) => {
                throw error;
            })
    },

    getPastForClient: async (id: string): Promise<AxiosResponse<AllocationType[]>> => {
        return await apiInstance.get(`${allocations_path}/past/client/${id}`)
            .catch((error) => {
                throw error;
            })
    },

    getActiveForResource: async (id: string): Promise<AxiosResponse<AllocationType[]>> => {
        return await apiInstance.get(`${allocations_path}/active/vm/${id}`)
            .catch((error) => {
                throw error;
            })
    },

    getPastForResource: async (id: string): Promise<AxiosResponse<AllocationType[]>> => {
        return await apiInstance.get(`${allocations_path}/past/vm/${id}`)
            .catch((error) => {
                throw error;
            })
    },

    create: async (allocation: CreateAllocationType): Promise<AxiosResponse<AllocationType>> => {
        return await allocationCrud.create(allocation)
            .catch((error) => {
                throw error;
            })
    },

    delete: async (id: string) => {
        return await allocationCrud.delete(id)
            .catch((error) => {
                throw error;
            })
    },

    finish: async (id: string) => {
        return await apiInstance.put(`${allocations_path}/${id}/finish`)
            .catch((error) => {
                throw error;
            })
    }
}