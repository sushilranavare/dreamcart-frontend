/* This service handles all request related category API request. */

import api from "./api.js";

const getCategories = async () => {
    const response = await api.get("/categories");

    return response.data;
};

export default {getCategories};
