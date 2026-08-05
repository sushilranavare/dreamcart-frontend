/*
 * Authentication service.
 *
 * This service communicates with the backend authentication
 * API to perform user login and registration.
 *
 * It is also responsible for:
 * - storing JWT tokens
 * - storing the logged-in user's role
 * - removing authentication data during logout
 * - checking authentication status
 */

import api from "./api";

const authService = {

    login: async (email, password) => {

        const response = await api.post(
            "/auth/login",
            {
                email,
                password
            }
        );

        const data = response.data;

        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "role",
            data.role
        );

        return data;
    },


    register: async (userData) => {

        const response = await api.post(
            "/auth/register",
            userData
        );

        const data = response.data;

        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "role",
            data.role
        );

        return data;
    },


    logout: () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "role"
        );
    },


    isAuthenticated: () => {

        return Boolean(
            localStorage.getItem("token")
        );
    },


    getRole: () => {

        return localStorage.getItem(
            "role"
        );
    }

};

export default authService;