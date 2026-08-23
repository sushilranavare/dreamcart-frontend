import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import productService from "../services/productService";
import cartService from "../services/cartService";
import wishlistService from "../services/wishlistService";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await productService.getProductById(id);
            setProduct(data);
            setError("");
        } catch (err) {
            console.error("Failed to load product details:", err);
            setError("Could not load product details. It may not exist.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        try {
            await cartService.addToCart(product.id, quantity);
            alert(`${quantity}x ${product.name} added to cart!`);
        } catch (error) {
            console.error("Failed to add to cart:", error);
            alert("Could not add item to cart.");
        }
    };

    const handleAddToWishlist = async () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        try {
            await wishlistService.addToWishlist(product.id);
            alert(`${product.name} added to your wishlist! ❤️`);
        } catch (error) {
            console.error("Failed to add to wishlist:", error);
            alert("Could not add item to wishlist.");
        }
    };

    if (loading) return <div className="cart-page"><h2>Loading product...</h2></div>;
    if (error) return <div className="cart-page"><p className="error-message">{error}</p></div>;
    if (!product) return null;

    // Handle legacy image URLs
    let imageUrl = null;
    if (product.imageUrl) {
        if (!product.imageUrl.startsWith('/')) {
            imageUrl = `http://localhost:8080/uploads/products/${product.imageUrl}`;
        } else {
            imageUrl = `http://localhost:8080${product.imageUrl}`;
        }
    }

    return (
        <div className="cart-page">
            <div className="cart-container" style={{ alignItems: 'stretch' }}>
                {/* Left: Big Image */}
                <div className="cart-items-section" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={product.name}
                            style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '8px' }}
                        />
                    ) : (
                        <div className="no-image" style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
                            No Image Available
                        </div>
                    )}
                </div>

                {/* Right: Details & Actions */}
                <div className="cart-summary-section" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>{product.name}</h1>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>
                        ${Number(product.price).toFixed(2)}
                    </p>

                    <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: '1.6', marginBottom: '20px' }}>
                        {product.description}
                    </p>

                    <div style={{ marginBottom: '20px' }}>
                        <span style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            background: product.stockQuantity > 0 ? '#d1fae5' : '#fee2e2',
                            color: product.stockQuantity > 0 ? '#065f46' : '#991b1b',
                            fontWeight: 'bold',
                            fontSize: '14px'
                        }}>
                            {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of Stock"}
                        </span>
                    </div>

                    {/* Quantity Selector */}
                    {product.stockQuantity > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                            <label style={{ fontWeight: 'bold' }}>Quantity:</label>
                            <div className="quantity-wrapper" style={{ width: 'fit-content' }}>
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}>+</button>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button
                            className="admin-btn admin-btn-secondary"
                            style={{ flex: 1, padding: '15px', fontSize: '16px' }}
                            onClick={handleAddToWishlist}
                        >
                            ❤️ Save for Later
                        </button>
                        <button
                            className="admin-btn admin-btn-primary"
                            style={{ flex: 2, padding: '15px', fontSize: '16px' }}
                            onClick={handleAddToCart}
                            disabled={product.stockQuantity < 1}
                        >
                            {product.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;