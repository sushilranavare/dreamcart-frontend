import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import cartService from "../services/cartService";

function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            setLoading(true);
            const data = await cartService.getCart();
            setCart(data);
            setError("");
        } catch (err) {
            console.error("Failed to load cart:", err);
            setError("Unable to load your cart.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return; // Prevent going below 1 (use 'Remove' instead)
        try {
            const updatedCart = await cartService.updateQuantity(itemId, newQuantity);
            setCart(updatedCart); // Backend returns the recalculated cart
        } catch (err) {
            console.error("Failed to update quantity:", err);
            alert("Could not update quantity. Please try again.");
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            const updatedCart = await cartService.removeItem(itemId);
            setCart(updatedCart);
        } catch (err) {
            console.error("Failed to remove item:", err);
            alert("Could not remove item.");
        }
    };

    const handleClearCart = async () => {
        const confirmed = window.confirm("Are you sure you want to clear your cart?");
        if (!confirmed) return;

        try {
            const updatedCart = await cartService.clearCart();
            setCart(updatedCart);
        } catch (err) {
            console.error("Failed to clear cart:", err);
            alert("Could not clear cart.");
        }
    };

    if (loading) {
        return <div className="cart-page"><h2>Loading your cart...</h2></div>;
    }

    if (error) {
        return <div className="cart-page"><p className="error-message">{error}</p></div>;
    }

    // Empty state
    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="cart-page admin-empty">
                <h2>Your Cart is Empty 🛒</h2>
                <p>Looks like you haven't added anything yet.</p>
                <Link to="/products" className="admin-btn admin-btn-primary" style={{ display: 'inline-block', marginTop: '15px', textDecoration: 'none' }}>
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1>Your Shopping Cart</h1>

            <div className="cart-container">
                {/* Left Side: Cart Items */}
                <div className="cart-items-section">
                    {cart.items.map((item) => {
                        let imageUrl = null;
                        if (item.imageUrl) {
                            if (!item.imageUrl.startsWith('/')) {
                                imageUrl = `http://localhost:8080/uploads/products/${item.imageUrl}`;
                            } else {
                                imageUrl = `http://localhost:8080${item.imageUrl}`;
                            }
                        }

                        return (
                            <div key={item.id} className="cart-item-row">
                                <div className="cart-item-image-box">
                                    {imageUrl ? (
                                        <img src={imageUrl} alt={item.productName} />
                                    ) : (
                                        <div className="admin-product-placeholder">No Image</div>
                                    )}
                                </div>

                                <div className="cart-item-info">
                                    <h3>{item.productName}</h3>
                                    <p className="cart-item-price">${Number(item.price).toFixed(2)}</p>
                                </div>

                                <div className="cart-item-controls">
                                    <div className="quantity-wrapper">
                                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>

                                    <div className="cart-item-subtotal">
                                        <strong>${Number(item.subtotal).toFixed(2)}</strong>
                                    </div>

                                    <button className="delete-button" onClick={() => handleRemoveItem(item.id)}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <button className="admin-btn admin-btn-secondary" style={{ marginTop: '20px' }} onClick={handleClearCart}>
                        Clear Entire Cart
                    </button>
                </div>

                {/* Right Side: Order Summary */}
                <div className="cart-summary-section">
                    <h2>Order Summary</h2>
                    <div className="summary-details">
                        <div className="summary-line">
                            <span>Subtotal ({cart.items.length} items)</span>
                            <span>${Number(cart.total).toFixed(2)}</span>
                        </div>
                        <div className="summary-line">
                            <span>Shipping</span>
                            <span>Calculated at checkout</span>
                        </div>
                        <hr />
                        <div className="summary-total">
                            <strong>Total</strong>
                            <strong>${Number(cart.total).toFixed(2)}</strong>
                        </div>
                    </div>
                    <button
                        className="admin-btn admin-btn-primary"
                        style={{ width: "100%", marginTop: "20px" }}
                        onClick={() => navigate("/checkout")}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Cart;