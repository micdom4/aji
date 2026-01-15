import { Navigate, Route, Routes } from "react-router-dom";
import { Paths } from "./paths";
import { defaultRoutes } from "./routes";
import DefaultLayout from "../components/layouts/DefaultLayout";

export default function RoutesComponent() {
    return <>
        <Routes>
            {defaultRoutes.map(({path, Page}) => (
                <Route key={path} path={path} element={
                    <DefaultLayout>
                        <Page />
                    </DefaultLayout>
                }
                />
            ))}
            <Route path="*" element={<Navigate to={Paths.default.home} />}/>
        </Routes>
    </>
}