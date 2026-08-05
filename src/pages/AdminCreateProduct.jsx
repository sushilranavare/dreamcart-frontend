/*
 * This page allows administrators to create new products.
 *
 * Product information and the product image are submitted
 * to the backend using multipart/form-data.
 */

import { useEffect, useState } from "react";

import productService from "../services/productService";
import categoryService from "../services/categoryService";

function AdminCreateProduct() {

    /*
     * Product form fields
     */
    const [name, setName] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [price, setPrice] =
        useState("");

    const [stockQuantity, setStockQuantity] =
        useState("");

    const [categoryId, setCategoryId] =
        useState("");


    /*
     * Uploaded image file
     */
    const [image, setImage] =
        useState(null);


    /*
     * Categories loaded from backend
     */
    const [categories, setCategories] =
        useState([]);


    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    /*
     * Load categories from the backend
     */
    useEffect(() => {

        const loadCategories = async () => {

            try {

                const data =
                    await categoryService.getCategories();

                setCategories(data);

            } catch (error) {

                console.error(
                    "Failed to load categories:",
                    error
                );

                setError(
                    "Unable to load categories."
                );
            }
        };

        loadCategories();

    }, []);


    /*
     * Handles image selection.
     */
    const handleImageChange = (event) => {

        const selectedImage =
            event.target.files[0];

        setImage(selectedImage);
    };


    /*
     * Handles product form submission.
     */
    const handleSubmit = async (event) => {

        event.preventDefault();

        setLoading(true);

        setMessage("");

        setError("");


        try {

            /*
             * Create multipart form data.
             */
            const formData =
                new FormData();


            /*
             * Product data must be sent
             * as JSON inside the "product" part.
             */
            const productData = {

                name: name,

                description: description,

                price: Number(price),

                stockQuantity:
                    Number(stockQuantity),

                categoryId:
                    Number(categoryId)
            };


            formData.append(

                "product",

                new Blob(

                    [
                        JSON.stringify(
                            productData
                        )
                    ],

                    {
                        type:
                            "application/json"
                    }
                )
            );


            /*
             * Add the image file.
             */
            formData.append(

                "image",

                image
            );


            /*
             * Send data to backend.
             */
            await productService.createProduct(
                formData
            );


            setMessage(
                "Product created successfully!"
            );


            /*
             * Clear the form.
             */
            setName("");

            setDescription("");

            setPrice("");

            setStockQuantity("");

            setCategoryId("");

            setImage(null);


        } catch (error) {

            console.error(
                "Failed to create product:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create product."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="admin-create-product">

            <h1>
                Create Product
            </h1>


            {message && (

                <p className="success-message">

                    {message}

                </p>

            )}


            {error && (

                <p className="error-message">

                    {error}

                </p>

            )}


            <form
                onSubmit={handleSubmit}
            >

                <label>
                    Product Name
                </label>

                <input

                    type="text"

                    value={name}

                    onChange={(event) =>
                        setName(
                            event.target.value
                        )
                    }

                    required

                />


                <label>
                    Description
                </label>

                <textarea

                    value={description}

                    onChange={(event) =>
                        setDescription(
                            event.target.value
                        )
                    }

                />


                <label>
                    Price
                </label>

                <input

                    type="number"

                    step="0.01"

                    min="0"

                    value={price}

                    onChange={(event) =>
                        setPrice(
                            event.target.value
                        )
                    }

                    required

                />


                <label>
                    Stock Quantity
                </label>

                <input

                    type="number"

                    min="0"

                    value={stockQuantity}

                    onChange={(event) =>
                        setStockQuantity(
                            event.target.value
                        )
                    }

                    required

                />


                <label>
                    Category
                </label>

                <select

                    value={categoryId}

                    onChange={(event) =>
                        setCategoryId(
                            event.target.value
                        )
                    }

                    required

                >

                    <option value="">
                        Select category
                    </option>


                    {categories.map(
                        (category) => (

                            <option

                                key={
                                    category.id
                                }

                                value={
                                    category.id
                                }

                            >

                                {
                                    category.name
                                }

                            </option>

                        )
                    )}

                </select>


                <label>
                    Product Image
                </label>

                <input

                    type="file"

                    accept="image/*"

                    onChange={
                        handleImageChange
                    }

                    required

                />


                <button

                    type="submit"

                    disabled={loading}

                >

                    {loading
                        ? "Creating Product..."
                        : "Create Product"
                    }

                </button>

            </form>

        </div>

    );
}

export default AdminCreateProduct;