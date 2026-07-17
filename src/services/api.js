/*
* This files configures Axios for communication between the react frontend and spring boot backend.
* */

import axios from "axios";
const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
})
export default api;