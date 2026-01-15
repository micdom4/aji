import {Paths} from "./paths.ts";
import * as React from "react";
import HomePage from "../pages/HomePage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import RegisterPage from "../pages/RegisterPage.tsx";
import CreateResource from "../pages/resources/CreateResource.tsx";
import CreateAllocation from "../pages/allocations/CreateAllocation.tsx";
import EditResource from "../pages/resources/EditResource.tsx";
import ListAllocations from "../pages/allocations/ListAllocations.tsx";
import ListProducts from "../pages/resources/ListProducts.tsx";

export type RouteType = {
    Component: () => React.ReactElement,
    path: string
}

export const defaultRoutes: RouteType[] = [
    {
        path: Paths.default.home,
        Component: HomePage,
    },
]

export const anonymousRoutes: RouteType[] = [
    {
        path: Paths.anonymous.login,
        Component: LoginPage
    },
    {
        path: Paths.anonymous.register,
        Component: RegisterPage
    }
]

export const workerRoutes: RouteType[] = [
    {
        path: Paths.worker.listProducts,
        Component: ListProducts
    },
    {
        path: Paths.worker.createProduct,
        Component: CreateResource
    },
    {
        path: Paths.worker.editProduct,
        Component: EditResource
    },
    {
        path: Paths.worker.createOrder,
        Component: CreateAllocation
    },
    {
        path: Paths.worker.listOrders,
        Component: ListAllocations
    }
]

export const clientRoutes: RouteType[] = [
    {
        path: Paths.worker.listProducts,
        Component: ListProducts
    },
    {
        path: Paths.worker.createOrder,
        Component: CreateAllocation
    },
    {
        path: Paths.worker.listOrders,
        Component: ListAllocations
    }
]