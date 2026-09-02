/*
 * Tests for PrivateRoute.
 *
 * Unlike AdminRoute, PrivateRoute correctly reads props.children,
 * so it's meant to be used exactly as it's used for /checkout,
 * /orders, and /profile in AppRoutes.jsx:
 * <PrivateRoute><Page/></PrivateRoute>
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

const mockUseAuth = vi.fn();

vi.mock("../context/AuthContext", () => ({
    useAuth: () => mockUseAuth(),
}));

function renderPrivateRoute() {
    return render(
        <MemoryRouter initialEntries={["/orders"]}>
            <Routes>
                <Route path="/login" element={<div>Login Page</div>} />
                <Route
                    path="/orders"
                    element={
                        <PrivateRoute>
                            <div>My Orders</div>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </MemoryRouter>
    );
}

describe("PrivateRoute", () => {

    it("redirects to /login when the user is not authenticated", () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: false });

        renderPrivateRoute();

        expect(screen.getByText("Login Page")).toBeInTheDocument();
        expect(screen.queryByText("My Orders")).not.toBeInTheDocument();
    });

    it("renders the wrapped page when the user is authenticated", () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: true });

        renderPrivateRoute();

        expect(screen.getByText("My Orders")).toBeInTheDocument();
    });
});