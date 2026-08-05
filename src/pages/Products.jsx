/*
 * This page displays the product catalogue.
 *
 * Products are fetched from the DreamCart backend API.
 * The page supports:
 *
 * - Product search
 * - Category filtering
 * - Sorting
 * - Pagination
 *
 * Products are displayed using the reusable ProductCard component.
 */

import { useEffect, useState } from "react";

import ProductCard from "../components/ProductCard";
import productService from "../services/productService";
import categoryService from "../services/categoryService";


function Products() {

    const [products, setProducts] = useState([]);

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [keyword, setKeyword] = useState("");

    const [categoryId, setCategoryId] = useState("");

    const [sortBy, setSortBy] = useState("id");

    const [sortDir, setSortDir] = useState("asc");

    const [page, setPage] = useState(0);

    const pageSize = 5;

    const [totalPages, setTotalPages] = useState(0);


    /*
     * Loads products from the backend.
     *
     * This request is repeated whenever:
     *
     * - Page changes
     * - Search keyword changes
     * - Category changes
     * - Sorting changes
     */
    useEffect(() => {

        const loadProducts = async () => {

            try {

                setLoading(true);

                const data =
                    await productService.getProducts({

                        page: page,

                        size: pageSize,

                        sortBy: sortBy,

                        sortDir: sortDir,

                        keyword:
                            keyword.trim() || undefined,

                        categoryId:
                            categoryId || undefined

                    });


                setProducts(data.content);

                setTotalPages(data.totalPages);

                setError("");

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


        loadProducts();

    }, [
        page,
        keyword,
        categoryId,
        sortBy,
        sortDir
    ]);


    /*
     * Loads categories from the backend.
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

            }

        };


        loadCategories();

    }, []);


    return (

        <div className="products-page">

            <h1>
                All Products
            </h1>


            {/* Product Controls */}

            <div className="product-controls">


                {/* Search */}

                <input
                    type="text"
                    placeholder="Search products..."
                    value={keyword}
                    onChange={(event) => {

                        setKeyword(
                            event.target.value
                        );

                        setPage(0);

                    }}
                />


                {/* Category Filter */}

                <select
                    value={categoryId}
                    onChange={(event) => {

                        setCategoryId(
                            event.target.value
                        );

                        setPage(0);

                    }}
                >

                    <option value="">
                        All Categories
                    </option>


                    {categories.map((category) => (

                        <option
                            key={category.id}
                            value={category.id}
                        >

                            {category.name}

                        </option>

                    ))}

                </select>


                {/* Sort Field */}

                <select
                    value={sortBy}
                    onChange={(event) => {

                        setSortBy(
                            event.target.value
                        );

                        setPage(0);

                    }}
                >

                    <option value="id">
                        Newest
                    </option>

                    <option value="name">
                        Name
                    </option>

                    <option value="price">
                        Price
                    </option>

                    <option value="stockQuantity">
                        Stock
                    </option>

                </select>


                {/* Sort Direction */}

                <select
                    value={sortDir}
                    onChange={(event) => {

                        setSortDir(
                            event.target.value
                        );

                        setPage(0);

                    }}
                >

                    <option value="asc">
                        Ascending
                    </option>

                    <option value="desc">
                        Descending
                    </option>

                </select>


            </div>


            {/* Loading State */}

            {loading && (

                <p>
                    Loading products...
                </p>

            )}


            {/* Error State */}

            {error && (

                <p className="error-message">

                    {error}

                </p>

            )}


            {/* Product Grid */}

            {!loading &&
                !error &&
                products.length === 0 && (

                    <p>
                        No products found.
                    </p>

                )}


            {!loading &&
                !error &&
                products.length > 0 && (

                    <div className="product-grid">

                        {products.map((product) => (

                            <ProductCard
                                key={product.id}
                                product={product}
                            />

                        ))}

                    </div>

                )}


            {/* Pagination */}

            {!loading &&
                !error &&
                totalPages > 0 && (

                    <div className="pagination">

                        <button
                            disabled={page === 0}
                            onClick={() =>
                                setPage(page - 1)
                            }
                        >

                            Previous

                        </button>


                        <span>

                            Page {page + 1} of {totalPages}

                        </span>


                        <button
                            disabled={
                                page + 1 >= totalPages
                            }
                            onClick={() =>
                                setPage(page + 1)
                            }
                        >

                            Next

                        </button>

                    </div>

                )}

        </div>

    );

}


export default Products;