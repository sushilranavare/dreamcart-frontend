/*
* This file defines all frontend routes for the DreamCart application.
* */

import {BrowserRouter, Routes, Route} from "react-router-dom";

import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout.jsx";

function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                {/* Customer-facing application layout. */}
                <Route element={<MainLayout />}>
                    <Route
                    path="/"
                    element={<Home />}
                />
               </Route>
            </Routes>
        </BrowserRouter>
    );
}
export default AppRoutes;