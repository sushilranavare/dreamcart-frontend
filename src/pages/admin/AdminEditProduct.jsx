import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productService from "../../services/productService";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    // Keep the whole product object so we don't lose categoryId or images!
    const [product, setProduct] = useState({});

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            const data = await productService.getProductById(id);
            // Populate the form with the existing data
            setProduct(data);
        } catch (error) {
            console.error("Failed to load product", error);
            alert("Could not load product details.");
            navigate("/admin/products");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare the exact payload Spring Boot expects
            const payload = {
                ...product,
                price: parseFloat(product.price), // Force it to be a number
                stockQuantity: parseInt(product.stockQuantity, 10), // Force it to be an integer
                // Safely handle category ID whether it's nested in an object or flat
                categoryId: product.category?.id || product.categoryId
            };

            await productService.updateProduct(id, payload);
            alert("Product updated successfully! ✅");
            navigate("/admin/products");
        } catch (error) {
            console.error("Failed to update product", error);
            // This will show us EXACTLY what the backend is complaining about!
            const backendError = error.response?.data;
            alert("Backend Error: " + (typeof backendError === 'object' ? JSON.stringify(backendError) : backendError || "Update failed."));
        }
    };

    if (loading) return <div className="cart-page"><h2>Loading product data...</h2></div>;

    return (
        <div className="cart-page">
            <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h1 style={{ marginTop: '0', marginBottom: '20px' }}>Edit Product</h1>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Product Name</label>
                        <input
                            name="name"
                            value={product.name || ""}
                            onChange={handleChange}
                            className="admin-input"
                            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Description</label>
                        <textarea
                            name="description"
                            value={product.description || ""}
                            onChange={handleChange}
                            className="admin-input"
                            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', minHeight: '100px' }}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="price"
                                value={product.price || ""}
                                onChange={handleChange}
                                className="admin-input"
                                style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Stock Quantity</label>
                            <input
                                type="number"
                                name="stockQuantity"
                                value={product.stockQuantity || ""}
                                onChange={handleChange}
                                className="admin-input"
                                style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1, padding: '12px' }}>
                            Save Changes
                        </button>
                        <button type="button" onClick={() => navigate("/admin/products")} className="admin-btn admin-btn-secondary" style={{ flex: 1, padding: '12px' }}>
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default EditProduct;