/*
* This file defines all frontend routes for the DreamCart application.
* */

import {BrowserRouter, Routes, Route} from "react-router-dom";

import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import Products from "../pages/Products";
import AdminCreateProduct from "../pages/AdminCreateProduct";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import AdminRoute from "../components/AdminRoute.jsx";
import AdminProducts from "../pages/AdminProducts";
import AdminEditProduct from "../pages/AdminEditProduct";

function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                {/* Customer-facing application layout */}
                <Route element={<MainLayout />}>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/products"
                        element={<Products />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/wishlist"
                        element={<Wishlist />}
                    />

                    <Route
                        path="/cart"
                        element={<Cart />}
                    />

                </Route>

                <Route
                    path="/admin/products/create"
                    element={
                        <AdminCreateProduct />
                    }
                />

                <Route
                    path="/admin/products/edit/:id"
                    element={
                        <AdminEditProduct />
                    }
                />

                <Route element={<AdminRoute />}>
                <Route
                    path="/admin"
                    element={
                    <AdminDashboard/>
                    }
                    />
                </Route>

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/products"
                    element={<AdminProducts />}
                />

            </Routes>   
        </BrowserRouter>
    );
}
export default AppRoutes;