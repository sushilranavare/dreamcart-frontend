/*
 * Admin dashboard for managing DreamCart resources.
 *
 * This page is accessible only to users with the ADMIN role.
 */

import { useAuth } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";

function AdminDashboard() {

    const {
        role
    } = useAuth();


    return (

        <div className="admin-dashboard">

            <h1>
                Admin Dashboard
            </h1>


            <p>
                Welcome, Administrator.
                
            </p>


            <div className="admin-dashboard-grid">

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

                    <button>
                        Manage Users
                    </button>

                </div>

            </div>

        </div>

    );
}

export default AdminDashboard;