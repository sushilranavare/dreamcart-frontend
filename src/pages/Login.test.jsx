/*
 * Tests for the Login page.
 *
 * Only the network boundary (services/api.js) is mocked - everything
 * else, including AuthContext and authService, runs for real, so
 * these tests exercise the actual login flow: form submit -> API
 * call -> token/role stored -> redirect to home.
 *
 * Note: the <label> elements in Login.jsx aren't linked to their
 * <input>s via htmlFor/id, so getByLabelText can't find them. The
 * inputs are queried by type instead rather than papering over that
 * gap in the test.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Login from "./Login";
import api from "../services/api";

vi.mock("../services/api", () => ({
    default: {
        post: vi.fn(),
    },
}));

function renderLoginPage() {
    const utils = render(
        <MemoryRouter initialEntries={["/login"]}>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<div>Home Page</div>} />
                </Routes>
            </AuthProvider>
        </MemoryRouter>
    );

    return {
        ...utils,
        emailInput: utils.container.querySelector('input[type="email"]'),
        passwordInput: utils.container.querySelector('input[type="password"]'),
    };
}

describe("Login", () => {

    beforeEach(() => {
        api.post.mockReset();
    });

    it("logs in successfully and redirects to home", async () => {
        const user = userEvent.setup();

        api.post.mockResolvedValueOnce({
            data: { token: "fake-jwt-token", role: "USER" },
        });

        const { emailInput, passwordInput } = renderLoginPage();

        await user.type(emailInput, "jane@example.com");
        await user.type(passwordInput, "password123");
        await user.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText("Home Page")).toBeInTheDocument();
        });

        expect(api.post).toHaveBeenCalledWith("/auth/login", {
            email: "jane@example.com",
            password: "password123",
        });
        expect(localStorage.getItem("token")).toBe("fake-jwt-token");
        expect(localStorage.getItem("role")).toBe("USER");
    });

    it("shows an error message and stays on the page when login fails", async () => {
        const user = userEvent.setup();

        api.post.mockRejectedValueOnce({
            response: { data: { message: "Invalid email or password" } },
        });

        const { emailInput, passwordInput } = renderLoginPage();

        await user.type(emailInput, "jane@example.com");
        await user.type(passwordInput, "wrong-password");
        await user.click(screen.getByRole("button", { name: /login/i }));

        expect(await screen.findByText("Invalid email or password")).toBeInTheDocument();
        expect(screen.queryByText("Home Page")).not.toBeInTheDocument();
        expect(localStorage.getItem("token")).toBeNull();
    });
});