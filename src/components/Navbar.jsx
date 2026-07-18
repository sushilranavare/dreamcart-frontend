/*
 * This component provides the main navigation bar
 * for the customer-facing DreamCart application.
 */

import { Link } from "react-router-dom";

function Navbar() {
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

                <Link to="/wishlist">
                    Wishlist
                </Link>

                <Link to="/cart">
                    Cart
                </Link>

            </div>

            {/* Authentication Links */}
            <div className="navbar-auth">

                <Link to="/login">
                    Login
                </Link>

                <Link
                    to="/register"
                    className="register-button"
                >
                    Register
                </Link>

            </div>

        </nav>
    );
}

export default Navbar;