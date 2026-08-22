import api from "./api";

const wishlistService = {

    getWishlist: async () => {
        const response = await api.get("/wishlist");
        return response.data;
    },

    addToWishlist: async (productId) => {
        // We send the productId inside an object to match the WishlistRequest DTO
        const response = await api.post("/wishlist/add", { productId });
        return response.data;
    },

    removeFromWishlist: async (productId) => {
        const response = await api.delete(`/wishlist/${productId}`);
        return response.data;
    }
};

export default wishlistService;