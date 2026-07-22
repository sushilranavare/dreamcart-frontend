/*
 * This page allows users to log into the DreamCart application.
 *
 * After successful login:
 * 1. The backend returns a JWT token.
 * 2. The token is stored in localStorage.
 * 3. Axios automatically sends the token with future requests.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../services/authService";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setLoading(true);

        try {

            await authService.login(
                email,
                password
            );

            /*
             * Login successful.
             *
             * Navigate to the home page.
             */
            navigate("/");

        } catch (error) {

            console.error(
                "Login failed:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Login failed. Please check your credentials."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="login-page">

            <div className="login-card">

                <h1>
                    Login to DreamCart
                </h1>


                {error && (

                    <p className="error-message">
                        {error}
                    </p>

                )}


                <form
                    onSubmit={handleSubmit}
                >

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />


                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />


                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>

                    <p className="auth-link">
                        Don't have an account?{" "}

                        <span
                            onClick={() => navigate("/register")}
                        >
        Register
    </span>
                    </p>

                </form>

            </div>

        </div>

    );
}

export default Login;