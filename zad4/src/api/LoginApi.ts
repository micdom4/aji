import {loginApiInstance} from './api.config'
import type {AxiosResponse} from "axios";
import type {LoginDataType, RegisterDataType} from "../model/LoginDataType.ts";
import type {LoginResponse} from "../contexts/LoggedUserContext/types.ts";

export const loginApi = {

    login: async (loginData: LoginDataType):Promise<AxiosResponse<LoginResponse>> => {
        return await loginApiInstance.post(``, loginData)
    },

    register: async (registerData: RegisterDataType): Promise<AxiosResponse<string>> => {
        return await loginApiInstance.post(`/register`, registerData)
    }

}

