import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import orderService from "../services/orderService";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await orderService.getOrders();
            // Sort orders so the newest ones appear at the top
            const sortedOrders = data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            setOrders(sortedOrders);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="cart-page"><h2>Loading your orders...</h2></div>;

    if (orders.length === 0) {
        return (
            <div className="cart-page admin-empty">
                <h2>No Orders Yet 📦</h2>
                <p>You haven't placed any orders.</p>
                <Link to="/products" className="admin-btn admin-btn-primary" style={{ display: 'inline-block', marginTop: '15px', textDecoration: 'none' }}>
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1>My Orders 📦</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                {orders.map(order => {
                    // Safely grab the ID whether Spring Boot capitalized it or not
                    const orderId = order.id || order.Id;

                    return (
                        <div key={orderId} style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '20px', background: 'white' }}>
                            {/* Order Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '15px', marginBottom: '15px' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0' }}>Order #{orderId}</h3>
                                    <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>
                                        Placed on: {new Date(order.orderDate).toLocaleString()}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ padding: '6px 12px', background: '#dbeafe', color: '#1e40af', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                                        {order.status}
                                    </span>
                                    <p style={{ margin: '8px 0 0 0', fontWeight: 'bold', fontSize: '18px' }}>
                                        ${Number(order.totalAmount).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#374151' }}>Items</h4>
                                {order.orderItems?.map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>
                                        <span>{item.quantity}x {item.product?.name || "Product"}</span>
                                        <span>${Number(item.price).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Orders;