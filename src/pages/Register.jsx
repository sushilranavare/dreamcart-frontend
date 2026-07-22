/*
 * This page allows new users to create a DreamCart account.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../services/authService";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: ""

    });

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [loading, setLoading] = useState(false);


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData({

            ...formData,

            [name]: value

        });
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setSuccess("");

        setLoading(true);

        try {

            const response =
                await authService.register(
                    formData
                );

            setSuccess(
                response.message ||
                "Registration successful!"
            );

            /*
             * Backend registration also returns a JWT.
             * We can store it and automatically log the user in.
             */
            if (response.token) {

                localStorage.setItem(
                    "token",
                    response.token
                );

                setTimeout(() => {

                    navigate("/");

                }, 1000);

            } else {

                setTimeout(() => {

                    navigate("/login");

                }, 1000);
            }

        } catch (error) {

            console.error(
                "Registration failed:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Registration failed."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="login-page">

            <div className="login-card">

                <h1>
                    Create Account
                </h1>


                {error && (

                    <p className="error-message">
                        {error}
                    </p>

                )}


                {success && (

                    <p className="success-message">
                        {success}
                    </p>

                )}


                <form
                    onSubmit={handleSubmit}
                >

                    <label>
                        First Name
                    </label>

                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />


                    <label>
                        Last Name
                    </label>

                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />


                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />


                    <label>
                        Phone Number
                    </label>

                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />


                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />


                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Register"
                        }

                    </button>

                    <p className="auth-link">
                        Already have an account?{" "}

                        <span
                            onClick={() => navigate("/login")}
                        >
        Login
    </span>
                    </p>

                </form>

            </div>

        </div>

    );
}

export default Register;