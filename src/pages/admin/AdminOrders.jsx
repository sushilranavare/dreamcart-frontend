import { useEffect, useState } from "react";
import orderService from "../../services/orderService.js"; // Adjust path if needed

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAllOrders();
    }, []);

    const loadAllOrders = async () => {
        try {
            const data = await orderService.getAllOrdersAdmin();
            // Sort by newest first
            const sortedOrders = data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            setOrders(sortedOrders);
        } catch (error) {
            console.error("Failed to load orders:", error);
            alert("Failed to load orders. Are you sure you are logged in as an ADMIN?");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatusAdmin(orderId, newStatus);
            // Update the UI locally so we don't have to reload the whole page
            setOrders(orders.map(order => {
                const currentId = order.id || order.Id;
                if (currentId === orderId) {
                    return { ...order, status: newStatus };
                }
                return order;
            }));
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Could not update order status.");
        }
    };

    if (loading) return <div className="cart-page"><h2>Loading all orders...</h2></div>;

    return (
        <div className="cart-page">
            <h1>Admin: Manage Orders ⚙️</h1>

            <div style={{ overflowX: 'auto', marginTop: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#f3f4f6', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '12px' }}>Order ID</th>
                        <th style={{ padding: '12px' }}>Date</th>
                        <th style={{ padding: '12px' }}>Customer</th>
                        <th style={{ padding: '12px' }}>Total</th>
                        <th style={{ padding: '12px' }}>Status</th>
                        <th style={{ padding: '12px' }}>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => {
                        const orderId = order.id || order.Id;
                        return (
                            <tr key={orderId} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '12px' }}>#{orderId}</td>
                                <td style={{ padding: '12px' }}>{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td style={{ padding: '12px' }}>
                                    {order.user?.email || "Unknown User"}<br/>
                                    <small style={{ color: '#6b7280' }}>
                                        {order.shippingAddress?.city}, {order.shippingAddress?.country}
                                    </small>
                                </td>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>
                                    ${Number(order.totalAmount).toFixed(2)}
                                </td>
                                <td style={{ padding: '12px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            backgroundColor: order.status === 'DELIVERED' ? '#d1fae5' : order.status === 'CANCELLED' ? '#fee2e2' : '#fef3c7',
                                            color: order.status === 'DELIVERED' ? '#065f46' : order.status === 'CANCELLED' ? '#991b1b' : '#92400e'
                                        }}>
                                            {order.status}
                                        </span>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(orderId, e.target.value)}
                                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                                    >
                                        <option value="CONFIRMED">CONFIRMED</option>
                                        <option value="PROCESSING">PROCESSING</option>
                                        <option value="SHIPPED">SHIPPED</option>
                                        <option value="DELIVERED">DELIVERED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                    </select>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                {orders.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No orders found in the system.</div>
                )}
            </div>
        </div>
    );
}

export default AdminOrders;