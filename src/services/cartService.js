/*
 * This service handles all cart-related API requests.
 * It uses the central api.js which automatically attaches
 * the user's JWT token to every request.
 */

import api from "./api";

const cartService = {

    getCart: async () => {
        const response = await api.get("/cart");
        return response.data;
    },

    addToCart: async (productId, quantity = 1) => {
        const response = await api.post("/cart/add", {
            productId,
            quantity
        });
        return response.data;
    },

    updateQuantity: async (cartItemId, quantity) => {
        const response = await api.put(`/cart/items/${cartItemId}`, {
            quantity
        });
        return response.data;
    },

    removeItem: async (cartItemId) => {
        const response = await api.delete(`/cart/items/${cartItemId}`);
        return response.data;
    },

    clearCart: async () => {
        const response = await api.delete("/cart/clear");
        return response.data;
    }
};

export default cartService;