/*
 * Admin dashboard for managing DreamCart resources.
 *
 * This page is accessible only to users with the ADMIN role.
 */

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import dashboardService from "../../services/dashboardService.js";

function AdminDashboard() {

    const {
        role
    } = useAuth();

    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {

        loadStatistics();

    }, []);

    /*
     * Fetches store-wide statistics from the backend.
     * Fails silently on the stats row so a broken endpoint
     * never blocks the rest of the dashboard from rendering.
     */
    const loadStatistics = async () => {

        try {

            const data = await dashboardService.getStatistics();
            setStats(data);

        } catch (error) {

            console.error("Failed to load dashboard statistics:", error);

        } finally {

            setStatsLoading(false);

        }

    };

    return (

        <div className="admin-dashboard">

            <h1>
                Admin Dashboard
            </h1>


            <p>
                Welcome, Administrator.

            </p>


            <div className="admin-dashboard-grid" style={{ marginBottom: "30px" }}>

                <div className="admin-card">

                    <h2>
                        Products
                    </h2>

                    <p>
                        Manage products and inventory.
                    </p>

                    <Link
                        to="/admin/products"
                        className="dashboard-button"
                    >
                        Manage Products
                    </Link>

                </div>


                <div className="admin-card">

                    <h2>
                        Categories
                    </h2>

                    <p>
                        Manage product categories.
                    </p>

                    <Link
                        to="/admin/categories"
                        className="dashboard-button">
                        Manage Categories
                    </Link>

                </div>


                <div className="admin-card">

                    <h2>
                        Users
                    </h2>

                    <p>
                        View registered users.
                    </p>

                    <Link to="/admin/users"
                          className="dashboard-button">
                        Manage Users
                    </Link>

                </div>

                <div className="admin-card">

                    <h2>
                        Orders
                    </h2>

                    <p>
                        View and update customer orders.
                    </p>

                    <Link to="/admin/orders"
                          className="dashboard-button">
                        Manage Orders
                    </Link>

                </div>

            </div>


            {/* Store Overview */}
            <div className="admin-dashboard-grid">

                <StatCard label="Total Users" value={stats?.totalUsers} loading={statsLoading} />
                <StatCard label="Total Products" value={stats?.totalProducts} loading={statsLoading} />
                <StatCard label="Total Categories" value={stats?.totalCategories} loading={statsLoading} />
                <StatCard label="Total Orders" value={stats?.totalOrders} loading={statsLoading} />
                <StatCard label="Placed Orders" value={stats?.placedOrders} loading={statsLoading} />
                <StatCard label="Confirmed Orders" value={stats?.confirmedOrders} loading={statsLoading} />
                <StatCard
                    label="Total Revenue"
                    value={stats?.totalRevenue !== undefined ? `$${stats.totalRevenue}` : undefined}
                    loading={statsLoading}
                />
                <StatCard label="Total Reviews" value={stats?.totalReviews} loading={statsLoading} />
                <StatCard label="Wishlist Items" value={stats?.totalWishlistItems} loading={statsLoading} />

            </div>

        </div>

    );
}

/*
 * Small reusable stat tile for the Store Overview row.
 * Shows "..." while loading and "—" if the backend
 * didn't return a value for that field.
 */
function StatCard({ label, value, loading }) {

    return (

        <div className="admin-card">

            <h2 style={{ fontSize: "13px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {label}
            </h2>

            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", margin: "8px 0 0" }}>
                {loading ? "..." : (value ?? "—")}
            </p>

        </div>

    );

}

export default AdminDashboard;