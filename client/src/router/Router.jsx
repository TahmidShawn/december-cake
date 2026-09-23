import { Route, Routes } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/home/Home";

const Router = () => {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                <Route index element={<Home />} />
            </Route>
        </Routes>
    );
};

export default Router;
