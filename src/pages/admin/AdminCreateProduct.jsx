/*
 * This page allows administrators to create new products.
 *
 * Product information and the product image are submitted
 * to the backend using multipart/form-data.
 */

import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import productService from "../../services/productService.js";
import categoryService from "../../services/categoryService.js";


function AdminCreateProduct() {

    const navigate = useNavigate();

    /*
     * Reference to the file input.
     * Used to clear the selected image after successful submission.
     */
    const imageInputRef = useRef(null);


    /*
     * Product form fields.
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
     * Selected product image.
     */
    const [image, setImage] =
        useState(null);


    /*
     * Categories loaded from the backend.
     */
    const [categories, setCategories] =
        useState([]);


    /*
     * Loading and error states.
     */
    const [loading, setLoading] =
        useState(false);

    const [categoriesLoading, setCategoriesLoading] =
        useState(true);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    /*
     * Load categories when the page opens.
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

            } finally {

                setCategoriesLoading(false);

            }
        };

        loadCategories();

    }, []);


    /*
     * Handles product image selection.
     */
    const handleImageChange = (event) => {

        const selectedImage =
            event.target.files?.[0];

        if (!selectedImage) {

            setImage(null);

            return;
        }


        /*
         * Only allow image files.
         */
        if (!selectedImage.type.startsWith("image/")) {

            setError(
                "Please select a valid image file."
            );

            setImage(null);

            event.target.value = "";

            return;
        }


        setError("");

        setImage(selectedImage);

    };


    /*
     * Handles product form submission.
     */
    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");

        setError("");


        /*
         * Make sure an image has been selected.
         */
        if (!image) {

            setError(
                "Please select a product image."
            );

            return;
        }


        setLoading(true);


        try {

            /*
             * Create multipart form data.
             */
            const formData =
                new FormData();


            /*
             * Product information.
             *
             * This object is converted to JSON and
             * sent as the "product" multipart part.
             */
            const productData = {

                name: name.trim(),

                description:
                    description.trim(),

                price:
                    Number(price),

                stockQuantity:
                    Number(stockQuantity),

                categoryId:
                    Number(categoryId)

            };


            /*
             * Add product JSON as an application/json part.
             */
            formData.append(

                "product",

                new Blob(
                    [
                        JSON.stringify(
                            productData
                        )
                    ],
                    {
                        type: "application/json"
                    }
                )

            );


            /*
             * Add the image file as the "image" part.
             */
            formData.append(
                "image",
                image
            );


            /*
             * Send multipart request to backend.
             */
            await productService.createProduct(
                formData
            );


            /*
             * Show success message.
             */
            setMessage(
                "Product created successfully!"
            );


            /*
             * Clear form fields.
             */
            setName("");

            setDescription("");

            setPrice("");

            setStockQuantity("");

            setCategoryId("");

            setImage(null);


            /*
             * Clear the actual file input.
             */
            if (imageInputRef.current) {

                imageInputRef.current.value = "";

            }


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

        <div className="admin-product-page">

            <div className="admin-product-container">


                {/* Page heading */}

                <h1>
                    Create Product
                </h1>


                <p className="admin-product-subtitle">
                    Add a new product to the DreamCart catalogue.
                </p>


                {/* Success message */}

                {message && (

                    <div className="form-success">

                        {message}

                    </div>

                )}


                {/* Error message */}

                {error && (

                    <div className="form-error">

                        {error}

                    </div>

                )}


                {/* Product form */}

                <form
                    className="admin-product-form"
                    onSubmit={handleSubmit}
                >


                    {/* Product name */}

                    <div className="form-group">

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
                            placeholder="Enter product name"
                            required
                        />

                    </div>


                    {/* Description */}

                    <div className="form-group">

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
                            placeholder="Enter product description"
                            required
                        />

                    </div>


                    {/* Price and stock */}

                    <div className="form-row">


                        {/* Price */}

                        <div className="form-group">

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
                                placeholder="0.00"
                                required
                            />

                        </div>


                        {/* Stock */}

                        <div className="form-group">

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
                                placeholder="0"
                                required
                            />

                        </div>

                    </div>


                    {/* Category */}

                    <div className="form-group">

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
                            disabled={categoriesLoading}
                        >

                            <option value="">
                                {categoriesLoading
                                    ? "Loading categories..."
                                    : "Select category"
                                }
                            </option>


                            {categories.map(
                                (category) => (

                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >

                                        {category.name}

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* Product image */}

                    <div className="form-group">

                        <label>
                            Product Image
                        </label>

                        <div className="image-upload">

                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleImageChange
                                }
                                required
                            />

                        </div>


                        {image && (

                            <small>
                                Selected: {image.name}
                            </small>

                        )}

                    </div>


                    {/* Form buttons */}

                    <div className="form-actions">


                        <button
                            type="button"
                            className="admin-btn admin-btn-secondary"
                            onClick={() =>
                                navigate(
                                    "/admin/products"
                                )
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="admin-btn admin-btn-primary"
                            disabled={
                                loading ||
                                categoriesLoading
                            }
                        >

                            {loading
                                ? "Creating Product..."
                                : "Create Product"
                            }

                        </button>

                    </div>


                </form>

            </div>

        </div>

    );

}


export default AdminCreateProduct;