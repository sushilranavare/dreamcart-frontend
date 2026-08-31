import api from "./api"

const reviewService = {
    getReviewsForProduct: async (productId) => {
        const response = await api.get(`/reviews/product/${productId}`);
        return response.data;
    },

    addReview: async (productId, rating, comment) => {
        const response = await api.post("/reviews", {productId, rating, comment});
        return response.data;
    },

    updateReview: async (id, productId, rating, comment) => {
        const response = await api.put(`/reviews/${id}`, {productId, rating, comment});
        return response.data;
    },

    deleteReview: async (id) => {
        const response = await api.delete(`/reviews/${id}`);
        return response.data;
    }
};

export default reviewService;