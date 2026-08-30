import api from "./api.js";

const categoryService = {
    // Used by AdminCategories.jsx
    getAllCategories: async () => {
        const response = await api.get("/categories");
        return response.data;
    },

    createCategory: async (categoryData) => {
        const response = await api.post("/categories", categoryData);
        return response.data;
    },

    deleteCategory: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },

    // Used by Home.jsx
    getCategories: async () => {
        const response = await api.get("/categories");
        return response.data;
    }
};

export default categoryService;