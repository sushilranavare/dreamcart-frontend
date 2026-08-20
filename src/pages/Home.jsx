/*
 * This page represents the main landing page
 * of the DreamCart application.
 */

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import CategoryCard from "../components/CategoryCard";
import categoryService from "../services/categoryService.js";


function Home() {

    /*
     * Stores the categories returned
     * from the backend.
     */
    const [categories, setCategories] = useState([]);


    /*
     * Controls the loading state while
     * categories are being fetched.
     */
    const [loading, setLoading] = useState(true);


    /*
     * Stores an error message if
     * loading categories fails.
     */
    const [error, setError] = useState("");


    /*
     * Load categories when the Home page
     * is first rendered.
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

                setLoading(false);

            }
        };

        loadCategories();

    }, []);


    return (

        <div className="home-page">

            {/* =========================
                Hero Section
            ========================== */}

            <section className="hero-section">

                <div className="hero-content">

                    <h1>
                        Discover Products
                        <br />
                        You'll Love
                    </h1>

                    <p>
                        Shop quality products at great prices.
                    </p>

                    <Link
                        to="/products"
                        className="hero-button"
                    >
                        Shop Now
                    </Link>

                </div>

            </section>


            {/* =========================
                Categories Section
            ========================== */}

            <section className="categories-section">

                <h2>
                    Popular Categories
                </h2>


                {/* Loading message */}

                {loading && (

                    <p>
                        Loading categories...
                    </p>

                )}


                {/* Error message */}

                {error && (

                    <p className="error-message">
                        {error}
                    </p>

                )}


                {/* Category cards */}

                {!loading && !error && (

                    <div className="category-grid">

                        {categories.map((category) => (

                            <CategoryCard
                                key={category.id}
                                name={category.name}
                                description={category.description}
                            />

                        ))}

                    </div>

                )}

            </section>

        </div>

    );
}


export default Home;    