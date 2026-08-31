/*
 * This page lets a logged-in user view and update their own
 * profile details, and change their password.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import profileService from "../services/profileService";

function Profile() {

    const [loading, setLoading] = useState(true);

    // Profile form state
    const [profile, setProfile] = useState({});
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileMessage, setProfileMessage] = useState("");
    const [profileError, setProfileError] = useState("");

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });
    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {

        loadProfile();

    }, []);

    const loadProfile = async () => {

        try {

            const data = await profileService.getProfile();
            setProfile(data);

        } catch (error) {

            console.error("Failed to load profile:", error);

        } finally {

            setLoading(false);

        }

    };

    const handleProfileChange = (e) => {

        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));

    };

    const handleProfileSubmit = async (e) => {

        e.preventDefault();

        setProfileMessage("");
        setProfileError("");
        setSavingProfile(true);

        try {

            const updated = await profileService.updateProfile({
                firstName: profile.firstName,
                lastName: profile.lastName,
                phoneNumber: profile.phoneNumber
            });

            setProfile(updated);
            setProfileMessage("Profile updated successfully.");

        } catch (error) {

            console.error("Failed to update profile:", error);

            setProfileError(
                error.response?.data?.message || "Failed to update profile."
            );

        } finally {

            setSavingProfile(false);

        }

    };

    const handlePasswordChange = (e) => {

        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));

    };

    const handlePasswordSubmit = async (e) => {

        e.preventDefault();

        setPasswordMessage("");
        setPasswordError("");

        if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
            setPasswordError("New password and confirmation do not match.");
            return;
        }

        setSavingPassword(true);

        try {

            await profileService.changePassword(
                passwordForm.currentPassword,
                passwordForm.newPassword
            );

            setPasswordMessage("Password updated successfully.");
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: ""
            });

        } catch (error) {

            console.error("Failed to change password:", error);

            setPasswordError(
                error.response?.data?.message || "Failed to update password."
            );

        } finally {

            setSavingPassword(false);

        }

    };

    if (loading) return <div className="cart-page"><h2>Loading your profile...</h2></div>;

    return (

        <div className="cart-page">

            <h1>My Profile 👤</h1>

            <div style={{ display: 'flex', gap: '30px', marginTop: '20px', flexWrap: 'wrap' }}>

                {/* Left: Profile Details */}
                <div style={{ flex: 1, minWidth: '320px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>

                    <h2>Account Details</h2>

                    {profileMessage && <p style={{ color: '#15803d' }}>{profileMessage}</p>}
                    {profileError && <p style={{ color: '#b91c1c' }}>{profileError}</p>}

                    <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Email</label>
                            <input
                                type="email"
                                value={profile.email || ""}
                                className="admin-input"
                                style={{ width: '100%', padding: '10px', boxSizing: 'border-box', background: '#f3f4f6' }}
                                disabled
                            />
                        </div>

                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>First Name</label>
                            <input
                                name="firstName"
                                value={profile.firstName || ""}
                                onChange={handleProfileChange}
                                className="admin-input"
                                style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Last Name</label>
                            <input
                                name="lastName"
                                value={profile.lastName || ""}
                                onChange={handleProfileChange}
                                className="admin-input"
                                style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Phone Number</label>
                            <input
                                name="phoneNumber"
                                value={profile.phoneNumber || ""}
                                onChange={handleProfileChange}
                                className="admin-input"
                                style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="admin-btn admin-btn-primary"
                            disabled={savingProfile}
                        >
                            {savingProfile ? "Saving..." : "Save Changes"}
                        </button>

                    </form>

                </div>

                {/* Right: Change Password */}
                <div style={{ flex: 1, minWidth: '320px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>

                    <h2>Change Password</h2>

                    {passwordMessage && <p style={{ color: '#15803d' }}>{passwordMessage}</p>}
                    {passwordError && <p style={{ color: '#b91c1c' }}>{passwordError}</p>}

                    <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                className="admin-input"
                                style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                className="admin-input"
                                style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                                minLength={6}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmNewPassword"
                                value={passwordForm.confirmNewPassword}
                                onChange={handlePasswordChange}
                                className="admin-input"
                                style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                                minLength={6}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="admin-btn admin-btn-primary"
                            disabled={savingPassword}
                        >
                            {savingPassword ? "Updating..." : "Update Password"}
                        </button>

                    </form>

                </div>

            </div>

            <p style={{ marginTop: '20px' }}>
                <Link to="/orders" style={{ textDecoration: 'none', color: '#3b82f6', fontWeight: 'bold' }}>
                    View My Orders →
                </Link>
            </p>

        </div>

    );
}

export default Profile;