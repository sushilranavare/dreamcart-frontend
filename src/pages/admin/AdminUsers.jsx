import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import userService from "../../services/userService";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users:", error);
            alert("Failed to load users. Are you sure your backend /users endpoint is secured for ADMIN only?");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this user?")) return;

        try {
            await userService.deleteUser(id);
            setUsers(users.filter(user => (user.id || user.Id) !== id)); // Remove from UI
            alert("User deleted successfully.");
        } catch (error) {
            console.error("Failed to delete user:", error);
            alert("Failed to delete user. They might have active orders tied to their account.");
        }
    };

    if (loading) return <div className="cart-page"><h2>Loading users...</h2></div>;

    return (
        <div className="cart-page">
            <Link to="/admin" style={{ textDecoration: 'none', color: '#3b82f6', fontWeight: 'bold' }}>
                ← Back to Dashboard
            </Link>

            <h1 style={{ marginTop: '15px' }}>Manage Users 👥</h1>

            <div style={{ overflowX: 'auto', marginTop: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#f3f4f6', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '12px' }}>ID</th>
                        <th style={{ padding: '12px' }}>Email</th>
                        <th style={{ padding: '12px' }}>Role</th>
                        <th style={{ padding: '12px' }}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => {
                        const userId = user.id || user.Id;

                        // Safely extract the role name whether it's an object or a string
                        const roleName = typeof user.role === 'object' ? user.role.name : (user.role || 'USER');
                        const isAdmin = roleName.includes('ADMIN');

                        return (
                            <tr key={userId} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '12px' }}>{userId}</td>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>{user.email}</td>
                                <td style={{ padding: '12px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            backgroundColor: isAdmin ? '#dbeafe' : '#f3f4f6',
                                            color: isAdmin ? '#1e40af' : '#374151'
                                        }}>
                                            {roleName}
                                        </span>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <button
                                        onClick={() => handleDelete(userId)}
                                        style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                        disabled={isAdmin} // Prevent accidental self-deletion!
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No users found.</div>
                )}
            </div>
        </div>
    );
}

export default AdminUsers;