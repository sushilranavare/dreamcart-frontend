/*
 * This component provides the main navigation bar
 * for the customer-facing DreamCart application.
 */

import { Link } from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";

function Navbar() {
    const {
        isAuthenticated,
        role,
        logout
    } = useAuth();

    return (
        <nav className="navbar">

            {/* Brand */}
            <Link to="/" className="navbar-brand">
                🛒 DreamCart
            </Link>

            {/* Navigation Links */}
            <div className="navbar-links">

                <Link to="/">
                    Home
                </Link>

                <Link to="/products">
                    Products
                </Link>

                {isAuthenticated && (

                    <Link to="/wishlist">
                        Wishlist
                    </Link>
                )}

                {isAuthenticated && (
                    <Link to="/cart">
                        Cart
                    </Link>
                )}

                {isAuthenticated && (
                    <Link to="/profile">
                        Profile
                    </Link>
                )}

                {role === "ADMIN" && (
                    <Link to="/admin">
                        Admin Dashboard
                    </Link>
                )}

            </div>

            {/* Authentication Links */}
            <div className="navbar-auth">
                {!isAuthenticated ? (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="register-button"
                        >
                            Register
                        </Link>
                    </>
                ) : (
                    <button
                        onClick={logout}
                    >
                        Logout
                    </button>

                )}
            </div>
        </nav>
    );
}


export default Navbar;