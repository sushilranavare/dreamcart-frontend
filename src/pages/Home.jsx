/*
* This page represents the main landing page of the dreamcart application.
* */
import { Link } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import CategoryService from "../services/categoryService.js";
import {useEffect, useState} from "react";
import categoryService from "../services/categoryService.js";

function Home(){
   const [categories, setCategories]  = useState([]);
   const [loading, setLoading] = useState(true);
   const[error, setError] = useState("");

    useEffect(() => {
        const loadCategories = async () =>{
            try{
                const data =
                    await categoryService.getCategories();
                setCategories(data);
            }
            catch (error){
                console.error("Failed to load categories: error");

                setError ("Unable to load categories.");
            }
            finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);
    return (
        <div className="home-page">

            {/* Hero Section */}
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


            {/* Categories Section */}
            <section className="categories-section">

                <h2>
                    Popular Categories
                </h2>

                {loading && (
                    <p>
                        Loading categories...
                    </p>
                )}

                {error && (
                    <p>
                        {error}
                    </p>
                )}

                <div className="category-grid">

                    {categories.map((category) => (

                        <CategoryCard
                            key={category.id}
                            name={category.name}
                            description={category.description}
                        />

                    ))}

                </div>

            </section>

        </div>
    );
}

export default Home;