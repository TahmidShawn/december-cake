import { Route, Routes } from "react-router";

import RootLayout from "../layout/RootLayout";
import DashboardLayout from "../layout/DashboardLayout";

import Home from "../pages/home/Home";
import Products from "@/pages/products/Products";
import ProductDetails from "@/pages/productDetails/ProductDetails";
import Cart from "@/pages/cart/Cart";
import Checkout from "@/pages/checkout/Checkout";
import OrderTracking from "@/pages/orderTracking/OrderTracking";

import Register from "@/pages/auth/register/Register";
import Login from "@/pages/auth/login/Login";
import VerifyEmail from "@/pages/auth/verifyEmail/VerifyEmail";

import Dashboard from "@/pages/dashboard/Dashboard";
import Orders from "@/pages/dashboard/orders/Orders";
import OrderDetails from "@/pages/dashboard/orders/OrderDetails";
import Profile from "@/pages/dashboard/profile/Profile";
import Settings from "@/pages/dashboard/settings/Settings";

import AdminDashboardLayout from "@/layout/AdminDashboardLayout";
import AdminDashboard from "@/pages/adminDashboard/AdminDashboard";
import Categories from "@/pages/adminDashboard/categories/Categories";
import AddCategory from "@/pages/adminDashboard/categories/AddCategory";
import EditCategory from "@/pages/adminDashboard/categories/EditCategory";
import AddCakes from "@/pages/adminDashboard/cakes/AddCakes";
import Cakes from "@/pages/adminDashboard/cakes/Cakes";
import UpdateCake from "@/pages/adminDashboard/cakes/UpdateCake";
import PaymentSuccess from "@/pages/paymentResult/PaymentSuccess";
import PaymentFailed from "@/pages/paymentResult/PaymentFailed";

const Router = () => {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                <Route index element={<Home />} />

                <Route path="/category/:slug" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetails />} />

                {/* Browse all cakes / search results (no category) */}
                <Route path="/products" element={<Products />} />

                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />

                <Route path="/order-tracking" element={<OrderTracking />} />
            </Route>

            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/verify-email" element={<VerifyEmail />} />

            {/* dashboard */}
            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />

                <Route path="orders" element={<Orders />} />

                <Route path="orders/:orderId" element={<OrderDetails />} />

                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
            </Route>

            {/* admin */}
            <Route path="/admin" element={<AdminDashboardLayout />}>
                <Route index element={<AdminDashboard />} />

                <Route path="categories">
                    <Route index element={<Categories />} />
                    <Route path="add" element={<AddCategory />} />
                    <Route path=":id" element={<EditCategory />} />
                </Route>
                <Route path="cakes">
                    <Route index element={<Cakes />} />
                    <Route path="add" element={<AddCakes />} />
                    <Route path=":id" element={<UpdateCake />} />
                </Route>
            </Route>
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failed" element={<PaymentFailed />} />
        </Routes>
    );
};

export default Router;
