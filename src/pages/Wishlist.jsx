import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import wishlistService from "../services/wishlistService";
import cartService from "../services/cartService";
import productCard from "../components/ProductCard";

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            setLoading(true);
            const data = await wishlistService.getWishlist();
            setWishlist(data);
            setError("");
        } catch (err) {
            console.error("Failed to load wishlist:", err);
            setError("Unable to load your wishlist.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            const updatedWishlist = await wishlistService.removeFromWishlist(productId);
            setWishlist(updatedWishlist);
        } catch (err) {
            console.error("Failed to remove item:", err);
            alert("Could not remove item.");
        }
    };

    const handleAddToCart = async (item) => {
        try {
            await cartService.addToCart(item.productId, 1);
            alert(`${item.productName} added to cart!`);

            // Optional: Automatically remove the item from the wishlist once it's in the cart
            const updatedWishlist = await wishlistService.removeFromWishlist(item.productId);
            setWishlist(updatedWishlist);
        } catch (error) {
            console.error("Failed to add to cart:", error);
            alert("Could not add item to cart.");
        }
    };

    if (loading) {
        return <div className="cart-page"><h2>Loading your wishlist...</h2></div>;
    }

    if (error) {
        return <div className="cart-page"><p className="error-message">{error}</p></div>;
    }

    if (wishlist.length === 0) {
        return (
            <div className="cart-page admin-empty">
                <h2>Your Wishlist is Empty ❤️</h2>
                <p>Save items you love here to buy them later.</p>
                <Link to="/products" className="admin-btn admin-btn-primary" style={{ display: 'inline-block', marginTop: '15px', textDecoration: 'none' }}>
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1>Your Wishlist</h1>

            <div className="product-grid">
                {wishlist.map((item) => {
                    let imageUrl = null;
                    if (item.imageUrl) {
                        if (!item.imageUrl.startsWith('/')) {
                            imageUrl = `http://localhost:8080/uploads/products/${item.imageUrl}`;
                        } else {
                            imageUrl = `http://localhost:8080${item.imageUrl}`;
                        }
                    }

                    return (
                        <div key={item.id} className="product-card">
                            <div className="product-image-container">
                                {imageUrl ? (
                                    <img src={imageUrl} alt={item.productName} className="product-image" />
                                ) : (
                                    <div className="no-image">No Image</div>
                                )}
                            </div>

                            <div className="product-card-content">
                                <h3>{item.productName}</h3>
                                <p className="product-price">${Number(item.price).toFixed(2)}</p>
                                <p className="product-stock">
                                    {item.stockQuantity > 0 ? `${item.stockQuantity} in stock` : "Out of stock"}
                                </p>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexDirection: 'column' }}>
                                    <button
                                        className="admin-btn admin-btn-primary"
                                        onClick={() => handleAddToCart(item)}
                                        disabled={item.stockQuantity < 1}
                                    >
                                        {item.stockQuantity > 0 ? "Move to Cart" : "Out of Stock"}
                                    </button>

                                    <button
                                        className="admin-btn admin-btn-secondary"
                                        onClick={() => handleRemove(item.productId)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Wishlist;