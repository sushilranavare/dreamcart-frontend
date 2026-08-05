/*
 * This service handles all product-related API requests.
 * It communicates with the Spring Boot backend.
 */

import api from "./api";

const productService = {

    /*
     * Fetches paginated products.
     */
    getProducts: async (params) => {

        const response =
            await api.get(
                "/products",
                {
                    params
                }
            );

        return response.data;
    },


    /*
     * Creates a new product with an image.
     *
     * The request is sent as multipart/form-data.
     */
    createProduct: async (formData) => {

        const response =
            await api.post(
                "/products",
                formData
            );

        return response.data;
    }

};

export default productService;