import axios, {AxiosError, type InternalAxiosRequestConfig} from 'axios'
import {tokenStorageName} from "../contexts/LoggedUserContext/tokenStorageConfig.ts";

export const API_URL = "/api"
export const TIMEOUT_IN_MS = 10000
export const DEFAULT_HEADERS = {
    'Accept': 'application/json',
    'Content-type': 'application/json',
}

export const apiInstance = axios.create({
    baseURL: API_URL,
    timeout: TIMEOUT_IN_MS,
    headers: DEFAULT_HEADERS,
})

const authorizationRequestInterceptor = (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem(tokenStorageName)

    if (token && config.headers) {
        config.headers.Authorization = "Bearer " + token
    }

    return config
}

const errorMessages = {
    serverError: "Internal Server Error!!!",
    unknownError: "Unknown Error"
}

apiInstance.interceptors.request.use(
    (config) => {
        return authorizationRequestInterceptor(config)
    }
)

apiInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        if (!error.response) {
            console.error(error);
            throw new Error(errorMessages.unknownError)
        } else {
            const status = error.response.status;

            if (status === 500) {
                console.error(error);
                throw new Error(errorMessages.serverError)
            }
        }

        return Promise.reject(error);
    }
);

export const loginApiInstance = axios.create({
    baseURL: API_URL + "/login",
    timeout: TIMEOUT_IN_MS,
    headers: DEFAULT_HEADERS
})

loginApiInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        if (!error.response) {
            console.error(error);
            throw new Error(errorMessages.unknownError)
        } else {
            const status = error.response.status;

            if (status === 500) {
                console.error(error);
                throw new Error(errorMessages.serverError)
            }
        }

        return Promise.reject(error);
    }
);
