import { Route, Routes } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/home/Home";
import Products from "@/pages/products/Products";
import ProductDetails from "@/pages/productDetails/ProductDetails";
import Cart from "@/pages/cart/Cart";
import Checkout from "@/pages/checkout/Checkout";

const Router = () => {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                <Route index element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
            </Route>
        </Routes>
    );
};

export default Router;
