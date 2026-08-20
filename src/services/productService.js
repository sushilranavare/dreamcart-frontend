/*
 * This service handles all product-related API requests.
 * It communicates with the Spring Boot backend.
 */

import api from "./api";

const productService = {

    /*
     * Fetches paginated products. with optional search , category filtering , and sorting.
     */
    getProducts: async({
                           page = 0,
                           size = 5,
                           sortBy = "id",
                           sortDir = "asc",
                           keyword = "",
                           categoryId
                       } = {}) => {

        const response =
            await api.get(
                "/products",
                {
                    params: {
                        page,
                        size,
                        sortBy,
                        sortDir,
                        keyword,
                        categoryId
                    }
                }
            );

        return response.data;
    },
    /*Fetches a single product by id */
    getProductById: async (id) =>{

        const response =
            await api.get(
                `/products/${id}`
            );
        return response.data;
    },

    /*
    * Create a new product.
    *
    * The request contains:
    * - Product JSON data
    * - Product image file
    *
    * FormData automatically sets the correct
    * multipart/form-data Content-Type boundary.
    */
    createProduct: async (formData) => {

        const response =
            await api.post(
                "/products",
                formData
            );

        return response.data;
    },
    /* Update an existing product */

    updateProduct: async (id, productData) =>{
        const response =
            await api.put(
                `/products/${id}`,
                productData
            )
        return response.data;
    },
/* Delete product by id */
    deleteProduct: async (id) =>{
        const response =
            await api.delete(
                `/products/${id}`
            );
        return response.data;
    }

};

export default productService;