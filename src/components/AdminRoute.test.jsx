/*
 * Tests for AdminRoute.
 *
 * AdminRoute is a layout-style guard: it renders <Outlet/> for an
 * authorized admin, so it must always be used as a parent <Route>
 * wrapping nested <Route> children in AppRoutes.jsx, never as
 * <AdminRoute><Page/></AdminRoute> directly. That second pattern
 * silently renders a blank page, because AdminRoute never reads
 * props.children. These tests lock in the guard's own behavior so
 * a regression there is caught immediately.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AdminRoute from "./AdminRoute";

const mockUseAuth = vi.fn();

vi.mock("../context/AuthContext", () => ({
    useAuth: () => mockUseAuth(),
}));

function renderAdminRoute() {
    return render(
        <MemoryRouter initialEntries={["/admin"]}>
            <Routes>
                <Route path="/login" element={<div>Login Page</div>} />
                <Route path="/" element={<div>Home Page</div>} />
                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<div>Admin Dashboard</div>} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
}

describe("AdminRoute", () => {

    it("redirects to /login when the user is not authenticated", () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: false, role: null });

        renderAdminRoute();

        expect(screen.getByText("Login Page")).toBeInTheDocument();
        expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
    });

    it("redirects to / when the user is authenticated but not an admin", () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: true, role: "USER" });

        renderAdminRoute();

        expect(screen.getByText("Home Page")).toBeInTheDocument();
        expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
    });

    it("renders the nested admin page when the user is an authenticated admin", () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: true, role: "ADMIN" });

        renderAdminRoute();

        expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    });

    it("renders nothing useful when used incorrectly as a children-wrapper instead of a parent route", () => {
        // This mirrors the exact bug that shipped: AdminRoute ignores
        // props.children and only ever renders <Outlet/>. Wrapping a
        // page directly in <AdminRoute> gives an authorized admin a
        // blank screen instead of the page, because there is no
        // nested <Route> for the Outlet to match.
        mockUseAuth.mockReturnValue({ isAuthenticated: true, role: "ADMIN" });

        render(
            <MemoryRouter initialEntries={["/admin/broken"]}>
                <Routes>
                    <Route
                        path="/admin/broken"
                        element={
                            <AdminRoute>
                                <div>Admin Page Content</div>
                            </AdminRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.queryByText("Admin Page Content")).not.toBeInTheDocument();
    });
});