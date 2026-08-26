/*
 * Admin product management page for DreamCart.
 *
 * This page is accessible only to ADMIN users through AdminRoute.
 * It displays products in a management table and provides
 * actions for creating, editing, and deleting products.
 */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import productService from "../../services/productService.js";
import "../../index.css";


function AdminProducts() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /*
     * Loads products from the backend when
     * the page is first displayed.
     */
    useEffect(() => {

        loadProducts();

    }, []);


    /*
     * Fetches the product list from the backend.
     */
    const loadProducts = async () => {

        try {

            setLoading(true);

            setError("");

            const data =
                await productService.getProducts({
                    page: 0,
                    size: 100,
                    sortBy: "id",
                    sortDir: "asc"
                });

            setProducts(
                data.content || []
            );

        } catch (error) {

            console.error(
                "Failed to load products:",
                error
            );

            setError(
                "Unable to load products."
            );

        } finally {

            setLoading(false);

        }
    };


    /*
     * Deletes a product after asking the
     * administrator for confirmation.
     */
    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this product?"
            );

        if (!confirmed) {
            return;
        }


        try {

            await productService.deleteProduct(id);

            /*
             * Remove the deleted product from
             * the current list without reloading
             * the entire page.
             */
            setProducts(
                products.filter(
                    product =>
                        product.id !== id
                )
            );

        } catch (error) {

            console.error(
                "Failed to delete product:",
                error
            );

            setError(
                "Unable to delete product."
            );

        }
    };


    /*
     * Displays a loading message while
     * products are being retrieved.
     */
    if (loading) {

        return (

            <div className="admin-dashboard">

                <h1>
                    Manage Products
                </h1>

                <p>
                    Loading products...
                </p>

            </div>

        );
    }


    return (

        <div className="admin-dashboard">

            {/* ==========================
                Page Header
            =========================== */}

            <div className="admin-products-header">

                <div>

                    <h1>
                        Manage Products
                    </h1>

                    <p>
                        Manage your product catalogue
                        and inventory.
                    </p>

                </div>


                <Link
                    to="/admin/products/create"
                    className="admin-button"
                >
                    + Add Product
                </Link>

            </div>


            {/* ==========================
                Error Message
            =========================== */}

            {error && (

                <p className="admin-error">
                    {error}
                </p>

            )}


            {/* ==========================
                Product Count
            =========================== */}

            <div className="admin-product-summary">

                <strong>
                    Total Products:
                </strong>

                <span>
                    {products.length}
                </span>

            </div>


            {/* ==========================
                Products Table
            =========================== */}

            {products.length === 0 ? (

                <div className="admin-empty">

                    <h2>
                        No Products Found
                    </h2>

                    <p>
                        There are currently no products
                        in your catalogue.
                    </p>

                    <Link
                        to="/admin/products/create"
                        className="admin-button"
                    >
                        Add Your First Product
                    </Link>

                </div>

            ) : (

                <div className="admin-table-container">

                    <table className="admin-products-table">

                        <thead>

                        <tr>

                            <th>
                                Image
                            </th>

                            <th>
                                Product
                            </th>

                            <th>
                                Category
                            </th>

                            <th>
                                Price
                            </th>

                            <th>
                                Stock
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Actions
                            </th>

                        </tr>

                        </thead>


                        <tbody>

                        {products.map(
                            (product) => (

                                <tr
                                    key={
                                        product.id
                                    }
                                >

                                    {/* Image */}

                                    {/* Find this part inside your table body's map loop: */}
                                    <td style={{ padding: '12px' }}>
                                        {(() => {
                                            let imageUrl = null;
                                            if (product.imageUrl) {
                                                // Check if it's already a full URL, or if it needs the backend host prepended
                                                if (product.imageUrl.startsWith('http')) {
                                                    imageUrl = product.imageUrl;
                                                } else if (product.imageUrl.startsWith('/')) {
                                                    imageUrl = `http://localhost:8080${product.imageUrl}`;
                                                } else {
                                                    imageUrl = `http://localhost:8080/uploads/products/${product.imageUrl}`;
                                                }
                                            }

                                            return imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                                />
                                            ) : (
                                                <div style={{ width: '50px', height: '50px', backgroundColor: '#e5e7eb', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                                                    No Img
                                                </div>
                                            );
                                        })()}
                                    </td>


                                    {/* Product */}

                                    <td>

                                        <div className="admin-product-name">

                                            <strong>
                                                {
                                                    product.name
                                                }
                                            </strong>

                                            <span>
                                                    {
                                                        product.description
                                                    }
                                                </span>

                                        </div>

                                    </td>


                                    {/* Category */}

                                    <td>

                                        {
                                            product.categoryName ||
                                            "Uncategorized"
                                        }

                                    </td>


                                    {/* Price */}

                                    <td>

                                        $
                                        {Number(
                                            product.price
                                        ).toFixed(2)}

                                    </td>


                                    {/* Stock */}

                                    <td>

                                            <span
                                                className={
                                                    product.stockQuantity > 0
                                                        ? "stock-available"
                                                        : "stock-out"
                                                }
                                            >
                                                {
                                                    product.stockQuantity
                                                }
                                            </span>

                                    </td>


                                    {/* Status */}

                                    <td>

                                        {product.isActive ? (

                                            <span className="status-active">
                                                    Active
                                                </span>

                                        ) : (

                                            <span className="status-inactive">
                                                    Inactive
                                                </span>

                                        )}

                                    </td>


                                    {/* Actions */}

                                    <td>

                                        <div className="admin-actions">

                                            <button
                                                type="button"
                                                className="edit-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/products/edit/${product.id}`
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>


                                            <button
                                                type="button"
                                                className="delete-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        product.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            )
                        )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );
}


export default AdminProducts;