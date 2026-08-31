import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import productService from "../services/productService";
import cartService from "../services/cartService";
import wishlistService from "../services/wishlistService";
import reviewService from "../services/reviewService";
import profileService from "../services/profileService";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);

    // Reviews
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        loadProduct();
        loadReviews();
    }, [id]);

    useEffect(() => {
        if (isAuthenticated) {
            loadCurrentUser();
        } else {
            setCurrentUserId(null);
        }
    }, [isAuthenticated]);

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

    const loadReviews = async () => {
        try {
            setReviewsLoading(true);
            const data = await reviewService.getReviewsForProduct(id);
            setReviews(data);
        } catch (err) {
            console.error("Failed to load reviews:", err);
        } finally {
            setReviewsLoading(false);
        }
    };

    const loadCurrentUser = async () => {
        try {
            const profile = await profileService.getProfile();
            setCurrentUserId(profile.id);
        } catch (err) {
            console.error("Failed to load current user:", err);
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

                    {!reviewsLoading && (
                        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '-15px', marginBottom: '20px' }}>
                            {reviews.length > 0
                                ? `⭐ ${averageRating(reviews)} out of 5 (${reviews.length} review${reviews.length === 1 ? "" : "s"})`
                                : "No reviews yet"}
                        </p>
                    )}

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

            {/* Reviews */}
            <ReviewsSection
                productId={product.id}
                isAuthenticated={isAuthenticated}
                currentUserId={currentUserId}
                reviews={reviews}
                reviewsLoading={reviewsLoading}
                onReviewsChanged={loadReviews}
            />
        </div>
    );
}

/*
 * Returns the average rating of a list of reviews, rounded to one decimal place.
 */
function averageRating(reviews) {
    if (reviews.length === 0) return "0.0";
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
}

/*
 * Displays the list of reviews for a product, and lets a logged-in
 * user add, edit, or delete their own review.
 */
function ReviewsSection({ productId, isAuthenticated, currentUserId, reviews, reviewsLoading, onReviewsChanged }) {

    const navigate = useNavigate();

    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editRating, setEditRating] = useState(5);
    const [editComment, setEditComment] = useState("");

    const myReview = reviews.find(review => review.userId === currentUserId);

    const handleAddReview = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        setReviewError("");
        setSubmitting(true);

        try {
            await reviewService.addReview(productId, newRating, newComment);
            setNewComment("");
            setNewRating(5);
            onReviewsChanged();
        } catch (error) {
            console.error("Failed to add review:", error);
            setReviewError(
                error.response?.data?.message || "Failed to submit review."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const startEdit = (review) => {
        setEditingId(review.id);
        setEditRating(review.rating);
        setEditComment(review.comment);
    };

    const handleUpdateReview = async (e) => {
        e.preventDefault();

        try {
            await reviewService.updateReview(editingId, productId, editRating, editComment);
            setEditingId(null);
            onReviewsChanged();
        } catch (error) {
            console.error("Failed to update review:", error);
            alert("Failed to update review.");
        }
    };

    const handleDeleteReview = async (id) => {
        if (!window.confirm("Delete this review?")) return;

        try {
            await reviewService.deleteReview(id);
            onReviewsChanged();
        } catch (error) {
            console.error("Failed to delete review:", error);
            alert("Failed to delete review.");
        }
    };

    return (
        <div style={{ marginTop: '40px' }}>

            <h2>Reviews {reviews.length > 0 && `(${reviews.length})`}</h2>

            {/* Add Review Form */}
            {isAuthenticated && !myReview && (
                <form
                    onSubmit={handleAddReview}
                    style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginTop: '15px', marginBottom: '20px' }}
                >
                    <h3 style={{ marginTop: 0 }}>Write a Review</h3>

                    {reviewError && <p className="error-message">{reviewError}</p>}

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Rating</label>
                        <select
                            value={newRating}
                            onChange={(e) => setNewRating(Number(e.target.value))}
                            className="admin-input"
                            style={{ padding: '10px' }}
                        >
                            {[5, 4, 3, 2, 1].map(value => (
                                <option key={value} value={value}>{"⭐".repeat(value)} ({value})</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Comment</label>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="admin-input"
                            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', minHeight: '80px' }}
                            required
                        />
                    </div>

                    <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            )}

            {!isAuthenticated && (
                <p style={{ color: '#6b7280', marginTop: '10px' }}>
                    <span onClick={() => navigate("/login")} style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 'bold' }}>
                        Log in
                    </span>{" "}
                    to write a review.
                </p>
            )}

            {/* Review List */}
            {reviewsLoading ? (
                <p>Loading reviews...</p>
            ) : reviews.length === 0 ? (
                <p style={{ color: '#6b7280' }}>Be the first to review this product.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    {reviews.map(review => (
                        <div key={review.id} style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '15px', background: 'white' }}>

                            {editingId === review.id ? (
                                <form onSubmit={handleUpdateReview} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <select
                                        value={editRating}
                                        onChange={(e) => setEditRating(Number(e.target.value))}
                                        className="admin-input"
                                        style={{ padding: '8px', width: 'fit-content' }}
                                    >
                                        {[5, 4, 3, 2, 1].map(value => (
                                            <option key={value} value={value}>{"⭐".repeat(value)} ({value})</option>
                                        ))}
                                    </select>
                                    <textarea
                                        value={editComment}
                                        onChange={(e) => setEditComment(e.target.value)}
                                        className="admin-input"
                                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', minHeight: '60px' }}
                                        required
                                    />
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button type="submit" className="admin-btn admin-btn-primary">Save</button>
                                        <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <strong>{review.reviewerName}</strong>
                                        <span>{"⭐".repeat(review.rating)}</span>
                                    </div>
                                    <p style={{ color: '#4b5563', margin: '8px 0' }}>{review.comment}</p>
                                    <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>

                                    {review.userId === currentUserId && (
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                            <button
                                                onClick={() => startEdit(review)}
                                                style={{ background: '#dbeafe', color: '#1e40af', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteReview(review.id)}
                                                style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductDetails;