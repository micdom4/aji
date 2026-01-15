import HomePage from "../pages/HomePage"
import LoginPage from "../pages/LoginPage"
import ProductCreatePage from "../pages/products/ProductCreatePage"
import ProductEditPage from "../pages/products/ProductEditPage"
import ProductsListPage from "../pages/products/ProductsListPage"
import { Paths } from "./paths"

export type RouteType = {
    path: string,
    Page: () => React.ReactElement
}

export const defaultRoutes: RouteType[] = [
    {
        path: Paths.default.home,
        Page: HomePage
    }
]

export const anonymousRoutes: RouteType[] = [
    {
        path: Paths.anonymous.login,
        Page: LoginPage
    }
]

export const workerRoutes: RouteType[] = [
    {
        path: Paths.worker.listProducts,
        Page: ProductsListPage
    },
    {
        path: Paths.worker.createProduct,
        Page: ProductCreatePage
    },
    {
        path: Paths.worker.editProduct,
        Page: ProductEditPage
    }
]

export const clientRoutes: RouteType[] = [
    {
        path: Paths.client.listProducts,
        Page: ProductsListPage
    }
]