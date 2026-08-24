import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cartService from "../services/cartService";
import addressService from "../services/addressService";
import orderService from "../services/orderService";
import paymentService from "../services/paymentService";

function Checkout() {
    const navigate = useNavigate();

    // State
    const [cart, setCart] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("CARD");
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    // New Address State
    const [newAddress, setNewAddress] = useState({
        fullName: "", phoneNumber: "", addressLine1: "", addressLine2: "",
        city: "", state: "", postalCode: "", country: "", isDefault: true
    });

    useEffect(() => {
        loadCheckoutData();
    }, []);

    const loadCheckoutData = async () => {
        try {
            // Load Cart
            const cartData = await cartService.getCart();
            if (!cartData || !cartData.items || cartData.items.length === 0) {
                navigate("/cart"); // Prevent checkout with empty cart
                return;
            }
            setCart(cartData);

            // Load Addresses
            const addressData = await addressService.getAddresses();
            setAddresses(addressData);

            if (addressData.length > 0) {
                setSelectedAddressId(addressData[0].id);
            } else {
                setShowAddressForm(true); // Force form if no addresses exist
            }
        } catch (error) {
            console.error("Failed to load checkout data:", error);
            alert("Unable to load checkout details.");
        } finally {
            setPageLoading(false);
        }
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalAddressId = selectedAddressId;

            // 1. Create new address if the form is active
            if (showAddressForm) {
                const savedAddress = await addressService.addAddress(newAddress);
                finalAddressId = savedAddress.id || savedAddress.Id;
            }

            // 2. Place the order
            const order = await orderService.placeOrder(finalAddressId);

            // 3. Process the payment (Safely grab the ID whether Spring Boot capitalized it or not)
            const finalOrderId = order.id || order.Id;
            await paymentService.makePayment(finalOrderId, paymentMethod);

            alert("Order placed successfully! 🎉 Check your email for confirmation.");

            // Redirect to the upcoming Orders page
            navigate("/orders");

        } catch (error) {
            console.error("Checkout failed:", error);
            alert(error.response?.data?.message || "Checkout failed. Please check your details and try again.");
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) return <div className="cart-page"><h2>Loading checkout...</h2></div>;
    if (!cart) return null;

    return (
        <div className="cart-page">
            <h1>Secure Checkout 🔒</h1>

            <form onSubmit={handleCheckout} className="cart-container">
                {/* Left Side: Forms */}
                <div className="cart-items-section" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                    {/* Address Section */}
                    <div>
                        <h2>1. Shipping Address</h2>

                        {addresses.length > 0 && !showAddressForm && (
                            <div style={{ marginBottom: '20px' }}>
                                {addresses.map(addr => (
                                    <div key={addr.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '10px' }}>
                                        <input
                                            type="radio"
                                            name="address"
                                            checked={selectedAddressId === addr.id}
                                            onChange={() => setSelectedAddressId(addr.id)}
                                        />
                                        <div>
                                            <strong>{addr.fullName}</strong> - {addr.phoneNumber}<br/>
                                            {addr.addressLine1}, {addr.city}, {addr.state} {addr.postalCode}
                                        </div>
                                    </div>
                                ))}
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowAddressForm(true)}>
                                    + Add New Address
                                </button>
                            </div>
                        )}

                        {showAddressForm && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <input required type="text" name="fullName" placeholder="Full Name" className="admin-input" onChange={handleAddressChange} />
                                <input required type="text" name="phoneNumber" placeholder="Phone Number" className="admin-input" onChange={handleAddressChange} />
                                <input required type="text" name="addressLine1" placeholder="Address Line 1" className="admin-input" style={{ gridColumn: 'span 2' }} onChange={handleAddressChange} />
                                <input type="text" name="addressLine2" placeholder="Address Line 2 (Optional)" className="admin-input" style={{ gridColumn: 'span 2' }} onChange={handleAddressChange} />
                                <input required type="text" name="city" placeholder="City" className="admin-input" onChange={handleAddressChange} />
                                <input required type="text" name="state" placeholder="State" className="admin-input" onChange={handleAddressChange} />
                                <input required type="text" name="postalCode" placeholder="Postal Code" className="admin-input" onChange={handleAddressChange} />
                                <input required type="text" name="country" placeholder="Country" className="admin-input" onChange={handleAddressChange} />

                                {addresses.length > 0 && (
                                    <button type="button" className="admin-btn admin-btn-secondary" style={{ gridColumn: 'span 2' }} onClick={() => setShowAddressForm(false)}>
                                        Cancel New Address
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <hr />

                    {/* Payment Section */}
                    <div>
                        <h2>2. Payment Method</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                            {['CARD', 'PAYPAL', 'UPI', 'CASH_ON_DELIVERY'].map(method => (
                                <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method}
                                        checked={paymentMethod === method}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <strong>{method.replace(/_/g, ' ')}</strong>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Order Summary */}
                <div className="cart-summary-section">
                    <h2>Order Summary</h2>
                    <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
                        {cart.items.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                                <span>{item.quantity}x {item.productName}</span>
                                <span>${Number(item.subtotal).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <hr />

                    <div className="summary-total" style={{ marginTop: '20px' }}>
                        <strong>Total to Pay</strong>
                        <strong>${Number(cart.total).toFixed(2)}</strong>
                    </div>

                    <button
                        type="submit"
                        className="admin-btn admin-btn-primary"
                        style={{ width: "100%", marginTop: "20px", padding: '15px', fontSize: '18px' }}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Place Order"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Checkout;