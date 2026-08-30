/*
* This file defines all frontend routes for the DreamCart application.
* */

import {BrowserRouter, Routes, Route, Router} from "react-router-dom";

import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import Products from "../pages/Products";
import AdminCreateProduct from "../pages/admin/AdminCreateProduct.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminRoute from "../components/AdminRoute.jsx";
import AdminProducts from "../pages/admin/AdminProducts.jsx";
import AdminEditProduct from "../pages/admin/AdminEditProduct.jsx";
import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";
import PrivateRoute from "../components/PrivateRoute";
import Orders from "../pages/Orders";
import AdminOrders from "../pages/admin/AdminOrders.jsx";
//import EditProduct from "../pages/admin/EditProduct";
import Navbar from "../components/Navbar.jsx";
import AdminCategories from "../pages/admin/AdminCategories.jsx";

// Adjust path depending on where you saved it!
// (Make sure the path and name match your actual file)

function AppRoutes(){
    return(

        <BrowserRouter>
                <Navbar />
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
                <Route path="/products/:id" element={<ProductDetails />} />

                <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />

                <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />

                <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                <Route path="/admin/categories" element={<AdminCategories />} />

             </Routes>
        </BrowserRouter>

    );
}
export default AppRoutes;