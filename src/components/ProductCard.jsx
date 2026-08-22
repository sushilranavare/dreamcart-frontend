import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import cartService from "../services/cartService";
import wishlistService from "../services/wishlistService";

function ProductCard({ product }) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    let imageUrl = null;
    if (product.imageUrl) {
        if (!product.imageUrl.startsWith('/')) {
            imageUrl = `http://localhost:8080/uploads/products/${product.imageUrl}`;
        } else {
            imageUrl = `http://localhost:8080${product.imageUrl}`;
        }
    }

    // This function MUST be inside the ProductCard component
    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        try {
            await cartService.addToCart(product.id, 1);
            alert(`${product.name} added to cart!`);
        } catch (error) {
            console.error("Failed to add to cart:", error);
            alert("Could not add item to cart. Please try again.");
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
            alert("Could not add item to wishlist. It might already be there.");
        }
    };

    return (
        <div className="product-card">
            <div className="product-image-container">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="product-image"
                    />
                ) : (
                    <div className="no-image">No Image</div>
                )}
            </div>

            <div className="product-card-content">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${Number(product.price).toFixed(2)}</p>

                <p className="product-stock">
                    {product.stockQuantity > 0
                        ? `${product.stockQuantity} in stock`
                        : "Out of stock"
                    }
                </p>

                {/* Button Container */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button
                        className="admin-btn admin-btn-secondary"
                        style={{ flex: 1, padding: '10px' }}
                        onClick={handleAddToWishlist}
                    >
                        ❤️ Save
                    </button>

                <button
                    className="admin-btn admin-btn-primary"
                    style={{ width: "100%", marginTop: "15px" }}
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity < 1}
                >
                    {product.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;