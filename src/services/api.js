/*
 * This file contains the central Axios configuration
 * used for communication with the DreamCart backend API.
 *
 * The Axios interceptor automatically attaches the JWT token
 * to every authenticated API request.
 */

import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json"
    }
});

/*
 * Axios request interceptor.
 *
 * Before every request:
 * 1. Read the JWT token from localStorage.
 * 2. Add it to the Authorization header.
 *
 * The backend expects:
 *
 * Authorization: Bearer <JWT_TOKEN>
 */
api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {

        return Promise.reject(error);
    }
);

export default api;