import {Paths} from "./paths.ts";
import * as React from "react";
import HomePage from "../pages/HomePage.tsx";
import LoginPage from "../pages/login/LoginPage.tsx";
import RegisterPage from "../pages/login/RegisterPage.tsx";
import CreateProduct from "../pages/products/CreateProduct.tsx";
import ListProducts from "../pages/products/ListProducts.tsx";
import ListOrders from "../pages/orders/ListOrders.tsx";
import CartPage from "../pages/orders/CartPage.tsx";
import InitPage from "../pages/products/InitPage.tsx";

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

export const clientRoutes: RouteType[] = [
    {
        path: Paths.client.listProducts,
        Component: ListProducts
    },
    {
        path: Paths.client.listOrders,
        Component: ListOrders
    },
    {
        path: Paths.client.cart,
        Component: CartPage
    }
]

export const workerRoutes: RouteType[] = [
    {
        path: Paths.worker.listProducts,
        Component: ListProducts
    },
    {
        path: Paths.worker.createProduct,
        Component: CreateProduct
    },
    {
        path: Paths.worker.listOrders,
        Component: ListOrders
    },
    {
        path: Paths.worker.initProducts,
        Component: InitPage
    }
]
